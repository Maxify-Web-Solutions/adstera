const axios = require("axios");
const SmartLink = require("../models/SmartLink");
const Placement = require("../models/AdsterraPlacement");
const AdsterraStats = require("../models/AdsterraStats");

exports.fetchAndStoreAdsterraStats = async (req, res) => {
  try {
    const userId = req.user?.id; // ✅ FIX

    const { country, start_date, finish_date, group_by } = req.query;

    // 🔎 Find SmartLink (ONLY USER BASED)
    const link = await SmartLink.findOne({ userId });

    if (!link) {
      return res.status(404).json({
        success: false,
        message: "No SmartLink found for this user",
      });
    }
    const url = link.redirectUrl || link.targetUrl;
    if (!url) {
      return res.status(400).json({
        success: false,
        message: "No redirect URL found",
      });
    }

    // 🔎 Find Placement
    const placementData = await Placement.findOne({ directUrl: url });
    if (!placementData) {
      return res.status(404).json({
        success: false,
        message: "Placement not found",
      });
    }

    const domain = placementData.domainId;
    const placementId = placementData.placementId;

    // 📅 Default dates
    const today = new Date();
    const defaultFinishDate = today.toISOString().split("T")[0];

    const pastDate = new Date();
    pastDate.setDate(today.getDate() - 15);
    const defaultStartDate = pastDate.toISOString().split("T")[0];

    // 📡 API CALL
    const response = await axios.get(
      "https://api3.adsterratools.com/publisher/stats.json",
      {
        params: {
          domain,
          placement: placementId,
          start_date: start_date || defaultStartDate,
          finish_date: finish_date || defaultFinishDate,
          group_by: group_by || "country",
        },
        headers: {
          Accept: "application/json",
          "X-API-Key": process.env.ADSTERA_API_KEY,
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120 Safari/537.36",
        },
      }
    );

    let apiData = response.data?.items || [];

    if (!apiData.length) {
      return res.json({
        success: true,
        message: "No data from API",
        total: 0,
        data: [],
      });
    }

    // 🌍 COUNTRY FILTER
    if (country) {
      const countries = country.split(",").map(c => c.trim().toLowerCase());
      apiData = apiData.filter(item =>
        countries.includes(item.country?.toLowerCase())
      );
    }

    // 🚀 BULK WRITE
    const bulkOps = apiData.map(item => ({
      updateOne: {
        filter: {
          userId,
          domain,
          placement: placementId,
          country: item.country || "all",
        },
        update: {
          $set: {
            userId, // ✅ ensure stored
            domain,
            placement: placementId,
            country: item.country || "all",
            impressions: Number(item.impression) || 0,
            clicks: Number(item.clicks) || 0,
            revenue: Number(item.revenue) || 0,
          },
        },
        upsert: true,
      },
    }));

    await AdsterraStats.bulkWrite(bulkOps);

    return res.json({
      success: true,
      message: "Stats fetched & stored",
      total: apiData.length,
      data: apiData,
    });

  } catch (error) {
    console.error("Adsterra Error:", error?.response?.data || error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch stats",
      error: error?.response?.data || error.message,
    });
  }
};


exports.getAdsterraStatsFromDB = async (req, res) => {
  try {
    const userId = req.user?.id;

    const {
      country,
      start_date,
      end_date,
      page = 1,
      limit = 20,
    } = req.query;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // 🔍 Get user's domain + placement
    const userStats = await AdsterraStats.find({ userId }).select("domain placement");

    if (!userStats.length) {
      return res.status(404).json({
        success: false,
        message: "No stats found for this user",
      });
    }

    const domainPlacementPairs = [
      ...new Set(userStats.map(item => `${item.domain}-${item.placement}`)),
    ].map(pair => {
      const [domain, placement] = pair.split("-");
      return { domain, placement };
    });

    // 🔍 Base filter
    let filter = {
      userId,
      $or: domainPlacementPairs,
    };

    // 🌍 Country filter
    if (country) {
      filter.country = {
        $in: country.split(",").map(c => c.trim()),
      };
    }

    // 📅 Date filter
    if (start_date && end_date) {
      filter.date = {
        $gte: new Date(start_date),
        $lte: new Date(end_date),
      };
    }

    // 📄 Pagination
    const skip = (page - 1) * limit;

    const stats = await AdsterraStats.find(filter)
      .sort({ createdAt: -1 }) // ⚠️ date null hai to createdAt use karo
      .skip(skip)
      .limit(Number(limit));

    const totalCount = await AdsterraStats.countDocuments(filter);

    const totals = await AdsterraStats.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalImpressions: { $sum: "$impressions" },
          totalClicks: { $sum: "$clicks" },
          totalRevenue: { $sum: "$revenue" },
        },
      },
    ]);

    return res.json({
      success: true,
      page: Number(page),
      limit: Number(limit),
      totalRecords: totalCount,
      totals: totals[0] || {
        totalImpressions: 0,
        totalClicks: 0,
        totalRevenue: 0,
      },
      data: stats,
    });

  } catch (error) {
    console.error("DB GET ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch stats",
      error: error.message,
    });
  }
};
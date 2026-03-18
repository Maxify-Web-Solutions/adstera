const axios = require("axios");
const SmartLink = require("../models/SmartLink");
const Placement = require("../models/AdsterraPlacement");
const AdsterraStats = require("../models/AdsterraStats");

exports.fetchAndStoreAdsterraStats = async (req, res) => {
  try {
    const { smartCode, country, start_date, finish_date, group_by } = req.query;

    if (!smartCode) {
      return res.status(400).json({
        success: false,
        message: "smartCode is required",
      });
    }

    const link = await SmartLink.findOne({ smartCode });
    if (!link) {
      return res.status(404).json({
        success: false,
        message: "SmartLink not found",
      });
    }

    const url = link.redirectUrl || link.targetUrl;
    if (!url) {
      return res.status(400).json({
        success: false,
        message: "No redirect URL found",
      });
    }

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

    // ✅ FIXED DATA EXTRACTION
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

    // 🚀 BULK WRITE (FAST)
    const bulkOps = apiData.map(item => ({
      updateOne: {
        filter: {
          domain,
          placement: placementId,
          country: item.country || "all",
        },
        update: {
          $set: {
            impressions: Number(item.impression) || 0, // ✅ FIX
            clicks: Number(item.clicks) || 0,
            revenue: Number(item.revenue) || 0,
          },
        },
        upsert: true,
      },
    }));

    await AdsterraStats.bulkWrite(bulkOps);

    // 📊 RESPONSE
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
    const {
      domain,
      placement,
      country,
      start_date,
      end_date,
      page = 1,
      limit = 20,
    } = req.query;

    // 🔒 Required validation (optional rakh sakte ho)
    if (!domain || !placement) {
      return res.status(400).json({
        success: false,
        message: "domain and placement are required",
      });
    }

    // 🔍 Filter build
    let filter = {
      domain,
      placement,
    };

    // 🌍 Country filter
    if (country) {
      filter.country = {
        $in: country.split(",").map(c => c.trim()),
      };
    }

    // 📅 Date filter
    if (start_date && end_date) {
      filter.date = { $gte: start_date, $lte: end_date };
    }

    // 📄 Pagination
    const skip = (page - 1) * limit;

    // 📊 Data fetch
    const stats = await AdsterraStats.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit));

    // 🔢 Total count
    const totalCount = await AdsterraStats.countDocuments(filter);

    // 📈 Totals (important)
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
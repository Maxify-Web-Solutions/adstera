const axios = require("axios");
const SmartLink = require("../models/SmartLink");
const Placement = require("../models/AdsterraPlacement");
const AdsterraStats = require("../models/AdsterraStats");
const User = require("../models/authmodel");
const UAParser = require("ua-parser-js");
const Config = require("../models/Config");





exports.fetchAndStoreAdsterraStats = async (req, res) => {
  try {
    const userId = req.user?.id;

    const { country, start_date, finish_date, group_by } = req.query;

    // ✅ GET ALL SMART LINKS
    const links = await SmartLink.find({ userId });

    if (!links.length) {
      return res.status(404).json({
        success: false,
        message: "No SmartLinks found",
      });
    }

    const config = await Config.findOne();

    if (!config?.adsterraApiKey) {
      return res.status(400).json({
        success: false,
        message: "Adsterra API key not set",
      });
    }

    const todayDate = new Date().toISOString().split("T")[0];

    const today = new Date();
    const defaultFinishDate = today.toISOString().split("T")[0];

    const pastDate = new Date();
    pastDate.setDate(today.getDate() - 15);
    const defaultStartDate = pastDate.toISOString().split("T")[0];

    const ua = req.headers["user-agent"];
    const parser = new UAParser(ua);

    const device = parser.getDevice();
    const os = parser.getOS();
    const browser = parser.getBrowser();

    let allData = [];
    let bulkOps = [];
    let totalRevenue = 0;

    // =========================
    // LOOP ALL SMART LINKS
    // =========================
    for (const link of links) {
      const url = link.redirectUrl || link.targetUrl;

      if (!url) continue;

      // 🔥 FIX: better matching (remove query params)
      const cleanUrl = url.split("?")[0];

      const placementData = await Placement.findOne({
        directUrl: { $regex: cleanUrl, $options: "i" },
      });

      if (!placementData) {
        console.log("No placement found for:", url);
        continue;
      }

      const domain = placementData.domainId;
      const placementId = placementData.placementId;

      // =========================
      // API CALL
      // =========================
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
            "X-API-Key": config.adsterraApiKey,
          },
        }
      );

      let apiData = response.data?.items || [];

      // =========================
      // COUNTRY FILTER
      // =========================
      if (country) {
        const countries = country
          .split(",")
          .map(c => c.trim().toLowerCase());

        apiData = apiData.filter(item =>
          countries.includes(item.country?.toLowerCase())
        );
      }

      allData.push(...apiData);

      // =========================
      // BULK OPS
      // =========================
      apiData.forEach(item => {
        const impressions = Number(item.impression) || 0;
        const clicks = Number(item.clicks) || 0;
        const revenue = (Number(item.revenue) || 0) / 2;

        totalRevenue += revenue;

        const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
        const cpm = impressions > 0 ? (revenue / impressions) * 1000 : 0;

        bulkOps.push({
          updateOne: {
            filter: {
              userId,

              // 🔥 FIX: IMPORTANT — prevent overwrite between links
              smartLinkId: link._id,
              linkId: link.linkId,

              domain,
              placement: placementId,
              country: item.country || "all",
              date: todayDate,
            },
            update: {
              $set: {
                userId,
                smartLinkId: link._id,
                linkId: link.linkId,
                linkName: link.name,

                domain,
                placement: placementId,
                country: item.country || "all",
                date: todayDate,

                impressions,
                clicks,
                revenue,
                ctr,
                cpm,

                device: device.type || "desktop",
                deviceModel: device.model || "",
                deviceVendor: device.vendor || "",

                osName: os.name || "",
                osVersion: os.version || "",

                browserName: browser.name || "",
                browserVersion: browser.version || "",
              },
            },
            upsert: true,
          },
        });
      });
    }

    // =========================
    // SAVE STATS
    // =========================
    if (bulkOps.length) {
      await AdsterraStats.bulkWrite(bulkOps);
    }

    // =========================
    // UPDATE USER REVENUE
    // =========================
    await User.findByIdAndUpdate(userId, {
      $set: {
        revenue: totalRevenue.toFixed(2),
      },
    });

    return res.json({
      success: true,
      message: "All stats fetched & stored successfully",
      total: allData.length,
      linksProcessed: links.length,
      revenue: totalRevenue.toFixed(2),
      data: allData,
    });

  } catch (error) {
    console.error("Adsterra Error:", error?.response?.data || error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch stats",
      error: error.message,
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
      $or: domainPlacementPairs.map(p => ({
        domain: p.domain,
        placement: p.placement,
      })),
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
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const totalCount = await AdsterraStats.countDocuments(filter);

    // 🔥 TOTALS CALCULATION
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

    const totalRevenue = totals[0]?.totalRevenue || 0;

    // 🔥🔥 USER REVENUE UPDATE
    await User.findByIdAndUpdate(
      userId,
      { $set: { revenue: totalRevenue } },
      { new: true }
    );

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
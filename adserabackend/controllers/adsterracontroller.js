const axios = require("axios");
const SmartLink = require("../models/SmartLink");
const Placement = require("../models/AdsterraPlacement");
const AdsterraStats = require("../models/AdsterraStats");
const User = require("../models/authmodel");
const UAParser = require("ua-parser-js");
const Config = require("../models/Config");
const mongoose = require("mongoose");
const SmartLinkStats = require("../models/SmartLinkStats");






// exports.fetchAndStoreAdsterraStats = async (req, res) => {
//   try {
//     const userId = req.user?.id; // ✅ FIX

//     const { country, start_date, finish_date, group_by } = req.query;

//     // 🔎 Find SmartLink (ONLY USER BASED)
//     const link = await SmartLink.findOne({ userId });

//     if (!link) {
//       return res.status(404).json({
//         success: false,
//         message: "No SmartLink found for this user",
//       });
//     }


//     const url = link.redirectUrl || link.targetUrl;
//     const id = link.plcementId;


//     console.log(id, "ye h id")

//     if (!url) {
//       return res.status(400).json({
//         success: false,
//         message: "No redirect URL found",
//       });
//     }

//     // 🔎 Find Placement
//     const placementData = await Placement.findOne({ directUrl: url });
//     if (!placementData) {
//       return res.status(404).json({
//         success: false,
//         message: "Placement not found",
//       });
//     }

//     const domain = placementData.domainId;
//     const placementId = placementData.placementId;
//     const todayDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

//     // 📅 Default dates
//     const today = new Date();
//     const defaultFinishDate = today.toISOString().split("T")[0];

//     const pastDate = new Date();
//     pastDate.setDate(today.getDate() - 15);
//     const defaultStartDate = pastDate.toISOString().split("T")[0];

//     const config = await Config.findOne();

//     if (!config || !config.adsterraApiKey) {
//       return res.status(400).json({ message: "Adsterra API key not set" });
//     }

//     const response = await axios.get(
//       "https://api3.adsterratools.com/publisher/stats.json",
//       {
//         params: {
//           domain,
//           placement: placementId,
//           start_date: start_date || defaultStartDate,
//           finish_date: finish_date || defaultFinishDate,
//           group_by: group_by || "country",
//         },
//         headers: {
//           Accept: "application/json",
//           "X-API-Key": config.adsterraApiKey, // ✅ FIX
//           "User-Agent":
//             "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120 Safari/537.36",
//         },
//       }
//     );
//     let apiData = response.data?.items || [];


//     if (!apiData.length) {
//       return res.json({
//         success: true,
//         message: "No data from API",
//         total: 0,
//         data: [],
//       });
//     }

//     // 🌍 COUNTRY FILTER
//     if (country) {
//       const countries = country.split(",").map(c => c.trim().toLowerCase());
//       apiData = apiData.filter(item =>
//         countries.includes(item.country?.toLowerCase())
//       );
//     }

//     // 🚀 BULK WRITE
//     const ua = req.headers["user-agent"];
//     const parser = new UAParser(ua);

//     const device = parser.getDevice();
//     const os = parser.getOS();
//     const browser = parser.getBrowser();

//     const bulkOps = apiData.map(item => {
//       const impressions = Number(item.impression) || 0;
//       const clicks = Number(item.clicks) || 0;
//       const revenue = (Number(item.revenue) || 0) / 2;

//       // ✅ Safe calculations
//       const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
//       const cpm = impressions > 0 ? (revenue / impressions) * 1000 : 0;

//       return {
//         updateOne: {
//           filter: {
//             userId,
//             domain,
//             placement: placementId,
//             country: item.country || "all",
//             date: todayDate,
//             device: device.type || "desktop",
//             deviceModel: device.model || "",
//             deviceVendor: device.vendor || "",

//             osName: os.name || "",
//             osVersion: os.version || "",

//             browserName: browser.name || "",
//             browserVersion: browser.version || "",
//           },
//           update: {
//             $set: {
//               userId,
//               domain,
//               placement: placementId,
//               country: item.country || "all",
//               date: todayDate,

//               // stats
//               impressions,
//               clicks,
//               revenue,
//               ctr,
//               cpm,

//               // ✅ NEW FIELDS

//             },
//           },
//           upsert: true,
//         },
//       };
//     });

//     // 🔥 TOTAL REVENUE CALCULATE FROM API DATA
//     const totalRevenue = (
//       apiData.reduce((sum, item) => {
//         return sum + (Number(item.revenue) || 0);
//       }, 0) / 2
//     ).toFixed(2);
//     // 🔥 ADD TO USER REVENUE (NO DUPLICATE ISSUE)
//     await User.findByIdAndUpdate(
//       userId,
//       { $inc: { revenue: totalRevenue } },
//       { returnDocument: "after" }
//     );

//     await AdsterraStats.bulkWrite(bulkOps);

//     return res.json({
//       success: true,
//       message: "Stats fetched & stored",
//       total: apiData.length,
//       data: apiData,
//     });

//   } catch (error) {
//     console.error("Adsterra Error:", error?.response?.data || error.message);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch stats",
//       error: error?.response?.data || error.message,
//     });
//   }
// };

exports.fetchAndStoreAdsterraStats = async (req, res) => {
  try {
    const userId = req.user?.id;

    const { country, start_date, finish_date } = req.query;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const links = await SmartLink.find({ userId });

    if (!links.length) {
      return res.status(404).json({
        success: false,
        message: "No SmartLinks found",
      });
    }

    const today = new Date();

    const defaultFinishDate = today.toISOString().split("T")[0];

    const pastDate = new Date();
    pastDate.setDate(today.getDate() - 15);

    const defaultStartDate = pastDate.toISOString().split("T")[0];

    const config = await Config.findOne();

    if (!config?.adsterraApiKey) {
      return res.status(400).json({
        success: false,
        message: "Adsterra API key not found",
      });
    }

    const ua = req.headers["user-agent"];
    const parser = new UAParser(ua);

    const device = parser.getDevice();
    const os = parser.getOS();
    const browser = parser.getBrowser();

    let allOverallOps = [];
    let allCountryOps = [];
    let totalRevenue = 0;

    // ================= HELPERS =================
    const normalizeCountry = (c) =>
      (c || "UNKNOWN").toString().trim().toUpperCase();

    const normalizeDate = (d) => {
      if (!d) return today.toISOString().split("T")[0];

      if (typeof d === "string") {
        return d.includes("T") ? d.split("T")[0] : d;
      }

      if (d instanceof Date) {
        return d.toISOString().split("T")[0];
      }

      return today.toISOString().split("T")[0];
    };

    const toTime = (d) => new Date(d).getTime();

    // ================= LOOP LINKS =================
    for (const link of links) {
      const placementId = link.placementId;
      if (!placementId) continue;

      const approvedAt = link.approvedAt
        ? new Date(link.approvedAt)
        : null;

        console.log(approvedAt, "approved ")
      const domain =
        link.domain || link.redirectUrl || link.targetUrl || "unknown";

      // ================= OVERALL =================
      const overallResponse = await axios.get(
        "https://api3.adsterratools.com/publisher/stats.json",
        {
          params: {
            placement: placementId,
            start_date: start_date || defaultStartDate,
            finish_date: finish_date || defaultFinishDate,
            group_by: "date",
          },
          headers: {
            Accept: "application/json",
            "X-API-Key": config.adsterraApiKey,
            "User-Agent": "Mozilla/5.0",
          },
        }
      );

      let overallData = overallResponse.data?.items || [];

      // 🔥 FILTER BY APPROVED DATE
      overallData = overallData.filter((item) => {
        if (!approvedAt) return true;

        return toTime(normalizeDate(item.date)) >= toTime(approvedAt);
      });

      // ================= COUNTRY =================
      const countryResponse = await axios.get(
        "https://api3.adsterratools.com/publisher/stats.json",
        {
          params: {
            placement: placementId,
            start_date: start_date || defaultStartDate,
            finish_date: finish_date || defaultFinishDate,
            group_by: "country",
          },
          headers: {
            Accept: "application/json",
            "X-API-Key": config.adsterraApiKey,
            "User-Agent": "Mozilla/5.0",
          },
        }
      );

      let countryData = countryResponse.data?.items || [];

      // REMOVE EMPTY
      countryData = countryData.filter(
        (item) => item?.country && item.country.trim() !== ""
      );

      // FILTER COUNTRY QUERY
      if (country) {
        const countries = country
          .split(",")
          .map((c) => c.trim().toUpperCase());

        countryData = countryData.filter((item) =>
          countries.includes(normalizeCountry(item.country))
        );
      }

      // 🔥 FILTER BY APPROVED DATE
      countryData = countryData.filter((item) => {
        if (!approvedAt) return true;
        return toTime(today) >= toTime(approvedAt);
      });

      // ================= OVERALL OPS =================
      const overallOps = overallData.map((item) => {
        const impressions = Number(item.impression) || 0;
        const clicks = Number(item.clicks) || 0;
        const revenue = (Number(item.revenue) || 0) / 2;

        const ctr = impressions ? (clicks / impressions) * 100 : 0;
        const cpm = impressions ? (revenue / impressions) * 1000 : 0;

        const statsDate = normalizeDate(item.date);

        totalRevenue += revenue;

        return {
          updateOne: {
            filter: {
              userId,
              placement: placementId,
              country: "ALL",
              date: statsDate,
            },
            update: {
              $set: {
                userId,
                domain,
                placement: placementId,
                country: "ALL",
                date: statsDate,
                device: device.type || "desktop",
                osName: os.name || "",
                browserName: browser.name || "",
                impressions,
                clicks,
                revenue,
                ctr,
                cpm,
              },
            },
            upsert: true,
          },
        };
      });

      // ================= COUNTRY OPS =================
      const countryOps = countryData.map((item) => {
        const impressions = Number(item.impression) || 0;
        const clicks = Number(item.clicks) || 0;
        const revenue = (Number(item.revenue) || 0) / 2;

        const ctr = impressions ? (clicks / impressions) * 100 : 0;
        const cpm = impressions ? (revenue / impressions) * 1000 : 0;

        const statsDate = normalizeDate(today);

        return {
          updateOne: {
            filter: {
              userId,
              placement: placementId,
              country: normalizeCountry(item.country),
              date: statsDate,
            },
            update: {
              $set: {
                userId,
                domain,
                placement: placementId,
                country: normalizeCountry(item.country),
                date: statsDate,
                device: device.type || "desktop",
                osName: os.name || "",
                browserName: browser.name || "",
                impressions,
                clicks,
                revenue,
                ctr,
                cpm,
              },
            },
            upsert: true,
          },
        };
      });

      allOverallOps.push(...overallOps);
      allCountryOps.push(...countryOps);
    }

    // ================= DEDUPE =================
    const dedupe = (ops) => {
      const map = new Map();

      for (const op of ops) {
        const f = op.updateOne.filter;

        const key = [
          f.userId.toString(),
          f.placement,
          f.country,
          f.date,
        ].join("|");

        map.set(key, op);
      }

      return [...map.values()];
    };

    const finalOverallOps = dedupe(allOverallOps);
    const finalCountryOps = dedupe(allCountryOps);

    // ================= SAVE =================
    if (finalOverallOps.length) {
      await AdsterraStats.bulkWrite(finalOverallOps);
    }

    if (finalCountryOps.length) {
      await SmartLinkStats.bulkWrite(finalCountryOps);
    }

    // ================= USER UPDATE =================
    await User.findByIdAndUpdate(userId, {
      $set: { revenue: totalRevenue || 0 },
    });

    return res.status(200).json({
      success: true,
      message: "Stats fetched & stored successfully",
      overallSaved: finalOverallOps.length,
      countrySaved: finalCountryOps.length,
      totalRevenue,
    });
  } catch (error) {
    console.error(
      "ADSTERRA FETCH ERROR =>",
      error?.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch stats",
      error: error?.response?.data || error.message,
    });
  }
};

// exports.getAdsterraStatsFromDB =
//   async (req, res) => {
//     try {
//       const userId =
//         req.user?.id;

//       const {
//         country,
//         start_date,
//         end_date,
//         page = 1,
//         limit = 20,
//         placement,
//       } = req.query;

//       // ✅ AUTH
//       if (!userId) {
//         return res.status(401).json({
//           success: false,
//           message: "Unauthorized",
//         });
//       }

//       // ✅ FILTER
//       const filter = {
//         userId:
//           new mongoose.Types.ObjectId(
//             userId
//           ),
//       };

//       // ✅ Placement filter
//       if (placement) {
//         filter.placement =
//           placement;
//       }

//       // ✅ Country filter
//       if (country) {
//         filter.country = {
//           $in: country
//             .split(",")
//             .map((c) =>
//               c
//                 .trim()
//                 .toLowerCase()
//             ),
//         };
//       }

//       // ✅ Date filter
//       if (
//         start_date &&
//         end_date
//       ) {
//         filter.date = {
//           $gte: start_date,
//           $lte: end_date,
//         };
//       }

//       // ✅ PAGINATION
//       const currentPage =
//         Number(page) || 1;

//       const perPage =
//         Number(limit) || 20;

//       const skip =
//         (currentPage - 1) *
//         perPage;

//       // ✅ FETCH DATA
//       const stats =
//         await AdsterraStats.find(
//           filter
//         )
//           .sort({
//             date: -1,
//           })
//           .skip(skip)
//           .limit(perPage)
//           .lean();

//       // ✅ COUNT
//       const totalRecords =
//         await AdsterraStats.countDocuments(
//           filter
//         );

//       // ✅ TOTALS
//       const totalsAgg =
//         await AdsterraStats.aggregate(
//           [
//             {
//               $match: filter,
//             },

//             {
//               $group: {
//                 _id: null,

//                 totalImpressions:
//                 {
//                   $sum: {
//                     $toDouble:
//                       "$impressions",
//                   },
//                 },

//                 totalClicks: {
//                   $sum: {
//                     $toDouble:
//                       "$clicks",
//                   },
//                 },

//                 totalRevenue: {
//                   $sum: {
//                     $toDouble:
//                       "$revenue",
//                   },
//                 },
//               },
//             },
//           ]
//         );

//       const totals =
//         totalsAgg[0] || {
//           totalImpressions: 0,
//           totalClicks: 0,
//           totalRevenue: 0,
//         };

//       // ✅ CTR
//       const ctr =
//         totals.totalImpressions >
//           0
//           ? (totals.totalClicks /
//             totals.totalImpressions) *
//           100
//           : 0;

//       // ✅ CPM
//       const cpm =
//         totals.totalImpressions >
//           0
//           ? (totals.totalRevenue /
//             totals.totalImpressions) *
//           1000
//           : 0;

//       // ✅ UPDATE USER REVENUE
//       await User.findByIdAndUpdate(
//         userId,
//         {
//           $set: {
//             revenue:
//               totals.totalRevenue ||
//               0,
//           },
//         }
//       );

//       // ✅ RESPONSE
//       return res.status(200).json({
//         success: true,

//         page: currentPage,

//         limit: perPage,

//         totalPages: Math.ceil(
//           totalRecords /
//           perPage
//         ),

//         totalRecords,

//         totals: {
//           totalImpressions:
//             Number(
//               totals.totalImpressions ||
//               0
//             ),

//           totalClicks: Number(
//             totals.totalClicks ||
//             0
//           ),

//           totalRevenue: Number(
//             (
//               totals.totalRevenue ||
//               0
//             ).toFixed(6)
//           ),

//           ctr: Number(
//             ctr.toFixed(2)
//           ),

//           cpm: Number(
//             cpm.toFixed(6)
//           ),
//         },

//         data: stats,
//       });
//     } catch (error) {
//       console.error(
//         "DB GET ERROR =>",
//         error
//       );

//       return res.status(500).json({
//         success: false,

//         message:
//           "Failed to fetch stats",

//         error: error.message,
//       });
//     }
//   };


exports.getAdsterraStatsFromDB = async (
  req,
  res
) => {
  try {
    const userId = req.user?.id;

    const {
      country,
      start_date,
      end_date,
      page = 1,
      limit = 20,
      placement,
    } = req.query;

    // ✅ AUTH CHECK
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // ✅ FILTER
    const filter = {
      userId: new mongoose.Types.ObjectId(
        userId
      ),
    };

    // ✅ Placement filter
    if (placement) {
      filter.placement = placement;
    }

    // ✅ Country filter
    if (country) {
      filter.country = {
        $in: country
          .split(",")
          .map((c) =>
            c.trim().toUpperCase()
          ),
      };
    }

    // ✅ Date filter
    if (start_date && end_date) {
      filter.date = {
        $gte: start_date,
        $lte: end_date,
      };
    }

    // ✅ PAGINATION
    const currentPage =
      Number(page) || 1;

    const perPage =
      Number(limit) || 20;

    const skip =
      (currentPage - 1) * perPage;

    // ✅ FETCH DATA
    const stats =
      await AdsterraStats.find(filter)
        .sort({ date: -1 })
        .skip(skip)
        .limit(perPage)
        .lean();

    // ✅ TOTAL RECORDS
    const totalRecords =
      await AdsterraStats.countDocuments(
        filter
      );

    // ✅ TOTALS
    const totalsAgg =
      await AdsterraStats.aggregate([
        {
          $match: filter,
        },

        {
          $group: {
            _id: null,

            totalImpressions: {
              $sum: {
                $toDouble:
                  "$impressions",
              },
            },

            totalClicks: {
              $sum: {
                $toDouble: "$clicks",
              },
            },

            totalRevenue: {
              $sum: {
                $toDouble:
                  "$revenue",
              },
            },
          },
        },
      ]);

    const totals = totalsAgg[0] || {
      totalImpressions: 0,
      totalClicks: 0,
      totalRevenue: 0,
    };

    // ✅ CTR
    const ctr =
      totals.totalImpressions > 0
        ? (totals.totalClicks /
          totals.totalImpressions) *
        100
        : 0;

    // ✅ CPM
    const cpm =
      totals.totalImpressions > 0
        ? (totals.totalRevenue /
          totals.totalImpressions) *
        1000
        : 0;

    // ✅ UPDATE USER REVENUE
    await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          revenue:
            totals.totalRevenue || 0,
        },
      }
    );

    // ✅ RESPONSE
    return res.status(200).json({
      success: true,

      page: currentPage,
      limit: perPage,

      totalPages: Math.ceil(
        totalRecords / perPage
      ),

      totalRecords,

      totals: {
        totalImpressions: Number(
          totals.totalImpressions || 0
        ),

        totalClicks: Number(
          totals.totalClicks || 0
        ),

        totalRevenue: Number(
          (
            totals.totalRevenue || 0
          ).toFixed(6)
        ),

        ctr: Number(
          ctr.toFixed(2)
        ),

        cpm: Number(
          cpm.toFixed(6)
        ),
      },

      data: stats,
    });
  } catch (error) {
    console.error(
      "DB GET ERROR =>",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch stats",

      error: error.message,
    });
  }
};
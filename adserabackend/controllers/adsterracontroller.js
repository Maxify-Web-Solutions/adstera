const axios = require("axios");
const SmartLink = require("../models/SmartLink");
const Placement = require("../models/AdsterraPlacement");
const AdsterraStats = require("../models/AdsterraStats");
const User = require("../models/authmodel");
const UAParser = require("ua-parser-js");
const Config = require("../models/Config");
const mongoose = require("mongoose");
const SmartLinkStats = require("../models/SmartLinkStats");




exports.fetchAndStoreAdsterraStats = async (req, res) => {
  try {
    const userId = req.user?.id;

    const {
      country,
      start_date,
      finish_date,
    } = req.query;

    // ================= AUTH =================

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // ================= LINKS =================

    const links = await SmartLink.find({
      userId,
    });

    if (!links.length) {
      return res.status(404).json({
        success: false,
        message: "No SmartLinks found",
      });
    }

    // ================= DATES =================

    const today = new Date();

    const defaultFinishDate =
      today.toISOString().split("T")[0];

    const pastDate = new Date();

    pastDate.setDate(today.getDate() - 15);

    const defaultStartDate =
      pastDate.toISOString().split("T")[0];

    // ================= CONFIG =================

    const config = await Config.findOne();

    if (!config?.adsterraApiKey) {
      return res.status(400).json({
        success: false,
        message: "Adsterra API key not found",
      });
    }

    // ================= DEVICE INFO =================

    const ua =
      req.headers["user-agent"];

    const parser = new UAParser(ua);

    const device = parser.getDevice();

    const os = parser.getOS();

    const browser =
      parser.getBrowser();

    // ================= HELPERS =================

    const normalizeCountry = (c) =>
      (c || "UNKNOWN")
        .toString()
        .trim()
        .toUpperCase();

    const normalizeDate = (d) => {
      if (!d) {
        return today
          .toISOString()
          .split("T")[0];
      }

      if (typeof d === "string") {
        return d.includes("T")
          ? d.split("T")[0]
          : d;
      }

      if (d instanceof Date) {
        return d
          .toISOString()
          .split("T")[0];
      }

      return today
        .toISOString()
        .split("T")[0];
    };

    // ================= STORAGE =================

    let allOverallOps = [];

    let allCountryOps = [];

    let totalRevenue = 0;

    // =============================================
    // LOOP LINKS
    // =============================================

    for (const link of links) {
      const placementId =
        String(link.placementId);

      if (!placementId) continue;

      const approvedDate =
        link.approvedAt
          ? normalizeDate(
            link.approvedAt
          )
          : null;

      const domain =
        link.domain ||
        link.redirectUrl ||
        link.targetUrl ||
        "unknown";

      // =============================================
      // OVERALL API
      // =============================================

      const overallResponse =
        await axios.get(
          "https://api3.adsterratools.com/publisher/stats.json",
          {
            params: {
              placement: placementId,

              start_date:
                start_date ||
                defaultStartDate,

              finish_date:
                finish_date ||
                defaultFinishDate,

              group_by: "date",
            },

            headers: {
              Accept:
                "application/json",

              "X-API-Key":
                config.adsterraApiKey,

              "User-Agent":
                "Mozilla/5.0",
            },
          }
        );

      let overallData =
        overallResponse.data?.items ||
        [];

      console.log(
        "OVERALL DATA =>",
        overallData
      );

      // =============================================
      // FILTER APPROVED DATE
      // =============================================

      overallData =
        overallData.filter((item) => {
          if (!approvedDate)
            return true;

          const itemDate =
            normalizeDate(
              item.date
            );

          return (
            itemDate >= approvedDate
          );
        });

      // =============================================
      // COUNTRY API
      // =============================================

      const countryResponse =
        await axios.get(
          "https://api3.adsterratools.com/publisher/stats.json",
          {
            params: {
              placement: placementId,

              start_date:
                start_date ||
                defaultStartDate,

              finish_date:
                finish_date ||
                defaultFinishDate,

              group_by: "country",
            },

            headers: {
              Accept:
                "application/json",

              "X-API-Key":
                config.adsterraApiKey,

              "User-Agent":
                "Mozilla/5.0",
            },
          }
        );

      let countryData =
        countryResponse.data?.items ||
        [];

      // =============================================
      // REMOVE EMPTY COUNTRY
      // =============================================

      countryData =
        countryData.filter(
          (item) =>
            item?.country &&
            item.country.trim() !== ""
        );

      // =============================================
      // COUNTRY FILTER
      // =============================================

      if (country) {
        const countries = country
          .split(",")
          .map((c) =>
            c
              .trim()
              .toUpperCase()
          );

        countryData =
          countryData.filter((item) =>
            countries.includes(
              normalizeCountry(
                item.country
              )
            )
          );
      }

      // =============================================
      // OVERALL OPS
      // =============================================



      const overallOps =
        overallData.map((item) => {
          const impressions =
            Number(
              item.impression
            ) || 0;

          const clicks =
            Number(item.clicks) ||
            0;

          // ✅ NO DIVIDE BY 2
          const revenue =
            Number(item.revenue) ||
            0;

          const ctr =
            impressions > 0
              ? (clicks /
                impressions) *
              100
              : 0;

          const cpm =
            Number(item.cpm) || 0;

          const statsDate =
            normalizeDate(
              item.date
            );

          totalRevenue += revenue;

          return {
            updateOne: {
              filter: {
                userId:
                  new mongoose.Types.ObjectId(
                    userId
                  ),

                placement:
                  placementId,

                country: "ALL",

                date: statsDate,
              },

              update: {
                $set: {
                  userId:
                    new mongoose.Types.ObjectId(
                      userId
                    ),

                  domain,

                  placement:
                    placementId,

                  country: "ALL",

                  date: statsDate,

                  device:
                    device.type ||
                    "desktop",

                  osName:
                    os.name || "",

                  browserName:
                    browser.name ||
                    "",

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

      // =============================================
      // COUNTRY OPS
      // =============================================

      const countryOps =
        countryData.map((item) => {
          const impressions =
            Number(
              item.impression
            ) || 0;

          const clicks =
            Number(item.clicks) ||
            0;

          // ✅ NO DIVIDE BY 2
          const revenue =
            Number(item.revenue) ||
            0;

          const ctr =
            impressions > 0
              ? (clicks /
                impressions) *
              100
              : 0;

          const cpm =
            Number(item.cpm) || 0;

          const statsDate =
            normalizeDate(
              finish_date ||
              today
            );

          return {
            updateOne: {
              filter: {
                userId:
                  new mongoose.Types.ObjectId(
                    userId
                  ),

                placement:
                  placementId,

                country:
                  normalizeCountry(
                    item.country
                  ),

                date: statsDate,
              },

              update: {
                $set: {
                  userId:
                    new mongoose.Types.ObjectId(
                      userId
                    ),

                  domain,

                  placement:
                    placementId,

                  country:
                    normalizeCountry(
                      item.country
                    ),

                  date: statsDate,

                  device:
                    device.type ||
                    "desktop",

                  osName:
                    os.name || "",

                  browserName:
                    browser.name ||
                    "",

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

      allOverallOps.push(
        ...overallOps
      );

      allCountryOps.push(
        ...countryOps
      );
    }

    // =============================================
    // DEDUPE
    // =============================================

    const dedupe = (ops) => {
      const map = new Map();

      for (const op of ops) {
        const f =
          op.updateOne.filter;

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

    const finalOverallOps =
      dedupe(allOverallOps);

    const finalCountryOps =
      dedupe(allCountryOps);

    // =============================================
    // SAVE
    // =============================================

    if (
      finalOverallOps.length
    ) {
      await AdsterraStats.bulkWrite(
        finalOverallOps
      );
    }

    if (
      finalCountryOps.length
    ) {
      await SmartLinkStats.bulkWrite(
        finalCountryOps
      );
    }

    // =============================================
    // UPDATE USER REVENUE
    // =============================================

    await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          revenue:
            totalRevenue || 0,
        },
      }
    );

    // =============================================
    // RESPONSE
    // =============================================

    return res.status(200).json({
      success: true,

      message:
        "Stats fetched & stored successfully",

      overallSaved:
        finalOverallOps.length,

      countrySaved:
        finalCountryOps.length,

      totalRevenue,
    });
  } catch (error) {
    console.error(
      "ADSTERRA FETCH ERROR =>",
      error?.response?.data ||
      error.message
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to fetch stats",

      error:
        error?.response?.data ||
        error.message,
    });
  }
};

// =============================================
// GET STATS FROM DB
// =============================================

exports.getAdsterraStatsFromDB =
  async (req, res) => {
    try {
      const userId =
        req.user?.id;

      const {
        start_date,
        end_date,
        page = 1,
        limit = 20,
        placement,
      } = req.query;

      // ================= AUTH =================

      if (!userId) {
        return res.status(401).json({
          success: false,
          message:
            "Unauthorized",
        });
      }

      // ================= FILTER =================

      const filter = {
        userId:
          new mongoose.Types.ObjectId(
            userId
          ),

        country: "ALL",
      };

      // ================= PLACEMENT =================

      if (placement) {
        filter.placement =
          String(placement);
      }

      // ================= DATE =================

      if (
        start_date &&
        end_date
      ) {
        filter.date = {
          $gte: start_date,
          $lte: end_date,
        };
      }

      // ================= PAGINATION =================

      const currentPage =
        Number(page) || 1;

      const perPage =
        Number(limit) || 20;

      const skip =
        (currentPage - 1) *
        perPage;

      // ================= FETCH DATA =================

      const stats =
        await AdsterraStats.find(
          filter
        )
          .sort({
            date: -1,
          })
          .skip(skip)
          .limit(perPage)
          .lean();

      // ================= TOTAL RECORDS =================

      const totalRecords =
        await AdsterraStats.countDocuments(
          filter
        );

      // ================= TOTALS =================

      const totalsAgg =
        await AdsterraStats.aggregate(
          [
            {
              $match: filter,
            },

            {
              $group: {
                _id: null,

                totalImpressions:
                {
                  $sum: {
                    $toDouble:
                      "$impressions",
                  },
                },

                totalClicks: {
                  $sum: {
                    $toDouble:
                      "$clicks",
                  },
                },

                totalRevenue:
                {
                  $sum: {
                    $toDouble:
                      "$revenue",
                  },
                },
              },
            },
          ]
        );

      const totals =
        totalsAgg[0] || {
          totalImpressions: 0,
          totalClicks: 0,
          totalRevenue: 0,
        };

      // ================= CTR =================

      const ctr =
        totals.totalImpressions >
          0
          ? (totals.totalClicks /
            totals.totalImpressions) *
          100
          : 0;

      // ================= CPM =================

      const cpm =
        totals.totalImpressions >
          0
          ? (totals.totalRevenue /
            totals.totalImpressions) *
          1000
          : 0;

      // ================= UPDATE USER =================

      await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            revenue:
              totals.totalRevenue ||
              0,
          },
        }
      );

      // ================= RESPONSE =================

      return res.status(200).json({
        success: true,

        page: currentPage,

        limit: perPage,

        totalPages: Math.ceil(
          totalRecords /
          perPage
        ),

        totalRecords,

        totals: {
          totalImpressions:
            Number(
              totals.totalImpressions ||
              0
            ),

          totalClicks: Number(
            totals.totalClicks ||
            0
          ),

          totalRevenue:
            Number(
              (
                totals.totalRevenue ||
                0
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
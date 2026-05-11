const axios = require("axios");
const mongoose = require("mongoose");
const UAParser = require("ua-parser-js");

const SmartLink = require("../models/SmartLink");
const AdsterraStats = require("../models/AdsterraStats");
const SmartLinkStats = require("../models/SmartLinkStats");
const User = require("../models/authmodel");
const Config = require("../models/Config");

exports.fetchAndStoreAdsterraStats =
  async (req, res) => {
    try {
      // =====================================================
      // AUTH
      // =====================================================

      const userId =
        req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message:
            "Unauthorized",
        });
      }

      // =====================================================
      // QUERY
      // =====================================================

      const {
        country,
        start_date,
        end_date,
      } = req.query;

      // =====================================================
      // LINKS
      // =====================================================

      const links =
        await SmartLink.find({
          userId,
        });

      if (!links.length) {
        return res.status(404).json({
          success: false,
          message:
            "No SmartLinks found",
        });
      }

      // =====================================================
      // CONFIG
      // =====================================================

      const config =
        await Config.findOne();

      if (
        !config?.adsterraApiKey
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Adsterra API key not found",
        });
      }

      // =====================================================
      // DATE HELPERS
      // =====================================================

      const today =
        new Date();

      const normalizeDate = (
        d
      ) => {
        if (!d) {
          return today
            .toISOString()
            .split("T")[0];
        }

        if (
          typeof d ===
          "string"
        ) {
          return d.includes("T")
            ? d.split("T")[0]
            : d;
        }

        if (
          d instanceof Date
        ) {
          return d
            .toISOString()
            .split("T")[0];
        }

        return today
          .toISOString()
          .split("T")[0];
      };

      const currentDate =
        normalizeDate(
          new Date()
        );

      const pastDate =
        new Date();

      pastDate.setDate(
        today.getDate() - 15
      );

      const defaultStartDate =
        normalizeDate(
          pastDate
        );

      const defaultEndDate =
        currentDate;

      const finalStartDate =
        start_date ||
        defaultStartDate;

      const finalEndDate =
        end_date ||
        defaultEndDate;

      // =====================================================
      // COUNTRY NORMALIZER
      // =====================================================

      const normalizeCountry = (
        c
      ) =>
        (c || "UNKNOWN")
          .toString()
          .trim()
          .toUpperCase();

      // =====================================================
      // DEVICE INFO
      // =====================================================

      const ua =
        req.headers[
        "user-agent"
        ];

      const parser =
        new UAParser(ua);

      const device =
        parser.getDevice();

      const os =
        parser.getOS();

      const browser =
        parser.getBrowser();

      const deviceType =
        device.type ||
        "desktop";

      const osName =
        os.name || "";

      const browserName =
        browser.name || "";

      // =====================================================
      // STORAGE
      // =====================================================

      let totalRevenue = 0;

      const overallOps = [];

      const smartLinkStatsMap =
        new Map();

      // =====================================================
      // LOOP LINKS
      // =====================================================

      for (const link of links) {
        try {
          const placementId =
            String(
              link.placementId
            );

          if (!placementId)
            continue;

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

          // =================================================
          // OVERALL API
          // =================================================

          const overallResponse =
            await axios.get(
              "https://api3.adsterratools.com/publisher/stats.json",
              {
                params: {
                  placement:
                    placementId,

                  start_date:
                    finalStartDate,

                  finish_date:
                    finalEndDate,

                  group_by:
                    "date",
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
            overallResponse.data
              ?.items || [];

          // =================================================
          // FILTER APPROVED DATE
          // =================================================

          overallData =
            overallData.filter(
              (item) => {
                if (
                  !approvedDate
                )
                  return true;

                const itemDate =
                  normalizeDate(
                    item.date
                  );

                return (
                  itemDate >=
                  approvedDate
                );
              }
            );

          // =================================================
          // COUNTRY API
          // =================================================

          const countryResponse =
            await axios.get(
              "https://api3.adsterratools.com/publisher/stats.json",
              {
                params: {
                  placement:
                    placementId,

                  start_date:
                    finalStartDate,

                  finish_date:
                    finalEndDate,

                  group_by:
                    "country",
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
            countryResponse.data
              ?.items || [];

          // =================================================
          // REMOVE EMPTY COUNTRY
          // =================================================

          countryData =
            countryData.filter(
              (item) =>
                item?.country &&
                item.country.trim() !==
                ""
            );

          // =================================================
          // COUNTRY FILTER
          // =================================================

          if (country) {
            const countries =
              country
                .split(",")
                .map((c) =>
                  c
                    .trim()
                    .toUpperCase()
                );

            countryData =
              countryData.filter(
                (item) =>
                  countries.includes(
                    normalizeCountry(
                      item.country
                    )
                  )
              );
          }

          // =================================================
          // OVERALL SAVE OPS
          // =================================================

          for (const item of overallData) {
            const impressions =
              Number(
                item.impression
              ) || 0;

            const clicks =
              Number(
                item.clicks
              ) || 0;

            const revenue =
              Number(
                item.revenue
              ) || 0;

            const ctr =
              impressions > 0
                ? (clicks /
                  impressions) *
                100
                : 0;

            const cpm =
              Number(item.cpm) ||
              0;

            const adsterraDate =
              normalizeDate(
                item.date
              );

            totalRevenue +=
              revenue;

            overallOps.push({
              updateOne: {
                filter: {
                  userId:
                    new mongoose.Types.ObjectId(
                      userId
                    ),

                  placement:
                    placementId,

                  country:
                    "ALL",

                  date:
                    adsterraDate,
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
                      "ALL",

                    date:
                      adsterraDate,

                    device:
                      deviceType,

                    osName,

                    browserName,

                    impressions,

                    clicks,

                    revenue,

                    ctr,

                    cpm,
                  },
                },

                upsert: true,
              },
            });
          }

          // =================================================
          // COUNTRY STATS MAP
          // =================================================

          for (const item of countryData) {
            const statsDate =
              finalEndDate;

            const mapKey = [
              userId,
              deviceType,
              statsDate,
            ].join("|");

            if (
              !smartLinkStatsMap.has(
                mapKey
              )
            ) {
              smartLinkStatsMap.set(
                mapKey,
                {
                  userId:
                    new mongoose.Types.ObjectId(
                      userId
                    ),

                  device:
                    deviceType,

                  osName,

                  browserName,

                  date:
                    statsDate,

                  stats: [],
                }
              );
            }

            const doc =
              smartLinkStatsMap.get(
                mapKey
              );

            const countryName =
              normalizeCountry(
                item.country
              );

            const statItem = {
              placement:
                placementId,

              domain,

              country:
                countryName,

              impressions:
                Number(
                  item.impression
                ) || 0,

              clicks:
                Number(
                  item.clicks
                ) || 0,

              ctr:
                Number(item.ctr) ||
                0,

              cpm:
                Number(item.cpm) ||
                0,

              revenue:
                Number(
                  item.revenue
                ) || 0,
            };

            // =============================================
            // REMOVE DUPLICATE
            // =============================================

            const existingIndex =
              doc.stats.findIndex(
                (s) =>
                  s.placement ===
                  placementId &&
                  s.country ===
                  countryName
              );

            if (
              existingIndex !== -1
            ) {
              doc.stats[
                existingIndex
              ] = statItem;
            } else {
              doc.stats.push(
                statItem
              );
            }
          }
        } catch (err) {
          console.log(
            "LINK ERROR =>",
            link._id,
            err?.response
              ?.data ||
            err.message
          );
        }
      }

      // =====================================================
      // SAVE OVERALL STATS
      // =====================================================

      if (
        overallOps.length
      ) {
        await AdsterraStats.bulkWrite(
          overallOps,
          {
            ordered: false,
          }
        );
      }

      // =====================================================
      // SAVE SMARTLINK STATS
      // =====================================================

      const smartLinkDocs =
        [
          ...smartLinkStatsMap.values(),
        ];

      for (const doc of smartLinkDocs) {
        await SmartLinkStats.findOneAndUpdate(
          {
            userId:
              doc.userId,

            device:
              doc.device,

            date:
              doc.date,
          },

          {
            $set: {
              osName:
                doc.osName,

              browserName:
                doc.browserName,

              stats:
                doc.stats,
            },
          },

          {
            upsert: true,
            new: true,
          }
        );
      }

      // =====================================================
      // UPDATE USER REVENUE
      // =====================================================

      await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            revenue:
              Number(
                totalRevenue.toFixed(
                  6
                )
              ) || 0,
          },
        }
      );

      // =====================================================
      // RESPONSE
      // =====================================================

      return res.status(200).json({
        success: true,

        message:
          "Stats fetched & stored successfully",

        overallSaved:
          overallOps.length,

        countrySaved:
          smartLinkDocs.length,

        totalRevenue:
          Number(
            totalRevenue.toFixed(
              6
            )
          ),

        start_date:
          finalStartDate,

        end_date:
          finalEndDate,
      });
    } catch (error) {
      console.error(
        "ADSTERRA FETCH ERROR =>",
        error?.response
          ?.data ||
        error.message
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to fetch stats",

        error:
          error?.response
            ?.data ||
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
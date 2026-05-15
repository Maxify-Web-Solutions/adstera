const axios = require("axios");
const mongoose = require("mongoose");
const UAParser = require("ua-parser-js");
const SmartLink = require("../models/SmartLink");
const AdsterraStats = require("../models/AdsterraStats");
const SmartLinkStats = require("../models/SmartLinkStats");
const User = require("../models/authmodel");
const Config = require("../models/Config");




exports.fetchAndStoreAdsterraStats = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    // =================================================
    // USERS
    // =================================================

    const users = await User.find({});

    if (!users.length) {
      return res.status(404).json({
        success: false,
        message: "No users found",
      });
    }

    // =================================================
    // CONFIG
    // =================================================

    const config = await Config.findOne();

    if (!config?.adsterraApiKey) {
      return res.status(400).json({
        success: false,
        message: "Adsterra API key not found",
      });
    }

    // =================================================
    // DATE HELPERS
    // =================================================

    const normalizeDate = (d) => {
      const date = d ? new Date(d) : new Date();

      return date.toISOString().split("T")[0];
    };

    const currentDate = normalizeDate(new Date());

    const oldDate = new Date();

    oldDate.setDate(oldDate.getDate() - 15);

    const finalStartDate =
      start_date || normalizeDate(oldDate);

    const finalEndDate =
      end_date || currentDate;

    // =================================================
    // DEVICE INFO
    // =================================================

    const ua =
      req.headers["user-agent"] ||
      "Mozilla/5.0";

    const parser = new UAParser(ua);

    const device = parser.getDevice();

    const os = parser.getOS();

    const browser = parser.getBrowser();

    const deviceType =
      device.type || "desktop";

    const osName = os.name || "";

    const browserName =
      browser.name || "";

    // =================================================
    // TOTALS
    // =================================================

    let totalUsers = 0;

    let totalLinks = 0;

    let totalRevenue = 0;

    // =================================================
    // LOOP USERS
    // =================================================

    for (const user of users) {
      try {
        const userId = user._id;

        // =================================================
        // LINKS
        // =================================================

        const links = await SmartLink.find({
          userId,
        });

        if (!links.length) {
          continue;
        }

        totalUsers += 1;

        totalLinks += links.length;

        const overallOps = [];

        // =================================================
        // LOOP LINKS
        // =================================================

        for (const link of links) {
          try {
            const placementId = String(
              link.placementId || ""
            ).trim();

            if (!placementId) {
              continue;
            }

            const approvedDate = link.approvedAt
              ? normalizeDate(link.approvedAt)
              : null;

            let apiStartDate =
              finalStartDate;

            if (approvedDate) {
              apiStartDate = approvedDate;
            }

            const domain =
              link.domain ||
              link.redirectUrl ||
              link.targetUrl ||
              "unknown";

            // =================================================
            // API CALL
            // =================================================

            const response = await axios.get(
              "https://api3.adsterratools.com/publisher/stats.json",
              {
                params: {
                  placement: placementId,
                  start_date: apiStartDate,
                  finish_date: finalEndDate,
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

            let stats =
              response.data?.items || [];

            // =================================================
            // FILTER APPROVED DATE
            // =================================================

            stats = stats.filter((item) => {
              if (!approvedDate)
                return true;

              const itemDate =
                normalizeDate(item.date);

              return (
                itemDate >= approvedDate
              );
            });

            // =================================================
            // SAVE STATS
            // =================================================

            for (const item of stats) {
              const adsterraDate = String(
                normalizeDate(item.date)
              ).trim();

              const impressions =
                Math.floor(
                  (Number(
                    item.impression
                  ) || 0) * 0.9
                );

              const clicks =
                Number(item.clicks) || 0;

              const revenue = Number(
                (
                  (Number(item.revenue) ||
                    0) * 0.5
                ).toFixed(6)
              );

              const ctr =
                impressions > 0
                  ? Number(
                    (
                      (clicks /
                        impressions) *
                      100
                    ).toFixed(2)
                  )
                  : 0;

              const cpm = Number(
                (
                  (Number(item.cpm) ||
                    0) * 0.5
                ).toFixed(6)
              );

              // =================================================
              // TOTAL REVENUE
              // =================================================

              totalRevenue += revenue;

              // =================================================
              // SAVE STATS
              // =================================================

              overallOps.push({
                updateOne: {
                  filter: {
                    userId:
                      new mongoose.Types.ObjectId(
                        userId
                      ),

                    placement: String(
                      placementId
                    ),

                    country: "ALL",

                    date: adsterraDate,
                  },

                  update: {
                    $set: {
                      userId:
                        new mongoose.Types.ObjectId(
                          userId
                        ),

                      domain,

                      placement: String(
                        placementId
                      ),

                      country: "ALL",

                      date: adsterraDate,

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
          } catch (err) {
            continue;
          }
        }

        // =================================================
        // BULK SAVE
        // =================================================

        if (overallOps.length) {
          await AdsterraStats.bulkWrite(
            overallOps,
            {
              ordered: false,
            }
          );
        }

        // =================================================
        // IMPORTANT
        // USER REVENUE ADD NAHI HOGA
        // =================================================

        // await user.save();

      } catch (err) {
        continue;
      }
    }

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,
      message:
        "All users stats updated successfully",

      totalUsers,

      totalLinks,

      totalRevenue: Number(
        totalRevenue.toFixed(6)
      ),

      start_date: finalStartDate,

      end_date: finalEndDate,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch stats",
      error:
        error?.response?.data ||
        error.message,
    });
  }
};


exports.fetchAndStoreCountryStats =
  async () => {
    try {
      const config =
        await Config.findOne();

      if (
        !config?.adsterraApiKey
      ) {
        return {
          success: false,
          message:
            "Adsterra API Key Missing",
        };
      }

      // TODAY DATE
      const today = new Date()
        .toISOString()
        .split("T")[0];

      // ALL USERS
      const users =
        await User.find(
          {},
          "_id"
        );

      let totalUpdated = 0;

      for (const user of users) {
        // ONLY TODAY DATA
        const stats =
          await AdsterraStats.find(
            {
              userId: user._id,
              date: today,
            },
            {
              placement: 1,
              date: 1,
            }
          );

        if (!stats.length) {
          continue;
        }

        // FIND TODAY DOC
        let existingDoc =
          await SmartLinkStats.findOne(
            {
              userId: user._id,
              device: "desktop",
              date: today,
            }
          );

        // CREATE NEW DOC
        if (!existingDoc) {
          existingDoc =
            new SmartLinkStats({
              userId: user._id,
              device: "desktop",
              osName: "",
              browserName: "",
              date: today,
              stats: [],
            });
        }

        // LOOP PLACEMENTS
        for (const item of stats) {
          try {
            const placementId =
              String(
                item.placement
              );

            // API CALL
            const response =
              await axios.get(
                "https://api3.adsterratools.com/publisher/stats.json",
                {
                  params: {
                    placement:
                      placementId,

                    start_date:
                      today,

                    finish_date:
                      today,

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

            const apiData =
              response?.data
                ?.items || [];

            if (
              !apiData.length
            ) {
              continue;
            }

            // LOOP COUNTRY DATA
            for (const row of apiData) {
              const countryName =
                row.country ||
                "ALL";

              // VALUES
              const impressions =
                Math.floor(
                  Number(
                    row.impression ||
                    0
                  ) * 0.9
                );

              const clicks =
                Number(
                  row.clicks || 0
                );

              const ctr =
                Number(
                  row.ctr || 0
                );

              const cpm =
                Number(
                  (
                    Number(
                      row.cpm ||
                      0
                    ) * 0.5
                  ).toFixed(4)
                );

              const revenue =
                Number(
                  (
                    Number(
                      row.revenue ||
                      0
                    ) * 0.5
                  ).toFixed(4)
                );

              // FIND EXISTING
              const existingIndex =
                existingDoc.stats.findIndex(
                  (s) =>
                    String(
                      s.placement
                    ) ===
                    placementId &&
                    s.country ===
                    countryName &&
                    s.date ===
                    today
                );

              // NEW OBJECT
              const statData =
              {
                placement:
                  placementId,

                domain:
                  row.domain ||
                  "",

                country:
                  countryName,

                // ✅ DATE INSIDE STATS
                date: today,

                impressions,

                clicks,

                ctr,

                cpm,

                revenue,
              };

              // UPDATE
              if (
                existingIndex !==
                -1
              ) {
                existingDoc.stats[
                  existingIndex
                ] = statData;
              }

              // INSERT
              else {
                existingDoc.stats.push(
                  statData
                );
              }

              totalUpdated++;
            }
          } catch (
          apiError
          ) {
            console.log(
              "API ERROR:",
              apiError.message
            );
          }
        }

        // FORCE UPDATE
        existingDoc.markModified(
          "stats"
        );

        // SAVE
        await existingDoc.save();
      }

      return {
        success: true,
        message:
          "Country Stats Saved Successfully",
        totalUpdated,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.message,
      };
    }
  };

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
        country,
      } = req.query;

      // =================================================
      // AUTH
      // =================================================

      if (!userId) {
        return res.status(401).json({
          success: false,
          message:
            "Unauthorized",
        });
      }

      // =================================================
      // DATE HELPER
      // =================================================

      const normalizeDate = (
        d
      ) => {
        if (!d) return null;

        if (
          typeof d ===
          "string"
        ) {
          return d.includes("T")
            ? d.split("T")[0]
            : d;
        }

        return new Date(d)
          .toISOString()
          .split("T")[0];
      };

      // =================================================
      // PAGINATION
      // =================================================

      const currentPage =
        Number(page) || 1;

      const perPage =
        Number(limit) || 20;

      const skip =
        (currentPage - 1) *
        perPage;

      // =================================================
      // OVERALL FILTER
      // =================================================

      const overallFilter = {
        userId:
          new mongoose.Types.ObjectId(
            userId
          ),

        country: "ALL",
      };

      // =================================================
      // DATE FILTER
      // =================================================

      if (
        start_date &&
        end_date
      ) {
        overallFilter.date = {
          $gte:
            normalizeDate(
              start_date
            ),

          $lte:
            normalizeDate(
              end_date
            ),
        };
      }

      // =================================================
      // PLACEMENT FILTER
      // =================================================

      if (placement) {
        overallFilter.placement =
          String(placement);
      }

      // =================================================
      // GET OVERALL DATA
      // =================================================

      const overallStats =
        await AdsterraStats.find(
          overallFilter
        )
          .sort({
            date: -1,
          })
          .skip(skip)
          .limit(perPage)
          .lean();

      // =================================================
      // OVERALL TOTALS
      // =================================================

      const overallTotalsAgg =
        await AdsterraStats.aggregate([
          {
            $match:
              overallFilter,
          },

          {
            $group: {
              _id: null,

              totalImpressions:
              {
                $sum:
                  "$impressions",
              },

              totalClicks: {
                $sum:
                  "$clicks",
              },

              totalRevenue: {
                $sum:
                  "$revenue",
              },
            },
          },
        ]);

      const overallTotals =
        overallTotalsAgg[0] || {
          totalImpressions: 0,
          totalClicks: 0,
          totalRevenue: 0,
        };

      // =================================================
      // OVERALL CTR
      // =================================================

      const overallCtr =
        overallTotals.totalImpressions >
          0
          ? (overallTotals.totalClicks /
            overallTotals.totalImpressions) *
          100
          : 0;

      // =================================================
      // OVERALL CPM
      // =================================================

      const overallCpm =
        overallTotals.totalImpressions >
          0
          ? (overallTotals.totalRevenue /
            overallTotals.totalImpressions) *
          1000
          : 0;

      // =================================================
      // TOTAL RECORDS
      // =================================================

      const totalRecords =
        await AdsterraStats.countDocuments(
          overallFilter
        );

      // =================================================
      // COUNTRY FILTER
      // =================================================

      const countryFilter = {
        userId:
          new mongoose.Types.ObjectId(
            userId
          ),
      };

      // =================================================
      // COUNTRY DATE FILTER
      // =================================================

      if (
        start_date &&
        end_date
      ) {
        countryFilter.date = {
          $gte:
            normalizeDate(
              start_date
            ),

          $lte:
            normalizeDate(
              end_date
            ),
        };
      }

      // =================================================
      // GET COUNTRY DOCS
      // =================================================

      const countryDocs =
        await SmartLinkStats.find(
          countryFilter
        )
          .sort({
            date: -1,
          })
          .lean();

      // =================================================
      // FORMAT COUNTRY DATA
      // =================================================

      let finalCountryData =
        [];

      for (const doc of countryDocs) {

        const stats =
          doc.stats || [];

        for (const item of stats) {

          // =============================================
          // COUNTRY SEARCH
          // =============================================

          if (
            country &&
            String(
              item.country
            ).toUpperCase() !==
            String(
              country
            ).toUpperCase()
          ) {
            continue;
          }

          // =============================================
          // PLACEMENT SEARCH
          // =============================================

          if (
            placement &&
            String(
              item.placement
            ) !==
            String(
              placement
            )
          ) {
            continue;
          }

          finalCountryData.push({
            date:
              doc.date,

            placement:
              item.placement,

            country:
              item.country,

            domain:
              item.domain,

            device:
              doc.device,

            osName:
              doc.osName,

            browserName:
              doc.browserName,

            impressions:
              Number(
                item.impressions ||
                0
              ),

            clicks:
              Number(
                item.clicks ||
                0
              ),

            ctr:
              Number(
                item.ctr || 0
              ),

            cpm:
              Number(
                (
                  item.cpm || 0
                ).toFixed(6)
              ),

            revenue:
              Number(
                (
                  item.revenue ||
                  0
                ).toFixed(6)
              ),
          });
        }
      }

      // =================================================
      // COUNTRY TOTALS
      // =================================================

      let countryTotals = {
        totalImpressions: 0,
        totalClicks: 0,
        totalRevenue: 0,
      };

      for (const item of finalCountryData) {

        countryTotals.totalImpressions +=
          Number(
            item.impressions || 0
          );

        countryTotals.totalClicks +=
          Number(
            item.clicks || 0
          );

        countryTotals.totalRevenue +=
          Number(
            item.revenue || 0
          );
      }

      // =================================================
      // COUNTRY CTR
      // =================================================

      const countryCtr =
        countryTotals.totalImpressions >
          0
          ? (countryTotals.totalClicks /
            countryTotals.totalImpressions) *
          100
          : 0;

      // =================================================
      // COUNTRY CPM
      // =================================================

      const countryCpm =
        countryTotals.totalImpressions >
          0
          ? (countryTotals.totalRevenue /
            countryTotals.totalImpressions) *
          1000
          : 0;

      // =================================================
      // RESPONSE
      // =================================================

      return res.status(200).json({
        success: true,

        filters: {
          placement:
            placement || "ALL",

          country:
            country || "ALL",

          start_date:
            start_date || null,

          end_date:
            end_date || null,
        },

        pagination: {
          page:
            currentPage,

          limit:
            perPage,

          totalPages:
            Math.ceil(
              totalRecords /
              perPage
            ),

          totalRecords,
        },

        overall: {
          totals: {
            totalImpressions:
              Number(
                overallTotals.totalImpressions ||
                0
              ),

            totalClicks:
              Number(
                overallTotals.totalClicks ||
                0
              ),

            totalRevenue:
              Number(
                (
                  overallTotals.totalRevenue ||
                  0
                ).toFixed(6)
              ),

            ctr:
              Number(
                overallCtr.toFixed(
                  2
                )
              ),

            cpm:
              Number(
                overallCpm.toFixed(
                  6
                )
              ),
          },

          data:
            overallStats,
        },

        country: {
          totals: {
            totalImpressions:
              Number(
                countryTotals.totalImpressions ||
                0
              ),

            totalClicks:
              Number(
                countryTotals.totalClicks ||
                0
              ),

            totalRevenue:
              Number(
                (
                  countryTotals.totalRevenue ||
                  0
                ).toFixed(6)
              ),

            ctr:
              Number(
                countryCtr.toFixed(
                  2
                )
              ),

            cpm:
              Number(
                countryCpm.toFixed(
                  6
                )
              ),
          },

          totalRecords:
            finalCountryData.length,

          data:
            finalCountryData,
        },
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

        error:
          error.message,
      });
    }
  };



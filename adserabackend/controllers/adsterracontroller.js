const axios = require("axios");
const mongoose = require("mongoose");
const UAParser = require("ua-parser-js");
const SmartLink = require("../models/SmartLink");
const DemoReport = require("../models/DemoReport");
const AdsterraStats = require("../models/CalculatedAdsterraStats");
const SmartLinkStats = require("../models/CalculatedSmartLinkStats");
const User = require("../models/authmodel");
const Config = require("../models/Config");
const StatsConfig = require("../models/StatsConfig");
const UserStatsSummary = require("../models/UserStatsSummary");
const CalculatedWebsite =
  require("../models/CalculatedWebsite");





exports.fetchAndStoreAdsterraStats = async (req, res) => {
  try {
    // =================================================
    // QUERY
    // =================================================

    const { start_date, end_date } = req.query;

    // =================================================
    // GET ALL USERS
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

    const today = new Date();

    const normalizeDate = (d) => {
      if (!d) {
        return today.toISOString().split("T")[0];
      }

      if (typeof d === "string") {
        return d.includes("T")
          ? d.split("T")[0]
          : d;
      }

      if (d instanceof Date) {
        return d.toISOString().split("T")[0];
      }

      return today.toISOString().split("T")[0];
    };

    // =================================================
    // DEFAULT DATES
    // =================================================

    const currentDate = normalizeDate(
      new Date()
    );

    const oldDate = new Date();

    oldDate.setDate(oldDate.getDate() - 15);

    const defaultStartDate =
      normalizeDate(oldDate);

    const defaultEndDate = currentDate;

    const finalStartDate =
      start_date || defaultStartDate;

    const finalEndDate =
      end_date || defaultEndDate;

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
    // TOTAL STORAGE
    // =================================================

    let totalUsers = 0;

    let totalLinks = 0;

    let totalRevenue = 0;

    // =================================================
    // LOOP ALL USERS
    // =================================================

    for (const user of users) {
      try {
        const userId = user._id;

        console.log(
          "PROCESSING USER =>",
          userId
        );

        // =================================================
        // GET LINKS
        // =================================================

        const links = await SmartLink.find({
          userId,
        });

        if (!links.length) {
          console.log(
            "NO LINKS =>",
            userId
          );

          continue;
        }

        totalUsers += 1;

        totalLinks += links.length;

        // =================================================
        // STORAGE
        // =================================================

        const overallOps = [];

        const revenueTracker = new Set();

        let userNewRevenue = 0;

        // =================================================
        // LOOP LINKS
        // =================================================

        for (const link of links) {
          try {
            const placementId = String(
              link.placementId || ""
            ).trim();

            if (!placementId) continue;

            // =============================================
            // APPROVED DATE
            // =============================================

            const approvedDate =
              link.approvedAt
                ? normalizeDate(
                  link.approvedAt
                )
                : null;

            // =============================================
            // FINAL START DATE
            // =============================================

            let apiStartDate =
              finalStartDate;

            if (approvedDate) {
              apiStartDate =
                approvedDate;
            }

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
                      apiStartDate,
                    finish_date:
                      finalEndDate,
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
              overallResponse.data
                ?.items || [];

            // =============================================
            // FILTER APPROVED DATE
            // =============================================

            overallData =
              overallData.filter(
                (item) => {
                  if (!approvedDate)
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

            // =============================================
            // SAVE OVERALL STATS
            // =============================================

            for (const item of overallData) {
              // ===========================================
              // IMPRESSION -10%
              // ===========================================

              const impressions =
                Math.floor(
                  (Number(
                    item.impression
                  ) || 0) * 0.9
                );

              // ===========================================
              // CLICKS
              // ===========================================

              const clicks =
                Number(item.clicks) ||
                0;

              // ===========================================
              // CPM -60%
              // FINAL CPM = 40%
              // ===========================================

              const cpm = Number(
                (
                  (Number(item.cpm) || 0) -
                  (
                    ((Number(item.cpm) || 0) * 40) / 100
                  )
                ).toFixed(6)
              );
              // ===========================================
              // REVENUE FORMULA
              // (impression / 1000) * cpm
              // ===========================================

              const revenue =
                Number(
                  (
                    (impressions /
                      1000) *
                    cpm
                  ).toFixed(6)
                );

              // ===========================================
              // CTR
              // ===========================================

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

              const adsterraDate =
                String(
                  normalizeDate(
                    item.date
                  )
                ).trim();

              const revenueKey = [
                placementId,
                adsterraDate,
              ].join("|");

              // ===========================================
              // TOTAL REVENUE
              // ===========================================

              if (
                !revenueTracker.has(
                  revenueKey
                )
              ) {
                totalRevenue +=
                  revenue;

                revenueTracker.add(
                  revenueKey
                );
              }

              // ===========================================
              // BULK OPERATION
              // ===========================================

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

                    date: String(
                      adsterraDate
                    ),
                  },

                  update: {
                    $set: {
                      userId:
                        new mongoose.Types.ObjectId(
                          userId
                        ),

                      domain,

                      placement:
                        String(
                          placementId
                        ),

                      country:
                        "ALL",

                      date: String(
                        adsterraDate
                      ),

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
            console.log(
              "LINK ERROR =>",
              link._id,
              err?.response?.data ||
              err.message
            );
          }
        }

        // =================================================
        // SAVE OVERALL STATS
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
        // USER REVENUE UPDATE
        // =================================================

        if (!user.lastRevenueMap) {
          user.lastRevenueMap =
            new Map();
        }

        for (const op of overallOps) {
          const data =
            op.updateOne.update.$set;

          const date = String(
            data.date
          ).trim();

          const placement = String(
            data.placement
          ).trim();

          const revenueKey = `${placement}_${date}`;

          const currentRevenue =
            Number(
              data.revenue || 0
            );

          const oldRevenue =
            Number(
              (
                user.lastRevenueMap.get(
                  revenueKey
                ) || 0
              ).toFixed(6)
            );

          const finalCurrentRevenue =
            Number(
              currentRevenue.toFixed(
                6
              )
            );

          // =============================================
          // SKIP SAME OR LOWER
          // =============================================

          if (
            finalCurrentRevenue <=
            oldRevenue
          ) {
            continue;
          }

          // =============================================
          // ONLY DIFFERENCE
          // =============================================

          const difference =
            Number(
              (
                finalCurrentRevenue -
                oldRevenue
              ).toFixed(6)
            );

          userNewRevenue +=
            difference;

          // =============================================
          // UPDATE MAP
          // =============================================

          user.lastRevenueMap.set(
            revenueKey,
            finalCurrentRevenue
          );
        }

        // =================================================
        // FINAL USER REVENUE
        // =================================================

        if (userNewRevenue > 0) {
          user.revenue = Number(
            (
              Number(
                user.revenue || 0
              ) +
              Number(userNewRevenue)
            ).toFixed(6)
          );
        }

        // =================================================
        // SAVE USER
        // =================================================

        await user.save();

        console.log(
          "USER UPDATED =>",
          userId,
          "NEW REVENUE =>",
          userNewRevenue
        );
      } catch (err) {
        console.log(
          "USER PROCESS ERROR =>",
          user?._id,
          err.message
        );
      }
    }

    // =================================================
    // FINAL RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,

      message:
        "All users stats updated successfully",

      // totalUsers,

      totalLinks,

      totalRevenue: Number(
        totalRevenue.toFixed(6)
      ),

      start_date:
        finalStartDate,

      end_date: finalEndDate,
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

      // GET STATS CONFIG
      const statsConfig =
        await StatsConfig.findOne();

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

              // =================================================
              // ORIGINAL VALUES
              // =================================================

              const originalImpression =
                Number(
                  row.impression || 0
                );

              const originalCpm =
                Number(
                  row.cpm || 0
                );

              // =================================================
              // IMPRESSION %
              // =================================================

              const impressions =
                Math.floor(
                  originalImpression -
                  (
                    (originalImpression *
                      Number(
                        statsConfig?.impressionPercent ||
                        0
                      )) /
                    100
                  )
                );

              // =================================================
              // CPM %
              // =================================================

              const cpm =
                Number(
                  (
                    originalCpm -
                    (
                      (originalCpm *
                        Number(
                          statsConfig?.cpmPercent ||
                          0
                        )) /
                      100
                    )
                  ).toFixed(4)
                );

              // =================================================
              // OTHER VALUES
              // =================================================

              const clicks =
                Number(
                  row.clicks || 0
                );

              const ctr =
                Number(
                  row.ctr || 0
                );

              // =================================================
              // REVENUE
              // FORMULA:
              // (impression / 1000) * cpm
              // =================================================

              const revenue =
                Number(
                  (
                    (impressions /
                      1000) *
                    cpm
                  ).toFixed(6)
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

                // DATE
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
              "API 1 ERROR:",
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

      // =================================================
      // AUTH USER
      // =================================================

      const userId =
        req.user?.id;

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
      const {
        start_date,
        end_date,
        page = 1,
        limit = 40,
        placement,
        country,
      } = req.query;

      // =================================================
      // NO CACHE HEADERS
      // =================================================

      res.set({
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",

        Pragma: "no-cache",

        Expires: "0",

        "Surrogate-Control":
          "no-store",
      });

      // =================================================
      // FIXED 6
      // =================================================

      const fixed6 = (
        value = 0
      ) => {
        return parseFloat(
          Number(value || 0).toFixed(
            6
          )
        );
      };

      // =================================================
      // DATE NORMALIZER
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
        Number(limit) || 40;

      const skip =
        (currentPage - 1) *
        perPage;

      // =================================================
      // FILTER
      // =================================================

      const overallFilter = {
        userId:
          new mongoose.Types.ObjectId(
            userId
          ),
      };

      // =================================================
      // COUNTRY FILTER
      // =================================================

      if (
        country &&
        country !== "ALL"
      ) {
        overallFilter.country =
          country;
      }

      // =================================================
      // DATE FILTER
      // =================================================

      if (
        start_date ||
        end_date
      ) {

        overallFilter.date =
          {};

        if (start_date) {
          overallFilter.date.$gte =
            normalizeDate(
              start_date
            );
        }

        if (end_date) {
          overallFilter.date.$lte =
            normalizeDate(
              end_date
            );
        }
      }

      // =================================================
      // PLACEMENT FILTER
      // =================================================

      if (placement) {
        overallFilter.placement =
          String(placement);
      }

      console.log(
        "OVERALL FILTER =>",
        overallFilter
      );

      // =================================================
      // GET USER DATA
      // =================================================

      const StatsModel = user.isDemo
        ? DemoReport
        : AdsterraStats;

      const overallStatsRaw =
        await StatsModel.find(
          overallFilter
        )
          .sort({
            date: 1,
            updatedAt: 1,
            createdAt: 1,
          })
          .lean()
          .exec();

      console.log(
        "RAW RECORDS =>",
        overallStatsRaw.length
      );

      // =================================================
      // CALCULATED SMARTLINK STATS
      // =================================================

      const calculatedFilter = {
        userId: new mongoose.Types.ObjectId(userId),
      };

      if (start_date || end_date) {
        calculatedFilter.date = {};

        if (start_date) {
          calculatedFilter.date.$gte =
            normalizeDate(start_date);
        }

        if (end_date) {
          calculatedFilter.date.$lte =
            normalizeDate(end_date);
        }
      }

      const calculatedDocs =
        await SmartLinkStats.find(
          calculatedFilter
        )
          .sort({
            date: 1,
          })
          .lean()
          .exec();

      console.log(
        "CALCULATED DOCS =>",
        calculatedDocs.length
      );

      let calculatedStats = [];

      for (const doc of calculatedDocs) {
        for (const stat of doc.stats || []) {
          if (
            placement &&
            placement !== "ALL" &&
            stat.placement !== placement
          ) {
            continue;
          }

          if (
            country &&
            country !== "ALL" &&
            stat.country !== country
          ) {
            continue;
          }

          calculatedStats.push({
            device: doc.device,
            date: doc.date,

            placement:
              stat.placement || "",

            domain:
              stat.domain || "",

            country:
              stat.country || "ALL",

            impressions:
              fixed6(
                stat.impressions
              ),

            clicks:
              fixed6(
                stat.clicks
              ),

            revenue:
              fixed6(
                stat.revenue
              ),

            ctr: fixed6(stat.ctr),

            cpm: fixed6(stat.cpm),

            impressionPercent:
              fixed6(
                stat.impressionPercent
              ),

            cpmPercent:
              fixed6(
                stat.cpmPercent
              ),
          });
        }
      }

      console.log(
        "CALCULATED STATS =>",
        calculatedStats.length
      );


      // =================================================
      // FORMAT DATA
      // =================================================

      const formattedStats =
        overallStatsRaw.map(
          (item) => ({
            ...item,

            impressions:
              fixed6(
                item.impressions
              ),

            clicks:
              fixed6(
                item.clicks
              ),

            revenue:
              fixed6(
                item.revenue
              ),

            ctr:
              fixed6(item.ctr),

            cpm:
              fixed6(item.cpm),
          })
        );


      // =================================================
      // GENERATE DATE RANGE
      // =================================================

      const generateDateRange =
        (
          startDate,
          endDate
        ) => {

          const dates = [];

          const current =
            new Date(startDate);

          const end =
            new Date(endDate);

          while (
            current <= end
          ) {

            dates.push(
              current
                .toISOString()
                .split("T")[0]
            );

            current.setDate(
              current.getDate() +
              1
            );
          }

          return dates;
        };

      // =================================================
      // MERGE SAME DATE DATA
      // =================================================

      let mergedData = [];

      if (
        start_date &&
        end_date
      ) {

        const allDates =
          generateDateRange(
            start_date,
            end_date
          );

        mergedData =
          allDates.map((date) => {

            const sameDateData =
              formattedStats.filter(
                (x) =>
                  String(x.date) ===
                  String(date)
              );

            // =============================================
            // NO DATA
            // =============================================

            if (
              !sameDateData.length
            ) {

              return {
                date,

                impressions: 0,

                clicks: 0,

                revenue: 0,

                ctr: 0,

                cpm: 0,

                country:
                  country ||
                  "ALL",

                placement:
                  placement ||
                  "ALL",
              };
            }

            // =============================================
            // MERGE VALUES
            // =============================================

            let impressions = 0;

            let clicks = 0;

            let revenue = 0;

            // =============================================
            // UNIQUE REVENUE FIX
            // =============================================

            const uniqueRevenueMap =
              new Map();

            for (const item of sameDateData) {

              impressions += Number(
                item.impressions || 0
              );

              clicks += Number(
                item.clicks || 0
              );

              // =========================================
              // UNIQUE KEY
              // =========================================

              const revenueKey = [
                item.userId?.toString() || "",
                item.date || "",
                item.placement || "",
                item.domain || "",
                item.country || "",
              ].join("_");

              // =========================================
              // ADD ONLY ONCE
              // =========================================

              if (
                !uniqueRevenueMap.has(
                  revenueKey
                )
              ) {

                uniqueRevenueMap.set(
                  revenueKey,
                  true
                );

                revenue += Number(
                  item.revenue || 0
                );
              }
            }

            // =============================================
            // RECALCULATE CTR / CPM
            // =============================================

            const ctr =
              impressions > 0
                ? (
                  clicks /
                  impressions
                ) * 100
                : 0;

            const cpm =
              impressions > 0
                ? (
                  revenue /
                  impressions
                ) * 1000
                : 0;

            return {
              date,

              impressions:
                fixed6(
                  impressions
                ),

              clicks:
                fixed6(
                  clicks
                ),

              revenue:
                fixed6(
                  revenue
                ),

              ctr:
                fixed6(ctr),

              cpm:
                fixed6(cpm),

              country:
                country ||
                "ALL",

              placement:
                placement ||
                "ALL",
            };
          });

      } else {

        // =============================================
        // NO DATE FILTER
        // =============================================

        mergedData =
          formattedStats;
      }

      console.log(
        "MERGED DATA =>",
        mergedData.length
      );

      // =================================================
      // PAGINATION
      // =================================================

      const totalRecords =
        mergedData.length;

      const paginatedData =
        mergedData.slice(
          skip,
          skip + perPage
        );

      // =================================================
      // TOTALS
      // =================================================

      let totalImpressions = 0;

      let totalClicks = 0;

      let totalRevenue = 0;

      for (const item of mergedData) {

        totalImpressions += Number(
          item.impressions || 0
        );

        totalClicks += Number(
          item.clicks || 0
        );

        totalRevenue += Number(
          item.revenue || 0
        );
      }

      // =================================================
      // FINAL CTR / CPM
      // =================================================

      const totalCtr =
        totalImpressions > 0
          ? (
            totalClicks /
            totalImpressions
          ) * 100
          : 0;

      const totalCpm =
        totalImpressions > 0
          ? (
            totalRevenue /
            totalImpressions
          ) * 1000
          : 0;

      console.log(
        "FINAL API TOTAL REVENUE =>",
        fixed6(totalRevenue)
      );

      console.log(
        "FINAL API TOTAL IMPRESSIONS =>",
        fixed6(totalImpressions)
      );

      // =================================================
      // RESPONSE
      // =================================================

      return res.status(200).json({
        success: true,
        isDemo: user.isDemo,

        serverTime: new Date(),

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
          page: currentPage,
          limit: perPage,
          totalPages: Math.ceil(
            totalRecords / perPage
          ),
          totalRecords,
        },

        overall: {
          totals: {
            totalImpressions:
              fixed6(
                totalImpressions
              ),

            totalClicks:
              fixed6(
                totalClicks
              ),

            totalRevenue:
              fixed6(
                totalRevenue
              ),

            ctr: fixed6(totalCtr),

            cpm: fixed6(totalCpm),
          },

          data: paginatedData,
        },

        calculatedStats,
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
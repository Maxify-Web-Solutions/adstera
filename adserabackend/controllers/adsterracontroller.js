const axios = require("axios");
const mongoose = require("mongoose");
const UAParser = require("ua-parser-js");
const SmartLink = require("../models/SmartLink");
const AdsterraStats = require("../models/CalculatedAdsterraStats");
const SmartLinkStats = require("../models/SmartLinkStats");
const User = require("../models/authmodel");
const Config = require("../models/Config");
const StatsConfig =require("../models/StatsConfig");
const UserStatsSummary =require("../models/UserStatsSummary");





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

      totalUsers,

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



  
// exports.getAdsterraStatsFromDB =
//   async (req, res) => {
//     try {
//       const userId =
//         req.user?.id;

//       const {
//         start_date,
//         end_date,
//         page = 1,
//         limit = 20,
//         placement,
//         country,
//       } = req.query;

//       // =================================================
//       // AUTH
//       // =================================================

//       if (!userId) {
//         return res.status(401).json({
//           success: false,
//           message:
//             "Unauthorized",
//         });
//       }

//       // =================================================
//       // NO CACHE HEADERS
//       // =================================================

//       res.set({
//         "Cache-Control":
//           "no-store, no-cache, must-revalidate, proxy-revalidate",

//         Pragma: "no-cache",

//         Expires: "0",

//         "Surrogate-Control":
//           "no-store",
//       });
//       // =================================================
//       // FIXED 6 DECIMAL HELPER
//       // =================================================

//       const fixed6 = (value) =>
//         Number(
//           Number(
//             value || 0
//           ).toFixed(6)
//         );

//       // =================================================
//       // DATE HELPER
//       // =================================================

//       const normalizeDate = (
//         d
//       ) => {
//         if (!d) return null;

//         if (
//           typeof d ===
//           "string"
//         ) {
//           return d.includes("T")
//             ? d.split("T")[0]
//             : d;
//         }

//         return new Date(d)
//           .toISOString()
//           .split("T")[0];
//       };

//       // =================================================
//       // PAGINATION
//       // =================================================

//       const currentPage =
//         Number(page) || 1;

//       const perPage =
//         Number(limit) || 20;

//       const skip =
//         (currentPage - 1) *
//         perPage;

//       // =================================================
//       // OVERALL FILTER
//       // =================================================

//       const overallFilter = {
//         userId:
//           new mongoose.Types.ObjectId(
//             userId
//           ),

//         country: "ALL",
//       };

//       // =================================================
//       // DATE FILTER
//       // =================================================

//       if (
//         start_date &&
//         end_date
//       ) {
//         overallFilter.date = {
//           $gte:
//             normalizeDate(
//               start_date
//             ),

//           $lte:
//             normalizeDate(
//               end_date
//             ),
//         };
//       }

//       // =================================================
//       // PLACEMENT FILTER
//       // =================================================

//       if (placement) {
//         overallFilter.placement =
//           String(placement);
//       }

//       // =================================================
//       // GET OVERALL DATA
//       // =================================================

//       const overallStatsRaw =
//         await AdsterraStats.find(
//           overallFilter
//         )
//           .sort({
//             date: -1,
//             updatedAt: -1,
//             createdAt: -1,
//           })
//           .skip(skip)
//           .limit(perPage)
//           .lean()
//           .exec();

//       // =================================================
//       // FORMAT OVERALL DATA
//       // =================================================

//       const overallStats =
//         overallStatsRaw.map(
//           (item) => ({
//             ...item,

//             impressions:
//               fixed6(
//                 item.impressions
//               ),

//             clicks:
//               fixed6(
//                 item.clicks
//               ),

//             revenue:
//               fixed6(
//                 item.revenue
//               ),

//             cpm:
//               fixed6(item.cpm),

//             ctr:
//               fixed6(item.ctr),
//           })
//         );

//       // =================================================
//       // OVERALL TOTALS
//       // =================================================

//       const overallTotalsAgg =
//         await AdsterraStats.aggregate([
//           {
//             $match:
//               overallFilter,
//           },

//           {
//             $group: {
//               _id: null,

//               totalImpressions:
//               {
//                 $sum:
//                   "$impressions",
//               },

//               totalClicks: {
//                 $sum:
//                   "$clicks",
//               },

//               totalRevenue: {
//                 $sum:
//                   "$revenue",
//               },
//             },
//           },
//         ]).exec();

//       const overallTotals =
//         overallTotalsAgg[0] || {
//           totalImpressions: 0,
//           totalClicks: 0,
//           totalRevenue: 0,
//         };

//       // =================================================
//       // OVERALL CTR
//       // =================================================

//       const overallCtr =
//         Number(
//           overallTotals.totalImpressions
//         ) > 0
//           ? (
//             Number(
//               overallTotals.totalClicks
//             ) /
//             Number(
//               overallTotals.totalImpressions
//             )
//           ) * 100
//           : 0;

//       // =================================================
//       // OVERALL CPM
//       // =================================================

//       const overallCpm =
//         Number(
//           overallTotals.totalImpressions
//         ) > 0
//           ? (
//             Number(
//               overallTotals.totalRevenue
//             ) /
//             Number(
//               overallTotals.totalImpressions
//             )
//           ) * 1000
//           : 0;

//       // =================================================
//       // TOTAL RECORDS
//       // =================================================

//       const totalRecords =
//         await AdsterraStats.countDocuments(
//           overallFilter
//         ).exec();

//       // =================================================
//       // COUNTRY FILTER
//       // =================================================

//       const countryFilter = {
//         userId:
//           new mongoose.Types.ObjectId(
//             userId
//           ),
//       };

//       // =================================================
//       // COUNTRY DATE FILTER
//       // =================================================

//       if (
//         start_date &&
//         end_date
//       ) {
//         countryFilter.date = {
//           $gte:
//             normalizeDate(
//               start_date
//             ),

//           $lte:
//             normalizeDate(
//               end_date
//             ),
//         };
//       }

//       // =================================================
//       // GET COUNTRY DOCS
//       // =================================================

//       const countryDocs =
//         await SmartLinkStats.find(
//           countryFilter
//         )
//           .sort({
//             date: -1,
//             updatedAt: -1,
//             createdAt: -1,
//           })
//           .lean()
//           .exec();

//       // =================================================
//       // FORMAT COUNTRY DATA
//       // =================================================

//       let finalCountryData =
//         [];

//       for (const doc of countryDocs) {
//         const stats =
//           Array.isArray(
//             doc.stats
//           )
//             ? doc.stats
//             : [];

//         for (const item of stats) {
//           // =============================================
//           // COUNTRY SEARCH
//           // =============================================

//           if (
//             country &&
//             String(
//               item.country
//             ).toUpperCase() !==
//             String(
//               country
//             ).toUpperCase()
//           ) {
//             continue;
//           }

//           // =============================================
//           // PLACEMENT SEARCH
//           // =============================================

//           if (
//             placement &&
//             String(
//               item.placement
//             ) !==
//             String(
//               placement
//             )
//           ) {
//             continue;
//           }

//           finalCountryData.push({
//             date:
//               doc.date,

//             placement:
//               item.placement,

//             country:
//               item.country,

//             domain:
//               item.domain,

//             device:
//               doc.device,

//             osName:
//               doc.osName,

//             browserName:
//               doc.browserName,

//             impressions:
//               fixed6(
//                 item.impressions
//               ),

//             clicks:
//               fixed6(
//                 item.clicks
//               ),

//             ctr:
//               fixed6(item.ctr),

//             cpm:
//               fixed6(item.cpm),

//             revenue:
//               fixed6(
//                 item.revenue
//               ),
//           });
//         }
//       }

//       // =================================================
//       // SORT COUNTRY DATA LATEST FIRST
//       // =================================================

//       finalCountryData.sort(
//         (a, b) => {
//           return (
//             new Date(
//               b.date
//             ) -
//             new Date(a.date)
//           );
//         }
//       );

//       // =================================================
//       // COUNTRY TOTALS
//       // =================================================

//       let countryTotals = {
//         totalImpressions: 0,
//         totalClicks: 0,
//         totalRevenue: 0,
//       };

//       for (const item of finalCountryData) {
//         countryTotals.totalImpressions =
//           fixed6(
//             Number(
//               countryTotals.totalImpressions
//             ) +
//             Number(
//               item.impressions ||
//               0
//             )
//           );

//         countryTotals.totalClicks =
//           fixed6(
//             Number(
//               countryTotals.totalClicks
//             ) +
//             Number(
//               item.clicks || 0
//             )
//           );

//         countryTotals.totalRevenue =
//           fixed6(
//             Number(
//               countryTotals.totalRevenue
//             ) +
//             Number(
//               item.revenue ||
//               0
//             )
//           );
//       }

//       // =================================================
//       // COUNTRY CTR
//       // =================================================

//       const countryCtr =
//         Number(
//           countryTotals.totalImpressions
//         ) > 0
//           ? (
//             Number(
//               countryTotals.totalClicks
//             ) /
//             Number(
//               countryTotals.totalImpressions
//             )
//           ) * 100
//           : 0;

//       // =================================================
//       // COUNTRY CPM
//       // =================================================

//       const countryCpm =
//         Number(
//           countryTotals.totalImpressions
//         ) > 0
//           ? (
//             Number(
//               countryTotals.totalRevenue
//             ) /
//             Number(
//               countryTotals.totalImpressions
//             )
//           ) * 1000
//           : 0;

//       // =================================================
//       // RESPONSE
//       // =================================================

//       return res.status(200).json({
//         success: true,

//         serverTime:
//           new Date(),

//         filters: {
//           placement:
//             placement || "ALL",

//           country:
//             country || "ALL",

//           start_date:
//             start_date || null,

//           end_date:
//             end_date || null,
//         },

//         pagination: {
//           page:
//             currentPage,

//           limit:
//             perPage,

//           totalPages:
//             Math.ceil(
//               totalRecords /
//               perPage
//             ),

//           totalRecords,
//         },

//         overall: {
//           totals: {
//             totalImpressions:
//               fixed6(
//                 overallTotals.totalImpressions
//               ),

//             totalClicks:
//               fixed6(
//                 overallTotals.totalClicks
//               ),

//             totalRevenue:
//               fixed6(
//                 overallTotals.totalRevenue
//               ),

//             ctr:
//               fixed6(
//                 overallCtr
//               ),

//             cpm:
//               fixed6(
//                 overallCpm
//               ),
//           },

//           data:
//             overallStats,
//         },

//         country: {
//           totals: {
//             totalImpressions:
//               fixed6(
//                 countryTotals.totalImpressions
//               ),

//             totalClicks:
//               fixed6(
//                 countryTotals.totalClicks
//               ),

//             totalRevenue:
//               fixed6(
//                 countryTotals.totalRevenue
//               ),

//             ctr:
//               fixed6(
//                 countryCtr
//               ),

//             cpm:
//               fixed6(
//                 countryCpm
//               ),
//           },

//           totalRecords:
//             finalCountryData.length,

//           data:
//             finalCountryData,
//         },
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

//         error:
//           error.message,
//       });
//     }
//   };


exports.getAdsterraStatsFromDB =
  async (req, res) => {
    try {

      const userId =
        req.user?.id;

      const {
        start_date,
        end_date,
        page = 1,
        limit = 40,
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
      // DATE FILTER FIXED
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

      // =================================================
      // GET OVERALL DATA
      // =================================================

      const overallStatsRaw =
        await AdsterraStats.find(
          overallFilter
        )
          .sort({
            date: -1,
            updatedAt: -1,
            createdAt: -1,
          })
          .skip(skip)
          .limit(perPage)
          .lean()
          .exec();

      // =================================================
      // FORMAT OVERALL DATA
      // =================================================

      const overallStats =
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
      // AGGREGATE TOTALS
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
      // CALCULATED CTR
      // =================================================

      const overallCtr =
        Number(
          overallTotals.totalImpressions
        ) > 0
          ? (
              Number(
                overallTotals.totalClicks
              ) /
              Number(
                overallTotals.totalImpressions
              )
            ) * 100
          : 0;

      // =================================================
      // CALCULATED CPM
      // =================================================

      const overallCpm =
        Number(
          overallTotals.totalImpressions
        ) > 0
          ? (
              Number(
                overallTotals.totalRevenue
              ) /
              Number(
                overallTotals.totalImpressions
              )
            ) * 1000
          : 0;

      // =================================================
      // FINAL SUMMARY DATA
      // =================================================

      const finalSummaryData = {
        totalImpressions:
          fixed6(
            overallTotals.totalImpressions
          ),

        totalClicks:
          fixed6(
            overallTotals.totalClicks
          ),

        totalRevenue:
          fixed6(
            overallTotals.totalRevenue
          ),

        ctr:
          fixed6(overallCtr),

        cpm:
          fixed6(overallCpm),
      };

      // =================================================
      // FIND SUMMARY
      // =================================================

      let savedSummary =
        await UserStatsSummary.findOne(
          {
            userId,
          }
        );

      let dataSource =
        "database";

      // =================================================
      // CREATE SUMMARY
      // =================================================

      if (!savedSummary) {

        dataSource = "created";

        savedSummary =
          await UserStatsSummary.create(
            {
              userId,

              totalImpressions:
                fixed6(
                  finalSummaryData.totalImpressions
                ),

              totalClicks:
                fixed6(
                  finalSummaryData.totalClicks
                ),

              totalRevenue:
                fixed6(
                  finalSummaryData.totalRevenue
                ),

              ctr:
                fixed6(
                  finalSummaryData.ctr
                ),

              cpm:
                fixed6(
                  finalSummaryData.cpm
                ),
            }
          );

      } else {

        const oldRevenue =
          fixed6(
            savedSummary.totalRevenue
          );

        const oldImpressions =
          fixed6(
            savedSummary.totalImpressions
          );

        const oldClicks =
          fixed6(
            savedSummary.totalClicks
          );

        const newRevenue =
          fixed6(
            finalSummaryData.totalRevenue
          );

        const newImpressions =
          fixed6(
            finalSummaryData.totalImpressions
          );

        const newClicks =
          fixed6(
            finalSummaryData.totalClicks
          );

        const finalRevenue =
          fixed6(
            Math.max(
              oldRevenue,
              newRevenue
            )
          );

        const finalImpressions =
          fixed6(
            Math.max(
              oldImpressions,
              newImpressions
            )
          );

        const finalClicks =
          fixed6(
            Math.max(
              oldClicks,
              newClicks
            )
          );

        const finalCtr =
          fixed6(
            finalSummaryData.ctr
          );

        const finalCpm =
          fixed6(
            finalSummaryData.cpm
          );

        const isChanged =
          fixed6(oldRevenue) !==
            fixed6(
              finalRevenue
            ) ||

          fixed6(oldImpressions) !==
            fixed6(
              finalImpressions
            ) ||

          fixed6(oldClicks) !==
            fixed6(
              finalClicks
            );

        if (isChanged) {

          dataSource =
            "updated";

          savedSummary =
            await UserStatsSummary.findOneAndUpdate(
              {
                userId,
              },

              {
                $set: {
                  totalImpressions:
                    fixed6(
                      finalImpressions
                    ),

                  totalClicks:
                    fixed6(
                      finalClicks
                    ),

                  totalRevenue:
                    fixed6(
                      finalRevenue
                    ),

                  ctr:
                    fixed6(
                      finalCtr
                    ),

                  cpm:
                    fixed6(
                      finalCpm
                    ),
                },
              },

              {
                new: true,
              }
            );
        }
      }

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
      // COUNTRY DATE FILTER FIXED
      // =================================================

      if (
        start_date ||
        end_date
      ) {

        countryFilter.date =
          {};

        if (start_date) {

          countryFilter.date.$gte =
            normalizeDate(
              start_date
            );
        }

        if (end_date) {

          countryFilter.date.$lte =
            normalizeDate(
              end_date
            );
        }
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
            updatedAt: -1,
            createdAt: -1,
          })
          .lean();

      // =================================================
      // FORMAT COUNTRY DATA
      // =================================================

      let finalCountryData =
        [];

      for (const doc of countryDocs) {

        const stats =
          Array.isArray(
            doc.stats
          )
            ? doc.stats
            : [];

        for (const item of stats) {

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
          });
        }
      }

      // =================================================
      // SORT COUNTRY DATA
      // =================================================

      finalCountryData.sort(
        (a, b) =>
          new Date(b.date) -
          new Date(a.date)
      );

      // =================================================
      // COUNTRY TOTALS
      // =================================================

      let totalImpressions = 0;
      let totalClicks = 0;
      let totalRevenue = 0;

      for (const item of finalCountryData) {

        totalImpressions +=
          Number(
            item.impressions || 0
          );

        totalClicks +=
          Number(
            item.clicks || 0
          );

        totalRevenue +=
          Number(
            item.revenue || 0
          );
      }

      const countryTotals = {
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
      };

      const countryCtr =
        totalImpressions > 0
          ? (
              totalClicks /
              totalImpressions
            ) * 100
          : 0;

      const countryCpm =
        totalImpressions > 0
          ? (
              totalRevenue /
              totalImpressions
            ) * 1000
          : 0;

      // =================================================
      // RESPONSE
      // =================================================

      return res.status(200).json({
        success: true,

        source:
          dataSource,

        serverTime:
          new Date(),

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
              fixed6(
                savedSummary.totalImpressions
              ),

            totalClicks:
              fixed6(
                savedSummary.totalClicks
              ),

            totalRevenue:
              fixed6(
                savedSummary.totalRevenue
              ),

            ctr:
              fixed6(
                savedSummary.ctr
              ),

            cpm:
              fixed6(
                savedSummary.cpm
              ),
          },

          data:
            overallStats,
        },

        country: {
          totals: {
            totalImpressions:
              fixed6(
                countryTotals.totalImpressions
              ),

            totalClicks:
              fixed6(
                countryTotals.totalClicks
              ),

            totalRevenue:
              fixed6(
                countryTotals.totalRevenue
              ),

            ctr:
              fixed6(
                countryCtr
              ),

            cpm:
              fixed6(
                countryCpm
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
const axios = require("axios");
const mongoose = require("mongoose");
const UAParser = require("ua-parser-js");
const SmartLink = require("../models/SmartLink");
const AdsterraStats = require("../models/AdsterraStats");
const SmartLinkStats = require("../models/SmartLinkStats");
const User = require("../models/authmodel");
const Config = require("../models/Config");

// =====================================================
// FETCH & STORE ADSTERRA STATS
// =====================================================

// exports.fetchAndStoreAdsterraStats =
//   async (req, res) => {
//     try {
//       // =================================================
//       // AUTH
//       // =================================================

//       const userId =
//         req.user?.id;

//       if (!userId) {
//         return res.status(401).json({
//           success: false,
//           message:
//             "Unauthorized",
//         });
//       }

//       // =================================================
//       // QUERY
//       // =================================================

//       const {
//         country,
//         start_date,
//         end_date,
//       } = req.query;

//       // =================================================
//       // GET LINKS
//       // =================================================

//       const links =
//         await SmartLink.find({
//           userId,
//         });

//       if (!links.length) {
//         return res.status(404).json({
//           success: false,
//           message:
//             "No SmartLinks found",
//         });
//       }

//       // =================================================
//       // CONFIG
//       // =================================================

//       const config =
//         await Config.findOne();

//       if (
//         !config?.adsterraApiKey
//       ) {
//         return res.status(400).json({
//           success: false,
//           message:
//             "Adsterra API key not found",
//         });
//       }

//       // =================================================
//       // DATE HELPERS
//       // =================================================

//       const today =
//         new Date();

//       const normalizeDate = (
//         d
//       ) => {
//         if (!d) {
//           return today
//             .toISOString()
//             .split("T")[0];
//         }

//         if (
//           typeof d ===
//           "string"
//         ) {
//           return d.includes("T")
//             ? d.split("T")[0]
//             : d;
//         }

//         if (
//           d instanceof Date
//         ) {
//           return d
//             .toISOString()
//             .split("T")[0];
//         }

//         return today
//           .toISOString()
//           .split("T")[0];
//       };

//       // =================================================
//       // DEFAULT DATES
//       // =================================================

//       const currentDate =
//         normalizeDate(
//           new Date()
//         );

//       const oldDate =
//         new Date();

//       oldDate.setDate(
//         oldDate.getDate() - 15
//       );

//       const defaultStartDate =
//         normalizeDate(
//           oldDate
//         );

//       const defaultEndDate =
//         currentDate;

//       const finalStartDate =
//         start_date ||
//         defaultStartDate;

//       const finalEndDate =
//         end_date ||
//         defaultEndDate;

//       // =================================================
//       // COUNTRY NORMALIZER
//       // =================================================

//       const normalizeCountry = (
//         c
//       ) =>
//         (c || "UNKNOWN")
//           .toString()
//           .trim()
//           .toUpperCase();

//       // =================================================
//       // DEVICE INFO
//       // =================================================

//       const ua =
//         req.headers[
//         "user-agent"
//         ];

//       const parser =
//         new UAParser(ua);

//       const device =
//         parser.getDevice();

//       const os =
//         parser.getOS();

//       const browser =
//         parser.getBrowser();

//       const deviceType =
//         device.type ||
//         "desktop";

//       const osName =
//         os.name || "";

//       const browserName =
//         browser.name || "";

//       // =================================================
//       // STORAGE
//       // =================================================

//       let totalRevenue = 0;

//       const overallOps = [];

//       const smartLinkStatsMap =
//         new Map();

//       const revenueTracker =
//         new Set();

//       // =================================================
//       // LOOP LINKS
//       // =================================================

//       for (const link of links) {
//         try {
//           const placementId =
//             String(
//               link.placementId
//             ).trim();

//           if (!placementId)
//             continue;

//           // =============================================
//           // APPROVED DATE
//           // =============================================

//           const approvedDate =
//             link.approvedAt
//               ? normalizeDate(
//                 link.approvedAt
//               )
//               : null;

//           // =============================================
//           // FINAL START DATE
//           // =============================================

//           let apiStartDate =
//             finalStartDate;

//           if (approvedDate) {
//             apiStartDate =
//               approvedDate;
//           }

//           const domain =
//             link.domain ||
//             link.redirectUrl ||
//             link.targetUrl ||
//             "unknown";

//           // =============================================
//           // OVERALL API
//           // =============================================

//           const overallResponse =
//             await axios.get(
//               "https://api3.adsterratools.com/publisher/stats.json",
//               {
//                 params: {
//                   placement:
//                     placementId,

//                   start_date:
//                     apiStartDate,

//                   finish_date:
//                     finalEndDate,

//                   group_by:
//                     "date",
//                 },

//                 headers: {
//                   Accept:
//                     "application/json",

//                   "X-API-Key":
//                     config.adsterraApiKey,

//                   "User-Agent":
//                     "Mozilla/5.0",
//                 },
//               }
//             );

//           let overallData =
//             overallResponse.data
//               ?.items || [];

//           // =============================================
//           // FILTER APPROVED DATE
//           // =============================================

//           overallData =
//             overallData.filter(
//               (item) => {
//                 if (
//                   !approvedDate
//                 )
//                   return true;

//                 const itemDate =
//                   normalizeDate(
//                     item.date
//                   );

//                 return (
//                   itemDate >=
//                   approvedDate
//                 );
//               }
//             );

//           // =============================================
//           // COUNTRY API
//           // =============================================

//           const countryResponse =
//             await axios.get(
//               "https://api3.adsterratools.com/publisher/stats.json",
//               {
//                 params: {
//                   placement:
//                     placementId,

//                   start_date:
//                     apiStartDate,

//                   finish_date:
//                     finalEndDate,

//                   group_by:
//                     "country",
//                 },

//                 headers: {
//                   Accept:
//                     "application/json",

//                   "X-API-Key":
//                     config.adsterraApiKey,

//                   "User-Agent":
//                     "Mozilla/5.0",
//                 },
//               }
//             );

//           let countryData =
//             countryResponse.data
//               ?.items || [];

//           // =============================================
//           // REMOVE EMPTY COUNTRY
//           // =============================================

//           countryData =
//             countryData.filter(
//               (item) =>
//                 item?.country &&
//                 item.country.trim() !==
//                 ""
//             );

//           // =============================================
//           // COUNTRY FILTER
//           // =============================================

//           if (country) {
//             const countries =
//               country
//                 .split(",")
//                 .map((c) =>
//                   c
//                     .trim()
//                     .toUpperCase()
//                 );

//             countryData =
//               countryData.filter(
//                 (item) =>
//                   countries.includes(
//                     normalizeCountry(
//                       item.country
//                     )
//                   )
//               );
//           }

//           // =============================================
//           // SAVE OVERALL STATS
//           // =============================================

//           // =============================================
//           // SAVE OVERALL STATS
//           // =============================================

//           for (const item of overallData) {
//             const impressions =
//               Number(item.impression) || 0;

//             const clicks =
//               Number(item.clicks) || 0;

//             // 50% REVENUE
//             const revenue =
//               (Number(item.revenue) || 0) * 0.5;

//             const ctr =
//               impressions > 0
//                 ? Number(
//                   (
//                     (clicks / impressions) *
//                     100
//                   ).toFixed(2)
//                 )
//                 : 0;

//             // 50% CPM
//             const cpm =
//               (Number(item.cpm) || 0) * 0.5;

//             const adsterraDate =
//               String(
//                 normalizeDate(item.date)
//               ).trim();

//             const revenueKey =
//               [
//                 placementId,
//                 adsterraDate,
//               ].join("|");

//             if (
//               !revenueTracker.has(
//                 revenueKey
//               )
//             ) {
//               totalRevenue +=
//                 revenue;

//               revenueTracker.add(
//                 revenueKey
//               );
//             }

//             overallOps.push({
//               updateOne: {
//                 filter: {
//                   userId:
//                     new mongoose.Types.ObjectId(
//                       userId
//                     ),

//                   placement:
//                     String(
//                       placementId
//                     ),

//                   country:
//                     "ALL",

//                   date:
//                     String(
//                       adsterraDate
//                     ),
//                 },

//                 update: {
//                   $set: {
//                     userId:
//                       new mongoose.Types.ObjectId(
//                         userId
//                       ),

//                     domain,

//                     placement:
//                       String(
//                         placementId
//                       ),

//                     country:
//                       "ALL",

//                     date:
//                       String(
//                         adsterraDate
//                       ),

//                     device:
//                       deviceType,

//                     osName,

//                     browserName,

//                     impressions,

//                     clicks,

//                     revenue,

//                     ctr,

//                     cpm,
//                   },
//                 },

//                 upsert: true,
//               },
//             });
//           }

//           // =============================================
//           // COUNTRY STATS
//           // =============================================

//           for (const item of countryData) {
//             const statsDate =
//               String(
//                 apiStartDate
//               ).trim();

//             const mapKey = [
//               userId,
//               deviceType,
//               statsDate,
//             ].join("|");

//             if (
//               !smartLinkStatsMap.has(
//                 mapKey
//               )
//             ) {
//               smartLinkStatsMap.set(
//                 mapKey,
//                 {
//                   userId:
//                     new mongoose.Types.ObjectId(
//                       userId
//                     ),

//                   device:
//                     deviceType,

//                   osName,

//                   browserName,

//                   date:
//                     statsDate,

//                   stats: [],
//                 }
//               );
//             }

//             const doc =
//               smartLinkStatsMap.get(
//                 mapKey
//               );

//             const countryName =
//               normalizeCountry(
//                 item.country
//               );

//             const statItem = {
//               placement: String(placementId),

//               domain,

//               country: countryName,

//               impressions:
//                 Number(item.impression) || 0,

//               clicks:
//                 Number(item.clicks) || 0,

//               ctr:
//                 Number(item.ctr) || 0,

//               // 50% CPM
//               cpm:
//                 (Number(item.cpm) || 0) * 0.5,

//               // 50% REVENUE
//               revenue:
//                 (Number(item.revenue) || 0) * 0.5,
//             };

//             // =========================================
//             // REMOVE DUPLICATE
//             // =========================================

//             const existingIndex =
//               doc.stats.findIndex(
//                 (s) =>
//                   String(
//                     s.placement
//                   ) ===
//                   String(
//                     placementId
//                   ) &&
//                   s.country ===
//                   countryName
//               );

//             if (
//               existingIndex !== -1
//             ) {
//               doc.stats[
//                 existingIndex
//               ] = statItem;
//             } else {
//               doc.stats.push(
//                 statItem
//               );
//             }
//           }
//         } catch (err) {
//           console.log(
//             "LINK ERROR =>",
//             link._id,
//             err?.response
//               ?.data ||
//             err.message
//           );
//         }
//       }

//       // =================================================
//       // SAVE OVERALL STATS
//       // =================================================

//       if (
//         overallOps.length
//       ) {
//         await AdsterraStats.bulkWrite(
//           overallOps,
//           {
//             ordered: false,
//           }
//         );
//       }

//       // =================================================
//       // SAVE SMARTLINK STATS
//       // =================================================

//       const smartLinkDocs =
//         [
//           ...smartLinkStatsMap.values(),
//         ];

//       for (const doc of smartLinkDocs) {
//         await SmartLinkStats.findOneAndUpdate(
//           {
//             userId:
//               doc.userId,

//             device:
//               doc.device,

//             date:
//               String(doc.date),
//           },

//           {
//             $set: {
//               osName:
//                 doc.osName,

//               browserName:
//                 doc.browserName,

//               stats:
//                 doc.stats,
//             },
//           },

//           {
//             upsert: true,
//             returnDocument: "after"
//           }
//         );
//       }

//       // =================================================
//       // UPDATE USER REVENUE
//       // PERFECT FIX
//       // =================================================

//       const user = await User.findById(
//         userId
//       );

//       if (!user) {
//         return res.status(404).json({
//           success: false,
//           message: "User not found",
//         });
//       }

//       // =================================================
//       // INIT MAP
//       // =================================================

//       if (!user.lastRevenueMap) {
//         user.lastRevenueMap = new Map();
//       }

//       let newRevenueToAdd = 0;

//       // =================================================
//       // ONLY ADD REAL DIFFERENCE
//       // =================================================

//       for (const op of overallOps) {

//         const data =
//           op.updateOne.update.$set;

//         const date =
//           String(data.date).trim();

//         const placement =
//           String(data.placement).trim();

//         const revenueKey =
//           `${placement}_${date}`;

//         const currentRevenue =
//           Number(data.revenue || 0);

//         const oldRevenue =
//           Number(
//             (
//               user.lastRevenueMap.get(
//                 revenueKey
//               ) || 0
//             ).toFixed(6)
//           );

//         const finalCurrentRevenue =
//           Number(
//             currentRevenue.toFixed(6)
//           );

//         // =============================================
//         // SKIP SAME OR LOWER
//         // =============================================

//         if (
//           finalCurrentRevenue <=
//           oldRevenue
//         ) {
//           continue;
//         }

//         // =============================================
//         // ONLY NEW DIFFERENCE
//         // =============================================

//         const difference =
//           Number(
//             (
//               finalCurrentRevenue -
//               oldRevenue
//             ).toFixed(6)
//           );

//         newRevenueToAdd += difference;

//         // =============================================
//         // UPDATE MAP
//         // =============================================

//         user.lastRevenueMap.set(
//           revenueKey,
//           finalCurrentRevenue
//         );
//       }

//       // =================================================
//       // FINAL USER REVENUE
//       // =================================================

//       if (newRevenueToAdd > 0) {

//         user.revenue = Number(
//           (
//             Number(user.revenue || 0) +
//             Number(newRevenueToAdd)
//           ).toFixed(6)
//         );
//       }

//       // =================================================
//       // SAVE USER
//       // =================================================

//       await user.save();
//       // =================================================
//       // RESPONSE
//       // =================================================

//       return res.status(200).json({
//         success: true,

//         message:
//           "Stats fetched & stored successfully",

//         overallSaved:
//           overallOps.length,

//         countrySaved:
//           smartLinkDocs.length,

//         totalRevenue:
//           Number(
//             totalRevenue.toFixed(
//               6
//             )
//           ),

//         start_date:
//           finalStartDate,

//         end_date:
//           finalEndDate,
//       });
//     } catch (error) {
//       console.error(
//         "ADSTERRA FETCH ERROR =>",
//         error?.response
//           ?.data ||
//         error.message
//       );

//       return res.status(500).json({
//         success: false,

//         message:
//           "Failed to fetch stats",

//         error:
//           error?.response
//             ?.data ||
//           error.message,
//       });
//     }
//   };

exports.fetchAndStoreAdsterraStats = async (req, res) => {
  try {
    // =================================================
    // QUERY
    // =================================================

    const { country, start_date, end_date } = req.query;

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
        return d.includes("T") ? d.split("T")[0] : d;
      }

      if (d instanceof Date) {
        return d.toISOString().split("T")[0];
      }

      return today.toISOString().split("T")[0];
    };

    // =================================================
    // DEFAULT DATES
    // =================================================

    const currentDate = normalizeDate(new Date());

    const oldDate = new Date();

    oldDate.setDate(oldDate.getDate() - 15);

    const defaultStartDate = normalizeDate(oldDate);

    const defaultEndDate = currentDate;

    const finalStartDate = start_date || defaultStartDate;

    const finalEndDate = end_date || defaultEndDate;

    // =================================================
    // COUNTRY NORMALIZER
    // =================================================

    const normalizeCountry = (c) =>
      (c || "UNKNOWN")
        .toString()
        .trim()
        .toUpperCase();

    // =================================================
    // DEVICE INFO
    // =================================================

    const ua = req.headers["user-agent"] || "Mozilla/5.0";

    const parser = new UAParser(ua);

    const device = parser.getDevice();

    const os = parser.getOS();

    const browser = parser.getBrowser();

    const deviceType = device.type || "desktop";

    const osName = os.name || "";

    const browserName = browser.name || "";

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

        console.log("PROCESSING USER =>", userId);

        // =================================================
        // GET LINKS
        // =================================================

        const links = await SmartLink.find({
          userId,
        });

        if (!links.length) {
          console.log("NO LINKS =>", userId);
          continue;
        }

        totalUsers += 1;

        totalLinks += links.length;

        // =================================================
        // STORAGE
        // =================================================

        const overallOps = [];

        const smartLinkStatsMap = new Map();

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

            const approvedDate = link.approvedAt
              ? normalizeDate(link.approvedAt)
              : null;

            // =============================================
            // FINAL START DATE
            // =============================================

            let apiStartDate = finalStartDate;

            if (approvedDate) {
              apiStartDate = approvedDate;
            }

            const domain =
              link.domain ||
              link.redirectUrl ||
              link.targetUrl ||
              "unknown";

            // =============================================
            // OVERALL API
            // =============================================

            const overallResponse = await axios.get(
              "https://api3.adsterratools.com/publisher/stats.json",
              {
                params: {
                  placement: placementId,
                  start_date: apiStartDate,
                  finish_date: finalEndDate,
                  group_by: "date",
                },

                headers: {
                  Accept: "application/json",
                  "X-API-Key": config.adsterraApiKey,
                  "User-Agent": "Mozilla/5.0",
                },
              }
            );

            let overallData =
              overallResponse.data?.items || [];

            // =============================================
            // FILTER APPROVED DATE
            // =============================================

            overallData = overallData.filter((item) => {
              if (!approvedDate) return true;

              const itemDate = normalizeDate(item.date);

              return itemDate >= approvedDate;
            });

            // =============================================
            // COUNTRY API
            // =============================================

            const countryResponse = await axios.get(
              "https://api3.adsterratools.com/publisher/stats.json",
              {
                params: {
                  placement: placementId,
                  start_date: apiStartDate,
                  finish_date: finalEndDate,
                  group_by: "country",
                },

                headers: {
                  Accept: "application/json",
                  "X-API-Key": config.adsterraApiKey,
                  "User-Agent": "Mozilla/5.0",
                },
              }
            );

            let countryData =
              countryResponse.data?.items || [];

            // =============================================
            // REMOVE EMPTY COUNTRY
            // =============================================

            countryData = countryData.filter(
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
                .map((c) => c.trim().toUpperCase());

              countryData = countryData.filter((item) =>
                countries.includes(
                  normalizeCountry(item.country)
                )
              );
            }

            // =============================================
            // SAVE OVERALL STATS
            // =============================================

            for (const item of overallData) {
              const impressions = Math.max(
                (Number(item.impression) || 0) - 5,
                0
              );
              const clicks =
                Number(item.clicks) || 0;

              // 50% REVENUE
              const revenue =
                (Number(item.revenue) || 0) * 0.5;

              const ctr =
                impressions > 0
                  ? Number(
                    (
                      (clicks / impressions) *
                      100
                    ).toFixed(2)
                  )
                  : 0;

              // 50% CPM
              const cpm =
                (Number(item.cpm) || 0) * 0.5;

              const adsterraDate = String(
                normalizeDate(item.date)
              ).trim();

              const revenueKey = [
                placementId,
                adsterraDate,
              ].join("|");

              if (!revenueTracker.has(revenueKey)) {
                totalRevenue += revenue;

                revenueTracker.add(revenueKey);
              }

              overallOps.push({
                updateOne: {
                  filter: {
                    userId:
                      new mongoose.Types.ObjectId(
                        userId
                      ),

                    placement: String(placementId),

                    country: "ALL",

                    date: String(adsterraDate),
                  },

                  update: {
                    $set: {
                      userId:
                        new mongoose.Types.ObjectId(
                          userId
                        ),

                      domain,

                      placement: String(placementId),

                      country: "ALL",

                      date: String(adsterraDate),

                      device: deviceType,

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

            // =============================================
            // COUNTRY STATS
            // =============================================

            for (const item of countryData) {
              const statsDate = String(
                apiStartDate
              ).trim();

              const mapKey = [
                userId,
                deviceType,
                statsDate,
              ].join("|");

              if (!smartLinkStatsMap.has(mapKey)) {
                smartLinkStatsMap.set(mapKey, {
                  userId:
                    new mongoose.Types.ObjectId(
                      userId
                    ),

                  device: deviceType,

                  osName,

                  browserName,

                  date: statsDate,

                  stats: [],
                });
              }

              const doc =
                smartLinkStatsMap.get(mapKey);

              const countryName =
                normalizeCountry(item.country);

              const statItem = {
                placement: String(placementId),

                domain,

                country: countryName,

                impressions: Math.max(
                  (Number(item.impression) || 0) - 5,
                  0
                ),
                clicks:
                  Number(item.clicks) || 0,

                ctr: Number(item.ctr) || 0,

                // 50% CPM
                cpm:
                  (Number(item.cpm) || 0) * 0.5,

                // 50% REVENUE
                revenue:
                  (Number(item.revenue) || 0) * 0.5,
              };

              const existingIndex =
                doc.stats.findIndex(
                  (s) =>
                    String(s.placement) ===
                    String(placementId) &&
                    s.country === countryName
                );

              if (existingIndex !== -1) {
                doc.stats[existingIndex] = statItem;
              } else {
                doc.stats.push(statItem);
              }
            }
          } catch (err) {
            console.log(
              "LINK ERROR =>",
              link._id,
              err?.response?.data || err.message
            );
          }
        }

        // =================================================
        // SAVE OVERALL STATS
        // =================================================

        if (overallOps.length) {
          await AdsterraStats.bulkWrite(overallOps, {
            ordered: false,
          });
        }

        // =================================================
        // SAVE SMARTLINK STATS
        // =================================================

        const smartLinkDocs = [
          ...smartLinkStatsMap.values(),
        ];

        for (const doc of smartLinkDocs) {
          await SmartLinkStats.findOneAndUpdate(
            {
              userId: doc.userId,
              device: doc.device,
              date: String(doc.date),
            },

            {
              $set: {
                osName: doc.osName,
                browserName: doc.browserName,
                stats: doc.stats,
              },
            },

            {
              upsert: true,
              returnDocument: "after",
            }
          );
        }

        // =================================================
        // USER REVENUE UPDATE
        // =================================================

        if (!user.lastRevenueMap) {
          user.lastRevenueMap = new Map();
        }

        for (const op of overallOps) {
          const data = op.updateOne.update.$set;

          const date = String(data.date).trim();

          const placement = String(
            data.placement
          ).trim();

          const revenueKey = `${placement}_${date}`;

          const currentRevenue = Number(
            data.revenue || 0
          );

          const oldRevenue = Number(
            (
              user.lastRevenueMap.get(revenueKey) ||
              0
            ).toFixed(6)
          );

          const finalCurrentRevenue = Number(
            currentRevenue.toFixed(6)
          );

          // =============================================
          // SKIP SAME OR LOWER
          // =============================================

          if (finalCurrentRevenue <= oldRevenue) {
            continue;
          }

          // =============================================
          // ONLY DIFFERENCE
          // =============================================

          const difference = Number(
            (
              finalCurrentRevenue - oldRevenue
            ).toFixed(6)
          );

          userNewRevenue += difference;

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
              Number(user.revenue || 0) +
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
      message: "All users stats updated successfully",
      totalUsers,
      totalLinks,
      totalRevenue: Number(
        totalRevenue.toFixed(6)
      ),
      start_date: finalStartDate,
      end_date: finalEndDate,
    });
  } catch (error) {
    console.error(
      "ADSTERRA FETCH ERROR =>",
      error?.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch stats",
      error:
        error?.response?.data || error.message,
    });
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
        await AdsterraStats.aggregate([
          {
            $match: filter,
          },

          // =====================================
          // REMOVE DUPLICATE
          // same placement + same date
          // =====================================

          {
            $group: {
              _id: {
                placement:
                  "$placement",

                date:
                  "$date",

                country:
                  "$country",
              },

              impressions: {
                $first: {
                  $toDouble:
                    "$impressions",
                },
              },

              clicks: {
                $first: {
                  $toDouble:
                    "$clicks",
                },
              },

              revenue: {
                $first: {
                  $toDouble:
                    "$revenue",
                },
              },
            },
          },

          // =====================================
          // FINAL TOTALS
          // =====================================

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

      // await User.findByIdAndUpdate(
      //   userId,
      //   {
      //     $set: {
      //       revenue:
      //         totals.totalRevenue ||
      //         0,
      //     },
      //   }
      // );

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

          totalClicks:
            Number(
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

        error:
          error.message,
      });
    }
  };
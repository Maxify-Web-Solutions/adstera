const axios = require("axios");
const mongoose = require("mongoose");
const UAParser = require("ua-parser-js");

const User = require("../models/authmodel");
const SmartLink = require("../models/SmartLink");
const Config = require("../models/Config");
const AdsterraStats = require("../models/AdsterraStats");
const SmartLinkStats = require("../models/SmartLinkStats");

// =====================================================
// AUTO FETCH & STORE ADSTERRA STATS FOR ALL USERS
// =====================================================

exports.fetchAndStoreAdsterraStatsForAllUsers =
  async () => {
    try {
      console.log(
        "🚀 AUTO ADSTERRA FETCH START"
      );

      // =================================================
      // CONFIG
      // =================================================

      const config =
        await Config.findOne();

      if (
        !config?.adsterraApiKey
      ) {
        console.log(
          "❌ Adsterra API key not found"
        );

        return;
      }

      // =================================================
      // GET ALL USERS
      // =================================================

      const users =
        await User.find({});

      if (!users.length) {
        console.log("❌ No Users Found");

        return;
      }

      // =================================================
      // DATE HELPERS
      // =================================================

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

      // =================================================
      // DEFAULT DATES
      // =================================================

      const currentDate =
        normalizeDate(
          new Date()
        );

      const oldDate =
        new Date();

      oldDate.setDate(
        oldDate.getDate() - 15
      );

      const defaultStartDate =
        normalizeDate(
          oldDate
        );

      const defaultEndDate =
        currentDate;

      // =================================================
      // LOOP USERS
      // =================================================

      for (const user of users) {
        try {
          console.log(
            `👤 USER => ${user.name}`
          );

          const userId =
            user._id;

          // =================================================
          // GET LINKS
          // =================================================

          const links =
            await SmartLink.find({
              userId,
            });

          if (!links.length) {
            console.log(
              `❌ No SmartLinks For ${user.name}`
            );

            continue;
          }

          // =================================================
          // ENSURE MAP EXISTS
          // =================================================

          if (
            !user.lastRevenueMap
          ) {
            user.lastRevenueMap =
              new Map();
          }

          // =================================================
          // DEVICE INFO
          // =================================================

          const parser =
            new UAParser();

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

          // =================================================
          // STORAGE
          // =================================================

          let updatedRevenue =
            Number(
              user.revenue || 0
            );

          let totalRevenue = 0;

          const overallOps =
            [];

          const smartLinkStatsMap =
            new Map();

          const revenueTracker =
            new Set();

          // =================================================
          // LOOP LINKS
          // =================================================

          for (const link of links) {
            try {
              const placementId =
                String(
                  link.placementId
                ).trim();

              if (!placementId)
                continue;

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
                defaultStartDate;

              if (
                approvedDate
              ) {
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
                      placement:
                        placementId,

                      start_date:
                        apiStartDate,

                      finish_date:
                        defaultEndDate,

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
                overallResponse
                  .data?.items ||
                [];

              // =============================================
              // FILTER APPROVED DATE
              // =============================================

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

              // =============================================
              // COUNTRY API
              // =============================================

              const countryResponse =
                await axios.get(
                  "https://api3.adsterratools.com/publisher/stats.json",
                  {
                    params: {
                      placement:
                        placementId,

                      start_date:
                        apiStartDate,

                      finish_date:
                        defaultEndDate,

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
                countryResponse
                  .data?.items ||
                [];

              // =============================================
              // REMOVE EMPTY COUNTRY
              // =============================================

              countryData =
                countryData.filter(
                  (item) =>
                    item?.country &&
                    item.country.trim() !==
                      ""
                );

              // =============================================
              // SAVE OVERALL STATS
              // =============================================

              for (const item of overallData) {
                const impressions =
                  Number(
                    item.impression
                  ) || 0;

                const clicks =
                  Number(
                    item.clicks
                  ) || 0;

                // =========================================
                // REDUCE CPM & REVENUE 50%
                // =========================================

                const originalRevenue =
                  Number(
                    item.revenue
                  ) || 0;

                const revenue =
                  Number(
                    (
                      originalRevenue *
                      0.5
                    ).toFixed(6)
                  );

                const originalCpm =
                  Number(
                    item.cpm
                  ) || 0;

                const cpm =
                  Number(
                    (
                      originalCpm *
                      0.5
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

                const adsterraDate =
                  String(
                    normalizeDate(
                      item.date
                    )
                  ).trim();

                // =========================================
                // UNIQUE REVENUE KEY
                // =========================================

                const revenueKey =
                  [
                    placementId,
                    adsterraDate,
                  ].join("|");

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

                overallOps.push({
                  updateOne: {
                    filter: {
                      userId:
                        new mongoose.Types.ObjectId(
                          userId
                        ),

                      placement:
                        String(
                          placementId
                        ),

                      country:
                        "ALL",

                      date:
                        String(
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

                        date:
                          String(
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

                // =============================================
                // UPDATE USER REVENUE
                // =============================================

                const mapRevenueKey =
                  `${placementId}_${adsterraDate}`;

                const latestRevenue =
                  Number(
                    revenue
                  ) || 0;

                const oldRevenue =
                  Number(
                    user.lastRevenueMap.get(
                      mapRevenueKey
                    )
                  ) || 0;

                const difference =
                  latestRevenue -
                  oldRevenue;

                // =============================================
                // UPDATE ONLY IF CHANGED
                // =============================================

                if (
                  difference !== 0
                ) {
                  updatedRevenue +=
                    difference;

                  user.lastRevenueMap.set(
                    mapRevenueKey,
                    latestRevenue
                  );

                  console.log(
                    `💰 ${user.name} => +${difference}`
                  );
                }
              }

              // =============================================
              // COUNTRY STATS
              // =============================================

              for (const item of countryData) {
                const statsDate =
                  String(
                    apiStartDate
                  ).trim();

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

                const statItem = {
                  placement:
                    String(
                      placementId
                    ),

                  domain,

                  country:
                    String(
                      item.country
                    ).toUpperCase(),

                  impressions:
                    Number(
                      item.impression
                    ) || 0,

                  clicks:
                    Number(
                      item.clicks
                    ) || 0,

                  ctr:
                    Number(
                      item.ctr
                    ) || 0,

                  cpm:
                    Number(
                      (
                        (
                          Number(
                            item.cpm
                          ) || 0
                        ) * 0.5
                      ).toFixed(6)
                    ),

                  revenue:
                    Number(
                      (
                        (
                          Number(
                            item.revenue
                          ) || 0
                        ) * 0.5
                      ).toFixed(6)
                    ),
                };

                const existingIndex =
                  doc.stats.findIndex(
                    (s) =>
                      String(
                        s.placement
                      ) ===
                        String(
                          placementId
                        ) &&
                      s.country ===
                        String(
                          item.country
                        ).toUpperCase()
                  );

                if (
                  existingIndex !==
                  -1
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
            } catch (linkError) {
              console.log(
                `❌ LINK ERROR (${user.name}) =>`,
                linkError
                  ?.response
                  ?.data ||
                  linkError.message
              );
            }
          }

          // =================================================
          // SAVE OVERALL STATS
          // =================================================

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

          // =================================================
          // SAVE SMARTLINK STATS
          // =================================================

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
                  String(doc.date),
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

          // =================================================
          // FINAL USER REVENUE
          // =================================================

          user.revenue =
            Number(
              updatedRevenue.toFixed(
                6
              )
            );

          await user.save();

          console.log(
            `✅ USER UPDATED => ${user.name} | Revenue: ${user.revenue}`
          );
        } catch (userError) {
          console.log(
            `❌ USER ERROR => ${user.name}`,
            userError.message
          );
        }
      }

      console.log(
        "🎉 ALL USERS UPDATED"
      );
    } catch (error) {
      console.log(
        "❌ MAIN ERROR =>",
        error?.response
          ?.data ||
          error.message
      );
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
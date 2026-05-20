const RawAdsterraStats =
  require("../models/RawAdsterraStats");

const RawsmartLinkStats =
  require("../models/RawSmartLinkStats");

const CalculatedAdsterraStats =
  require(
    "../models/CalculatedAdsterraStats"
  );
const CalculatedSmartLinkStats =
  require(
    "../models/CalculatedSmartLinkStats"
  );
const StatsConfig =
  require("../models/StatsConfig");
const User = require("../models/authmodel");
const mongoose = require("mongoose");






const calculateAndStoreAdsterraStats =
  async (
    req = null,
    res = null
  ) => {
    try {
      // =================================================
      // QUERY
      // =================================================

      const start_date =
        req?.query?.start_date;

      const end_date =
        req?.query?.end_date;

      // =================================================
      // GET ALL USERS
      // =================================================

      const users = await User.find({});

      if (!users.length) {
        if (res) {
          return res.status(404).json({
            success: false,
            message: "No users found",
          });
        }

        console.log(
          "NO USERS FOUND"
        );

        return;
      }

      // =================================================
      // DATE HELPERS
      // =================================================

      const today = new Date();

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

      // =================================================
      // DEFAULT DATES
      // =================================================

      const currentDate =
        normalizeDate(new Date());

      const oldDate = new Date();

      oldDate.setMonth(
        oldDate.getMonth() - 3
      );

      const defaultStartDate =
        normalizeDate(oldDate);

      const defaultEndDate =
        currentDate;

      const finalStartDate =
        start_date ||
        defaultStartDate;

      const finalEndDate =
        end_date ||
        defaultEndDate;

      // =================================================
      // TOTAL STORAGE
      // =================================================

      let totalUsers = 0;

      let totalStats = 0;

      let totalRevenue = 0;

      // =================================================
      // GET STATS CONFIG
      // =================================================

      let statsConfig =
        await StatsConfig.findOne();

      if (!statsConfig) {
        statsConfig =
          await StatsConfig.create({
            impressionPercent: 10,
            cpmPercent: 40,
          });
      }

      // =================================================
      // LOOP USERS
      // =================================================

      for (const user of users) {
        try {
          const userId = user._id;

          console.log(
            "PROCESSING USER =>",
            userId
          );

          // =============================================
          // GET RAW STATS
          // =============================================

          const rawStats =
            await RawAdsterraStats.find({
              userId,

              date: {
                $gte:
                  finalStartDate,

                $lte:
                  finalEndDate,
              },
            });

          // =============================================
          // NO STATS
          // =============================================

          if (!rawStats.length) {
            console.log(
              "NO RAW STATS =>",
              userId
            );

            continue;
          }

          totalUsers += 1;

          totalStats +=
            rawStats.length;

          // =============================================
          // STORAGE
          // =============================================

          const overallOps = [];

          const revenueTracker =
            new Set();

          let userNewRevenue = 0;

          // =============================================
          // LOOP RAW STATS
          // =============================================

          for (const item of rawStats) {
            try {
              // =========================================
              // CHECK OLD CALCULATED RECORD
              // =========================================

              const oldCalculated =
                await CalculatedAdsterraStats.findOne({
                  userId:
                    new mongoose.Types.ObjectId(
                      userId
                    ),

                  placement:
                    String(
                      item.placement
                    ),

                  country:
                    String(
                      item.country ||
                      "ALL"
                    ),

                  date: String(
                    normalizeDate(
                      item.date
                    )
                  ),
                });

              // =========================================
              // USE OLD SAVED %
              // =========================================

              const impressionPercent =
                oldCalculated
                  ?.impressionPercent ??
                item.impressionPercent ??
                statsConfig.impressionPercent ??
                0;

              const cpmPercent =
                oldCalculated
                  ?.cpmPercent ??
                item.cpmPercent ??
                statsConfig.cpmPercent ??
                0;

              // =========================================
              // APPLY CONFIG %
              // =========================================

              const finalImpressions =
                Number(
                  item.impressions || 0
                ) -
                (
                  (Number(
                    item.impressions || 0
                  ) *
                    Number(
                      impressionPercent
                    )) /
                  100
                );

              const finalCpm =
                Number(item.cpm || 0) -
                (
                  (Number(
                    item.cpm || 0
                  ) *
                    Number(
                      cpmPercent
                    )) /
                  100
                );

              // =========================================
              // FINAL REVENUE
              // =========================================

              const finalRevenue =
                (finalImpressions /
                  1000) *
                finalCpm;

              // =========================================
              // CTR
              // =========================================

              const ctr =
                Number(
                  finalImpressions
                ) > 0
                  ? Number(
                    (
                      (Number(
                        item.clicks || 0
                      ) /
                        Number(
                          finalImpressions
                        )) *
                      100
                    ).toFixed(2)
                  )
                  : 0;

              // =========================================
              // DATE
              // =========================================

              const adsterraDate =
                String(
                  normalizeDate(
                    item.date
                  )
                ).trim();

              // =========================================
              // REVENUE KEY
              // =========================================

              const revenueKey = [
                item.placement,
                adsterraDate,
              ].join("|");

              // =========================================
              // TOTAL REVENUE
              // =========================================

              if (
                !revenueTracker.has(
                  revenueKey
                )
              ) {
                totalRevenue +=
                  Number(
                    finalRevenue.toFixed(
                      6
                    )
                  );

                revenueTracker.add(
                  revenueKey
                );
              }

              // =========================================
              // BULK UPDATE
              // =========================================

              overallOps.push({
                updateOne: {
                  filter: {
                    userId:
                      new mongoose.Types.ObjectId(
                        userId
                      ),

                    placement:
                      String(
                        item.placement
                      ),

                    country:
                      String(
                        item.country ||
                        "ALL"
                      ),

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

                      domain:
                        item.domain ||
                        "unknown",

                      placement:
                        String(
                          item.placement
                        ),

                      country:
                        String(
                          item.country ||
                          "ALL"
                        ),

                      date: String(
                        adsterraDate
                      ),

                      device:
                        item.device ||
                        "desktop",

                      deviceModel:
                        item.deviceModel ||
                        "",

                      deviceVendor:
                        item.deviceVendor ||
                        "",

                      osName:
                        item.osName ||
                        "",

                      osVersion:
                        item.osVersion ||
                        "",

                      browserName:
                        item.browserName ||
                        "",

                      browserVersion:
                        item.browserVersion ||
                        "",

                      impressions:
                        Math.floor(
                          finalImpressions
                        ),

                      clicks:
                        Number(
                          item.clicks || 0
                        ),

                      ctr,

                      cpm: Number(
                        finalCpm.toFixed(
                          6
                        )
                      ),

                      revenue:
                        Number(
                          finalRevenue.toFixed(
                            6
                          )
                        ),

                      // =================================
                      // SAVE FIXED %
                      // =================================

                      impressionPercent:
                        Number(
                          impressionPercent
                        ),

                      cpmPercent:
                        Number(
                          cpmPercent
                        ),
                    },
                  },

                  upsert: true,
                },
              });
            } catch (err) {
              console.log(
                "RAW STATS ERROR =>",
                err.message
              );
            }
          }

          // =============================================
          // SAVE STATS
          // =============================================

          if (overallOps.length) {
            await CalculatedAdsterraStats.bulkWrite(
              overallOps,
              {
                ordered: false,
              }
            );
          }

          // =============================================
          // USER REVENUE MAP
          // =============================================

          if (!user.lastRevenueMap) {
            user.lastRevenueMap =
              new Map();
          }

          // =============================================
          // UPDATE USER REVENUE
          // =============================================

          for (const op of overallOps) {
            const data =
              op.updateOne.update.$set;

            const date = String(
              data.date
            ).trim();

            const placement =
              String(
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

            // =========================================
            // SKIP SAME OR LOWER
            // =========================================

            if (
              finalCurrentRevenue <=
              oldRevenue
            ) {
              continue;
            }

            // =========================================
            // ONLY DIFFERENCE
            // =========================================

            const difference =
              Number(
                (
                  finalCurrentRevenue -
                  oldRevenue
                ).toFixed(6)
              );

            userNewRevenue +=
              difference;

            // =========================================
            // UPDATE MAP
            // =========================================

            user.lastRevenueMap.set(
              revenueKey,
              finalCurrentRevenue
            );
          }

          // =============================================
          // FINAL USER REVENUE
          // =============================================

          // =============================================
          // FINAL USER REVENUE
          // =============================================

          if (userNewRevenue > 0) {

            // ===========================================
            // UPDATE USER REVENUE
            // ===========================================

            user.revenue = Number(
              (
                Number(
                  user.revenue || 0
                ) +
                Number(
                  userNewRevenue
                )
              ).toFixed(6)
            );

            // SAVE USER
            await user.save();

            // ===========================================
            // REFERRAL COMMISSION SYSTEM
            // ===========================================

            if (
              user.referredBy &&
              user.referredBy !== null &&
              user.referredBy !== ""
            ) {

              // FIND REFERRAL USER
              const referralUser =
                await User.findOne({
                  referralCode:
                    String(
                      user.referredBy
                    ).trim(),
                });

              // =========================================
              // REFERRAL USER FOUND
              // =========================================

              if (referralUser) {

                // INIT MAP
                if (!referralUser.lastReferralMap) {
                  referralUser.lastReferralMap =
                    new Map();
                }

                // =======================================
                // TOTAL REFERRAL EARNING
                // =======================================

                const totalReferralAmount =
                  Number(
                    referralUser.referralAmount || 0
                  );

                // =======================================
                // DYNAMIC COMMISSION %
                // =======================================

                let commissionPercent = 10;

                if (totalReferralAmount >= 100) {
                  commissionPercent = 10;
                }

                if (totalReferralAmount >= 200) {
                  commissionPercent = 12;
                }

                if (totalReferralAmount >= 350) {
                  commissionPercent = 15;
                }

                // =======================================
                // COMMISSION AMOUNT
                // =======================================

                const commissionAmount =
                  Number(
                    (
                      (Number(
                        userNewRevenue
                      ) *
                        Number(
                          commissionPercent
                        )) /
                      100
                    ).toFixed(6)
                  );

                // =======================================
                // UPDATE TOTAL REFERRAL
                // =======================================

                referralUser.referralAmount =
                  Number(
                    (
                      Number(
                        referralUser.referralAmount || 0
                      ) +
                      Number(
                        commissionAmount
                      )
                    ).toFixed(6)
                  );

                // =======================================
                // TODAY DATE
                // =======================================

                const today =
                  new Date()
                    .toISOString()
                    .split("T")[0];

                // =======================================
                // OLD DAILY REFERRAL
                // =======================================

                const oldDailyReferral =
                  Number(
                    referralUser.lastReferralMap.get(
                      today
                    ) || 0
                  );

                // =======================================
                // UPDATE DAILY REFERRAL
                // =======================================

                referralUser.lastReferralMap.set(
                  today,
                  Number(
                    (
                      oldDailyReferral +
                      commissionAmount
                    ).toFixed(6)
                  )
                );

                // SAVE REFERRAL USER
                await referralUser.save();

                console.log(
                  "REFERRAL COMMISSION ADDED =>",
                  referralUser.name,
                  commissionAmount
                );
              }
            }

            console.log(
              "USER UPDATED =>",
              userId,
              "NEW REVENUE =>",
              userNewRevenue
            );
          }
          // =============================================
          // SAVE USER
          // =============================================

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

      const finalResponse = {
        success: true,

        message:
          "All users stats updated successfully",

        totalUsers,

        totalStats,

        totalRevenue: Number(
          totalRevenue.toFixed(6)
        ),

        start_date:
          finalStartDate,

        end_date: finalEndDate,
      };

      console.log(finalResponse);

      if (res) {
        return res.status(200).json(
          finalResponse
        );
      }

      return finalResponse;
    } catch (error) {
      console.error(
        "ADSTERRA FETCH ERROR =>",
        error.message
      );

      if (res) {
        return res.status(500).json({
          success: false,

          message:
            "Failed to process stats",

          error: error.message,
        });
      }

      return {
        success: false,
        error: error.message,
      };
    }
  };


const calculateAndStoreSmartLinkStats =
  async () => {
    try {
      // ============================================
      // GET CONFIG
      // ============================================

      let config =
        await StatsConfig.findOne();

      if (!config) {
        config =
          await StatsConfig.create({
            impressionPercent: 10,

            cpmPercent: 40,
          });
      }

      // ============================================
      // GET RAW DATA
      // ============================================

      const rawStats =
        await RawsmartLinkStats.find();

      // ============================================
      // LOOP DOCS
      // ============================================

      for (const rawDoc of rawStats) {
        const calculatedStats = [];

        // ============================================
        // LOOP STATS ARRAY
        // ============================================

        for (const item of rawDoc.stats) {
          // ============================================
          // APPLY %
          // ============================================

          const finalImpressions =
            item.impressions -
            (item.impressions *
              config.impressionPercent) /
            100;

          const finalCpm =
            item.cpm -
            (item.cpm *
              config.cpmPercent) /
            100;

          // ============================================
          // REVENUE
          // ============================================

          const finalRevenue =
            (finalImpressions / 1000) *
            finalCpm;

          // ============================================
          // PUSH FINAL DATA
          // ============================================

          calculatedStats.push({
            placement:
              item.placement,

            domain: item.domain,

            country:
              item.country,

            date: item.date,

            clicks: item.clicks,

            ctr: item.ctr,

            impressions:
              Math.floor(
                finalImpressions
              ),

            cpm: Number(
              finalCpm.toFixed(3)
            ),

            revenue: Number(
              finalRevenue.toFixed(2)
            ),

            impressionPercent:
              config.impressionPercent,

            cpmPercent:
              config.cpmPercent,
          });
        }

        // ============================================
        // CHECK EXISTING
        // ============================================

        const existing =
          await CalculatedSmartLinkStats.findOne(
            {
              userId:
                rawDoc.userId,

              device:
                rawDoc.device,

              date: rawDoc.date,
            }
          );

        // ============================================
        // FINAL DOC
        // ============================================

        const finalDoc = {
          userId: rawDoc.userId,

          device: rawDoc.device,

          osName: rawDoc.osName,

          browserName:
            rawDoc.browserName,

          date: rawDoc.date,

          stats: calculatedStats,
        };

        // ============================================
        // UPDATE / CREATE
        // ============================================

        if (existing) {
          await CalculatedSmartLinkStats.findByIdAndUpdate(
            existing._id,
            finalDoc,
            {
              new: true,
            }
          );
        } else {
          await CalculatedSmartLinkStats.create(
            finalDoc
          );
        }
      }

      console.log(
        "Calculated SmartLink stats stored successfully"
      );
    } catch (error) {
      console.log(error);
    }
  };


module.exports = {
  calculateAndStoreAdsterraStats,
  calculateAndStoreSmartLinkStats,
};
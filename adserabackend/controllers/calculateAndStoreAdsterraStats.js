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
const RawWebsite = require("../models/RawWebsitemodel");

const CalculatedWebsite = require("../models/CalculatedWebsite");




const calculateAndStoreWebsiteStats = async (req = null, res = null) => {
  try {
    // =========================================
    // QUERY
    // =========================================
    const start_date = req?.query?.start_date;
    const end_date = req?.query?.end_date;

    // =========================================
    // GET USERS
    // =========================================
    const users = await User.find({
      $or: [
        { isDemo: { $exists: false } },
        { isDemo: false }
      ]
    });

    if (!users.length) {
      if (res) {
        return res.status(404).json({
          success: false,
          message: "No users found",
        });
      }
      return;
    }

    // =========================================
    // DATE HELPERS
    // =========================================
    const today = new Date();
    const normalizeDate = (d) => {
      if (!d) return today.toISOString().split("T")[0];
      if (typeof d === "string") return d.includes("T") ? d.split("T")[0] : d;
      if (d instanceof Date) return d.toISOString().split("T")[0];
      return today.toISOString().split("T")[0];
    };

    const currentDate = normalizeDate(new Date());
    const oldDate = new Date();
    oldDate.setMonth(oldDate.getMonth() - 3);
    const finalStartDate = start_date || normalizeDate(oldDate);
    const finalEndDate = end_date || currentDate;

    // =========================================
    // TOTALS
    // =========================================
    let totalUsers = 0;
    let totalStats = 0;
    let totalRevenue = 0;

    // =========================================
    // LOOP USERS
    // =========================================
    for (const user of users) {
      try {
        const userId = user._id;
        console.log("PROCESSING USER FOR WEBSITE STATS =>", userId);

        // =============================================
        // INIT MAPS
        // =============================================
        if (!user.lastRevenueMap) {
          user.lastRevenueMap = new Map();
        }
        if (!user.lastReferralMap) {
          user.lastReferralMap = new Map();
        }

        // =============================================
        // USER-SPECIFIC REVENUE TRACKING
        // =============================================
        let userNewRevenue = 0;
        let userTotalCalculatedRevenue = 0;
        const revenueKeyTracker = new Set();
        const userStateRevenue = new Map();

        // =========================================
        // GET RAW WEBSITES FOR THIS USER
        // =========================================
        const rawWebsites = await RawWebsite.find({
          userId,
          date: {
            $gte: finalStartDate,
            $lte: finalEndDate,
          },
        });

        if (!rawWebsites.length) {
          console.log("NO RAW WEBSITES STATS =>", userId);
          continue;
        }

        totalUsers += 1;
        totalStats += rawWebsites.length;

        // =========================================
        // PROCESS RAW WEBSITES
        // =========================================
        for (const item of rawWebsites) {
          try {
            const websiteDate = String(normalizeDate(item?.date)).trim();
            if (!websiteDate) continue;

            const calculatedPlacements = [];

            // =====================================
            // LOOP PLACEMENTS
            // =====================================
            for (const p of item.placements) {
              try {
                // =================================
                // RAW VALUES & PERCENTAGES
                // =================================
                const rawImpressions = Number(p?.impressions || 0);
                const rawClicks = Number(p?.clicks || 0);
                const rawCpm = Number(p?.cpm || 0);
                const impressionPercent = Number(p?.impressionPercent || 0);
                const cpmPercent = Number(p?.cpmPercent || 0);

                // =================================
                // FINAL CALCULATIONS
                // =================================
                const finalImpressions = rawImpressions * (1 - (impressionPercent / 100));
                const finalCpm = rawCpm * (1 - (cpmPercent / 100));
                const finalRevenue = (finalImpressions / 1000) * finalCpm;
                const roundedRevenue = Number(finalRevenue.toFixed(6));
                const finalCtr = finalImpressions > 0
                  ? Number(((rawClicks / finalImpressions) * 100).toFixed(2))
                  : 0;

                // =================================
                // CREATE UNIQUE KEY FOR REVENUE
                // =================================
                const cleanDomain = String(item.website || "unknown").trim().toLowerCase();
                const cleanPlacement = String(p?.placementId || "").trim();
                const cleanCountry = "ALL"; // Website stats don't have country, using ALL
                const cleanDate = websiteDate;
                
                const rawRevenueKey = `${cleanDomain}_${cleanPlacement}_${cleanCountry}_${cleanDate}`;
                const revenueKey = Buffer.from(rawRevenueKey).toString("base64");

                // =================================
                // TRACK REVENUE FOR THIS USER
                // =================================
                if (!revenueKeyTracker.has(revenueKey)) {
                  userTotalCalculatedRevenue += roundedRevenue;
                  totalRevenue += roundedRevenue;
                  revenueKeyTracker.add(revenueKey);

                  // State-wise revenue tracking (using country as "ALL" for website)
                  const currentStateRevenue = userStateRevenue.get(cleanCountry) || 0;
                  userStateRevenue.set(cleanCountry, currentStateRevenue + roundedRevenue);
                }

                // =================================
                // CHECK FOR NEW REVENUE (INCREMENTAL)
                // =================================
                const currentRevenue = roundedRevenue;
                const oldRevenue = Number(user.lastRevenueMap.get(revenueKey) || 0);

                if (currentRevenue > oldRevenue) {
                  const difference = Number((currentRevenue - oldRevenue).toFixed(6));
                  userNewRevenue += difference;
                  user.lastRevenueMap.set(revenueKey, currentRevenue);
                }

                // =================================
                // PUSH CALCULATED PLACEMENT
                // =================================
                calculatedPlacements.push({
                  type: p?.type || "",
                  placementId: String(p?.placementId || "").trim(),
                  adName: p?.adName || "",
                  adUrl: p?.adUrl || "",
                  isActive: p?.isActive || false,
                  impressions: Math.floor(finalImpressions),
                  clicks: rawClicks,
                  ctr: finalCtr,
                  cpm: Number(finalCpm.toFixed(6)),
                  revenue: roundedRevenue,
                  impressionPercent,
                  cpmPercent,
                });

              } catch (placementError) {
                console.log("PLACEMENT CALC ERROR =>", placementError.message);
              }
            }

            // =====================================
            // FIND OR CREATE CALCULATED DOC
            // =====================================
            let existingDoc = await CalculatedWebsite.findOne({
              userId: item.userId,
              website: item.website,
              date: { $eq: websiteDate },
            });

            if (!existingDoc) {
              existingDoc = await CalculatedWebsite.create({
                userId: item.userId,
                website: item.website,
                status: item.status,
                smartCode: item.smartCode,
                websiteCategory: item.websiteCategory,
                showAdultAds: item.showAdultAds,
                adFormat: item.adFormat,
                date: websiteDate,
                placements: calculatedPlacements,
              });
              console.log("NEW CALCULATED DATE CREATED =>", websiteDate);
            } else {
              existingDoc.status = item.status;
              existingDoc.smartCode = item.smartCode;
              existingDoc.websiteCategory = item.websiteCategory;
              existingDoc.showAdultAds = item.showAdultAds;
              existingDoc.adFormat = item.adFormat;
              existingDoc.placements = calculatedPlacements;
              await existingDoc.save();
              console.log("UPDATED EXISTING DATE =>", websiteDate);
            }

          } catch (itemError) {
            console.log("WEBSITE CALC ERROR =>", itemError.message);
          }
        }

        // =============================================
        // STORE STATE REVENUE IN lastRevenueMap
        // =============================================
        for (const [state, revenue] of userStateRevenue.entries()) {
          const stateKey = `__STATE_${state}__`;
          const existingStateRevenue = user.lastRevenueMap.get(stateKey) || 0;
          user.lastRevenueMap.set(stateKey, existingStateRevenue + revenue);
        }

        // Store total revenue for this period
        const periodKey = `__PERIOD_${finalStartDate}_TO_${finalEndDate}__`;
        const existingPeriodRevenue = user.lastRevenueMap.get(periodKey) || 0;
        user.lastRevenueMap.set(periodKey, existingPeriodRevenue + userTotalCalculatedRevenue);

        // =============================================
        // UPDATE USER WITH EXACT REVENUE
        // =============================================
        if (userNewRevenue > 0) {
          user.revenue = Number((Number(user.revenue || 0) + userNewRevenue).toFixed(6));

          console.log(`✅ USER ${userId} UPDATED (WEBSITE STATS):`);
          console.log(`   - Total Calculated Revenue (This Period): ₹${userTotalCalculatedRevenue.toFixed(6)}`);
          console.log(`   - New Revenue (Incremental): ₹${userNewRevenue.toFixed(6)}`);
          console.log(`   - Total Revenue (All Time): ₹${user.revenue.toFixed(6)}`);
          console.log(`   - State Breakdown:`, Object.fromEntries(userStateRevenue));
        }

        // Save user with all maps
        user.markModified("lastRevenueMap");
        user.markModified("lastReferralMap");
        await user.save();

        // =============================================
        // REFERRAL COMMISSION
        // =============================================
        if (!user.isDemo && user.referredBy && userNewRevenue > 0) {
          const referredByCode = String(user.referredBy).trim().toUpperCase();
          const refUser = await User.findOne({ referralCode: referredByCode });

          if (!refUser) {
            console.log("❌ REF USER NOT FOUND =>", referredByCode);
            continue;
          }

          if (!refUser.lastReferralMap) {
            refUser.lastReferralMap = new Map();
          }

          const referralKey = Buffer.from(`${user._id}_${finalStartDate}_${finalEndDate}`).toString("base64");
          const oldReferralData = refUser.lastReferralMap.get(referralKey) || { amount: 0 };
          const oldReferral = Number(oldReferralData.amount || 0);

          let referralPercent = 0;
          if (userNewRevenue <= 199) referralPercent = 10;
          else if (userNewRevenue <= 299) referralPercent = 12;
          else if (userNewRevenue <= 999) referralPercent = 15;
          else referralPercent = 10;

          const newReferralAmount = (userNewRevenue * referralPercent) / 100;
          const finalReferral = Number((newReferralAmount - oldReferral).toFixed(6));

          if (finalReferral > 0) {
            refUser.referralAmount = Number(refUser.referralAmount || 0) + finalReferral;

            refUser.lastReferralMap.set(referralKey, {
              name: user.name,
              amount: newReferralAmount,
              revenue: userNewRevenue,
              percent: referralPercent,
              date: new Date().toISOString().split("T")[0],
            });

            refUser.markModified("lastReferralMap");
            refUser.markModified("referralAmount");
            await refUser.save();

            console.log("✅ REFERRAL ADDED (WEBSITE STATS) =>", {
              refUser: refUser._id,
              added: finalReferral,
              total: refUser.referralAmount
            });
          }
        }

      } catch (err) {
        console.log("USER PROCESS ERROR =>", user?._id, err.message);
      }
    }

    // =========================================
    // VERIFICATION
    // =========================================
    console.log("=========================================");
    console.log(`✅ TOTAL USERS: ${totalUsers}`);
    console.log(`✅ TOTAL STATS: ${totalStats}`);
    console.log(`✅ TOTAL REVENUE: ₹${totalRevenue.toFixed(6)}`);
    console.log(`✅ PERIOD: ${finalStartDate} to ${finalEndDate}`);
    console.log("=========================================");

    // =========================================
    // FINAL RESPONSE
    // =========================================
    const responseData = {
      success: true,
      message: "Calculated website stats stored successfully with revenue tracking",
      totalUsers,
      totalStats,
      totalRevenue: Number(totalRevenue.toFixed(6)),
      start_date: finalStartDate,
      end_date: finalEndDate,
    };

    if (res) {
      return res.status(200).json(responseData);
    }

    console.log("CALCULATED WEBSITE SUCCESS");
    return responseData;

  } catch (error) {
    console.log("CALCULATED WEBSITE ERROR =>", error.message);
    if (res) {
      return res.status(500).json({
        success: false,
        message: "Failed to calculate website stats",
        error: error.message,
      });
    }
    return {
      success: false,
      error: error.message,
    };
  }
};


const calculateAndStoreAdsterraStats = async (req = null, res = null) => {
  try {
    // =================================================
    // QUERY
    // =================================================
    const start_date = req?.query?.start_date;
    const end_date = req?.query?.end_date;

    // =================================================
    // GET USERS
    // =================================================
    const users = await User.find({
      $or: [
        { isDemo: { $exists: false } },
        { isDemo: false }
      ]
    });

    if (!users.length) {
      if (res) {
        return res.status(404).json({
          success: false,
          message: "No users found",
        });
      }
      return;
    }

    // =================================================
    // DATE HELPERS
    // =================================================
    const today = new Date();
    const normalizeDate = (d) => {
      if (!d) return today.toISOString().split("T")[0];
      if (typeof d === "string") return d.includes("T") ? d.split("T")[0] : d;
      if (d instanceof Date) return d.toISOString().split("T")[0];
      return today.toISOString().split("T")[0];
    };

    // =================================================
    // DEFAULT DATES
    // =================================================
    const currentDate = normalizeDate(new Date());
    const oldDate = new Date();
    oldDate.setMonth(oldDate.getMonth() - 3);
    const finalStartDate = start_date || normalizeDate(oldDate);
    const finalEndDate = end_date || currentDate;

    // =================================================
    // TOTALS
    // =================================================
    let totalUsers = 0;
    let totalStats = 0;
    let totalRevenue = 0;

    // =================================================
    // LOOP USERS
    // =================================================
    for (const user of users) {
      try {
        const userId = user._id;
        console.log("PROCESSING USER =>", userId);

        // =============================================
        // INIT MAPS (Using existing schema fields)
        // =============================================
        if (!user.lastRevenueMap) {
          user.lastRevenueMap = new Map();
        }
        if (!user.lastReferralMap) {
          user.lastReferralMap = new Map();
        }

        // =============================================
        // USER-SPECIFIC REVENUE TRACKING
        // =============================================
        let userNewRevenue = 0;
        let userTotalCalculatedRevenue = 0;
        const revenueKeyTracker = new Set();

        // State revenue tracking (temporary, will be stored in lastRevenueMap)
        const userStateRevenue = new Map();

        // =============================================
        // RAW STATS
        // =============================================
        const rawStats = await RawAdsterraStats.find({
          userId,
          date: {
            $gte: finalStartDate,
            $lte: finalEndDate,
          },
        });

        if (!rawStats.length) {
          console.log("NO RAW STATS =>", userId);
          continue;
        }

        totalUsers += 1;
        totalStats += rawStats.length;

        // =============================================
        // STORAGE FOR BULK OPERATIONS
        // =============================================
        const overallOps = [];

        // =============================================
        // LOOP RAW STATS
        // =============================================
        for (const item of rawStats) {
          try {
            // =========================================
            // CLEAN VALUES
            // =========================================
            const cleanDomain = String(item.domain || "unknown").trim().toLowerCase();
            const cleanPlacement = String(item.placement || "").trim();
            const cleanCountry = String(item.country || "ALL").trim();
            const cleanDate = String(normalizeDate(item.date)).trim();

            // =========================================
            // UNIQUE KEY FOR THIS REVENUE ITEM
            // =========================================
            const rawRevenueKey = `${cleanDomain}_${cleanPlacement}_${cleanCountry}_${cleanDate}`;
            const revenueKey = Buffer.from(rawRevenueKey).toString("base64");

            // =========================================
            // PERCENTAGES
            // =========================================
            const impressionPercent = Number(item.impressionPercent || 10);
            const cpmPercent = Number(item.cpmPercent || 40);

            // =========================================
            // FINAL IMPRESSIONS
            // =========================================
            const finalImpressions = Number(item.impressions || 0) * (1 - (impressionPercent / 100));

            // =========================================
            // FINAL CPM
            // =========================================
            const finalCpm = Number(item.cpm || 0) * (1 - (cpmPercent / 100));

            // =========================================
            // FINAL REVENUE (YAHI VALUE USE HOGI)
            // =========================================
            const finalRevenue = (finalImpressions / 1000) * finalCpm;
            const roundedRevenue = Number(finalRevenue.toFixed(6));

            // =========================================
            // CTR
            // =========================================
            const ctr = finalImpressions > 0
              ? Number(((Number(item.clicks || 0) / Number(finalImpressions)) * 100).toFixed(2))
              : 0;

            // =========================================
            // TRACK REVENUE FOR THIS USER (WITHOUT DUPLICATES)
            // =========================================
            if (!revenueKeyTracker.has(revenueKey)) {
              userTotalCalculatedRevenue += roundedRevenue;
              totalRevenue += roundedRevenue;
              revenueKeyTracker.add(revenueKey);

              // =======================================
              // STATE-WISE REVENUE TRACKING
              // =======================================
              const currentStateRevenue = userStateRevenue.get(cleanCountry) || 0;
              userStateRevenue.set(cleanCountry, currentStateRevenue + roundedRevenue);
            }

            // =========================================
            // CHECK FOR NEW REVENUE (INCREMENTAL)
            // =========================================
            const currentRevenue = roundedRevenue;
            const oldRevenue = Number(user.lastRevenueMap.get(revenueKey) || 0);

            if (currentRevenue > oldRevenue) {
              const difference = Number((currentRevenue - oldRevenue).toFixed(6));
              userNewRevenue += difference;
              user.lastRevenueMap.set(revenueKey, currentRevenue);
            }

            // =========================================
            // PREPARE BULK UPSERT
            // =========================================
            overallOps.push({
              updateOne: {
                filter: {
                  domain: cleanDomain,
                  placement: cleanPlacement,
                  country: cleanCountry,
                  date: cleanDate,
                },
                update: {
                  $set: {
                    userId: new mongoose.Types.ObjectId(userId),
                    domain: cleanDomain,
                    placement: cleanPlacement,
                    country: cleanCountry,
                    date: cleanDate,
                    device: item.device || "desktop",
                    deviceModel: item.deviceModel || "",
                    deviceVendor: item.deviceVendor || "",
                    osName: item.osName || "",
                    osVersion: item.osVersion || "",
                    browserName: item.browserName || "",
                    browserVersion: item.browserVersion || "",
                    impressions: Math.floor(finalImpressions),
                    clicks: Number(item.clicks || 0),
                    ctr,
                    cpm: Number(finalCpm.toFixed(6)),
                    revenue: roundedRevenue,
                    impressionPercent: Number(impressionPercent),
                    cpmPercent: Number(cpmPercent),
                    updatedAt: new Date(),
                  },
                  $setOnInsert: {
                    createdAt: new Date(),
                  },
                },
                upsert: true,
              },
            });

          } catch (err) {
            console.log("RAW STATS ERROR =>", err.message);
          }
        }

        // =============================================
        // REMOVE DUPLICATES FROM BULK OPS
        // =============================================
        const uniqueMap = new Map();
        for (const op of overallOps) {
          const f = op.updateOne.filter;
          const key = `${f.domain}_${f.placement}_${f.country}_${f.date}`;
          if (!uniqueMap.has(key)) {
            uniqueMap.set(key, op);
          }
        }
        const finalOps = Array.from(uniqueMap.values());

        // =============================================
        // BULK SAVE CALCULATED STATS
        // =============================================
        if (finalOps.length) {
          await CalculatedAdsterraStats.bulkWrite(finalOps, { ordered: false });
          console.log("BULK UPSERT SUCCESS =>", finalOps.length);
        }

        // =============================================
        // STORE STATE REVENUE IN lastRevenueMap (FIXED)
        // =============================================
        // Store state-wise revenue in lastRevenueMap with special keys
        for (const [state, revenue] of userStateRevenue.entries()) {
          const stateKey = `__STATE_${state}__`;
          const existingStateRevenue = user.lastRevenueMap.get(stateKey) || 0;
          user.lastRevenueMap.set(stateKey, existingStateRevenue + revenue);
        }

        // Also store total revenue for this period
        const periodKey = `__PERIOD_${finalStartDate}_TO_${finalEndDate}__`;
        const existingPeriodRevenue = user.lastRevenueMap.get(periodKey) || 0;
        user.lastRevenueMap.set(periodKey, existingPeriodRevenue + userTotalCalculatedRevenue);

        // =============================================
        // UPDATE USER WITH EXACT REVENUE
        // =============================================
        if (userNewRevenue > 0) {
          // Update main revenue field
          user.revenue = Number((Number(user.revenue || 0) + userNewRevenue).toFixed(6));

          console.log(`✅ USER ${userId} UPDATED:`);
          console.log(`   - Total Calculated Revenue (This Period): ₹${userTotalCalculatedRevenue.toFixed(6)}`);
          console.log(`   - New Revenue (Incremental): ₹${userNewRevenue.toFixed(6)}`);
          console.log(`   - Total Revenue (All Time): ₹${user.revenue.toFixed(6)}`);
          console.log(`   - State Breakdown:`, Object.fromEntries(userStateRevenue));
        }

        // Save user with all maps
        user.markModified("lastRevenueMap");
        user.markModified("lastReferralMap");
        await user.save();

        // =============================================
        // REFERRAL COMMISSION
        // =============================================
if (!user.isDemo && user.referredBy && userNewRevenue > 0) {

  const referredByCode = String(user.referredBy).trim().toUpperCase();

  const refUser = await User.findOne({
    referralCode: referredByCode
  });

  if (!refUser) {
    console.log("❌ REF USER NOT FOUND =>", referredByCode);
    continue; // ❌ not return
  }

  if (!refUser.lastReferralMap) {
    refUser.lastReferralMap = new Map();
  }

  const referralKey = Buffer.from(
    `${user._id}_${finalStartDate}_${finalEndDate}`
  ).toString("base64");

  const oldReferralData = refUser.lastReferralMap.get(referralKey) || { amount: 0 };
  const oldReferral = Number(oldReferralData.amount || 0);

  let referralPercent = 0;

  if (userNewRevenue <= 199) referralPercent = 10;
  else if (userNewRevenue <= 299) referralPercent = 12;
  else if (userNewRevenue <= 999) referralPercent = 15;
  else referralPercent = 10;

  const newReferralAmount = (userNewRevenue * referralPercent) / 100;

  const finalReferral = Number((newReferralAmount - oldReferral).toFixed(6));

  if (finalReferral > 0) {

    refUser.referralAmount =
      Number(refUser.referralAmount || 0) + finalReferral;

    refUser.lastReferralMap.set(referralKey, {
      name: user.name,
      amount: newReferralAmount,
      revenue: userNewRevenue,
      percent: referralPercent,
      date: new Date().toISOString().split("T")[0],
    });

    refUser.markModified("lastReferralMap");
    refUser.markModified("referralAmount");

    await refUser.save();

    console.log("✅ REFERRAL ADDED =>", {
      refUser: refUser._id,
      added: finalReferral,
      total: refUser.referralAmount
    });
  }
}

      } catch (err) {
        console.log("USER PROCESS ERROR =>", user?._id, err.message);
      }
    }

    // =================================================
    // VERIFICATION
    // =================================================
    console.log("=========================================");
    console.log(`✅ TOTAL USERS: ${totalUsers}`);
    console.log(`✅ TOTAL STATS: ${totalStats}`);
    console.log(`✅ TOTAL REVENUE: ₹${totalRevenue.toFixed(6)}`);
    console.log(`✅ PERIOD: ${finalStartDate} to ${finalEndDate}`);
    console.log("=========================================");

    // =================================================
    // FINAL RESPONSE
    // =================================================
    const finalResponse = {
      success: true,
      message: "All users stats updated successfully",
      totalUsers,
      totalStats,
      totalRevenue: Number(totalRevenue.toFixed(6)),
      start_date: finalStartDate,
      end_date: finalEndDate,
    };

    if (res) {
      return res.status(200).json(finalResponse);
    }
    return finalResponse;

  } catch (error) {
    console.log("ADSTERRA FETCH ERROR =>", error.message);
    if (res) {
      return res.status(500).json({
        success: false,
        message: "Failed to process stats",
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
      // CONFIG
      // =================================================

      let config =
        await StatsConfig.findOne();

      if (!config) {

        config =
          await StatsConfig.create({
            impressionPercent: 10,
            cpmPercent: 40,
          });
      }

      // =================================================
      // TOTAL STORAGE
      // =================================================

      let totalUsers = 0;

      let totalStats = 0;

      let totalRevenue = 0;

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
            await RawsmartLinkStats.find({
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
          // LOOP RAW DOCS
          // =============================================

          for (const rawDoc of rawStats) {

            try {

              const calculatedStats = [];

              // =========================================
              // LOOP STATS ARRAY
              // =========================================

              for (const item of rawDoc.stats) {

                try {

                  // =====================================
                  // FINAL IMPRESSIONS
                  // =====================================

                  const finalImpressions =
                    Number(
                      item?.impressions || 0
                    ) *
                    (
                      1 -
                      (
                        Number(
                          config.impressionPercent || 0
                        ) / 100
                      )
                    );

                  // =====================================
                  // FINAL CPM
                  // =====================================

                  const finalCpm =
                    Number(
                      item?.cpm || 0
                    ) *
                    (
                      1 -
                      (
                        Number(
                          config.cpmPercent || 0
                        ) / 100
                      )
                    );

                  // =====================================
                  // FINAL REVENUE
                  // =====================================

                  const finalRevenue =
                    (
                      finalImpressions / 1000
                    ) *
                    finalCpm;

                  // =====================================
                  // TOTAL REVENUE
                  // =====================================

                  totalRevenue +=
                    Number(
                      finalRevenue.toFixed(6)
                    );

                  // =====================================
                  // PUSH FINAL DATA
                  // =====================================

                  calculatedStats.push({

                    placement:
                      item.placement || "",

                    domain:
                      item.domain || "",

                    country:
                      item.country || "ALL",

                    date:
                      String(
                        normalizeDate(
                          item.date
                        )
                      ),

                    impressions:
                      Math.floor(
                        finalImpressions
                      ),

                    clicks:
                      Number(
                        item.clicks || 0
                      ),

                    ctr:
                      Number(
                        item.ctr || 0
                      ),

                    cpm:
                      Number(
                        finalCpm.toFixed(6)
                      ),

                    revenue:
                      Number(
                        finalRevenue.toFixed(6)
                      ),

                    impressionPercent:
                      Number(
                        config.impressionPercent || 0
                      ),

                    cpmPercent:
                      Number(
                        config.cpmPercent || 0
                      ),
                  });

                } catch (err) {

                  console.log(
                    "ITEM ERROR =>",
                    err.message
                  );
                }
              }

              // =========================================
              // FINAL DOC
              // =========================================

              const finalDoc = {

                userId:
                  rawDoc.userId,

                device:
                  rawDoc.device || "desktop",

                osName:
                  rawDoc.osName || "",

                browserName:
                  rawDoc.browserName || "",

                date:
                  String(
                    normalizeDate(
                      rawDoc.date
                    )
                  ),

                stats:
                  calculatedStats,
              };

              // =========================================
              // UPDATE / CREATE
              // =========================================

              await CalculatedSmartLinkStats.findOneAndUpdate(
                {
                  userId:
                    rawDoc.userId,

                  device:
                    rawDoc.device || "desktop",

                  date:
                    String(
                      normalizeDate(
                        rawDoc.date
                      )
                    ),
                },

                {
                  $set:
                    finalDoc,
                },

                {
                  upsert: true,
                  returnDocument: "after",
                }
              );

            } catch (err) {

              console.log(
                "RAW DOC ERROR =>",
                err.message
              );
            }
          }

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
          "Calculated SmartLink stats updated successfully",

        totalUsers,

        totalStats,

        totalRevenue:
          Number(
            totalRevenue.toFixed(6)
          ),

        start_date:
          finalStartDate,

        end_date:
          finalEndDate,
      };

      console.log(
        finalResponse
      );

      if (res) {

        return res.status(200).json(
          finalResponse
        );
      }

      return finalResponse;

    } catch (error) {

      console.error(
        "SMARTLINK CALCULATE ERROR =>",
        error.message
      );

      if (res) {

        return res.status(500).json({
          success: false,

          message:
            "Failed to calculate smartlink stats",

          error:
            error.message,
        });
      }

      return {
        success: false,
        error:
          error.message,
      };
    }
  };


module.exports = {
  calculateAndStoreAdsterraStats,
  calculateAndStoreSmartLinkStats,
  calculateAndStoreWebsiteStats
};
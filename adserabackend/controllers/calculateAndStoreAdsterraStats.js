const RawAdsterraStats = require("../models/RawAdsterraStats");

const RawsmartLinkStats = require("../models/RawsmartLinkStats");

const CalculatedAdsterraStats = require(
  "../models/CalculatedAdsterraStats"
);

const CalculatedSmartLinkStats = require(
  "../models/CalculatedSmartLinkStats"
);

const StatsConfig = require("../models/StatsConfig");

// ======================================================
// CALCULATE ADSTERRA STATS
// ======================================================

const calculateAndStoreAdsterraStats = async () => {
  try {
    // GET CONFIG
    let config = await StatsConfig.findOne();

    if (!config) {
      config = await StatsConfig.create({
        impressionPercent: 0,
        cpmPercent: 0,
      });
    }

    // GET RAW DATA
    const rawStats = await RawAdsterraStats.find();

    for (const item of rawStats) {
      // ======================================================
      // DIRECT VALUES (NO % CALCULATION)
      // ======================================================

      const finalImpressions = Number(item.impressions || 0);

      const finalCpm = Number(item.cpm || 0);

      // ======================================================
      // REVENUE
      // FORMULA = (IMPRESSIONS / 1000) * CPM
      // ======================================================

      const finalRevenue =
        (finalImpressions / 1000) * finalCpm;

      // ======================================================
      // CHECK EXISTING
      // ======================================================

      const existing =
        await CalculatedAdsterraStats.findOne({
          domain: item.domain,

          placement: item.placement,

          country: item.country,

          date: item.date,
        });

      // ======================================================
      // FINAL DATA
      // ======================================================

      const calculatedData = {
        userId: item.userId,

        domain: item.domain,

        placement: item.placement,

        country: item.country,

        device: item.device,

        deviceModel: item.deviceModel,

        deviceVendor: item.deviceVendor,

        osName: item.osName,

        osVersion: item.osVersion,

        browserName: item.browserName,

        browserVersion: item.browserVersion,

        clicks: Number(item.clicks || 0),

        ctr: Number(item.ctr || 0),

        date: item.date,

        impressions: Math.floor(finalImpressions),

        cpm: Number(finalCpm.toFixed(3)),

        revenue: Number(finalRevenue.toFixed(2)),
      };

      // ======================================================
      // UPDATE / CREATE
      // ======================================================

      if (existing) {
        await CalculatedAdsterraStats.findByIdAndUpdate(
          existing._id,
          calculatedData,
          {
            new: true,
          }
        );
      } else {
        await CalculatedAdsterraStats.create(
          calculatedData
        );
      }
    }

    console.log(
      "Calculated Adsterra stats stored successfully"
    );
  } catch (error) {
    console.log(
      "calculateAndStoreAdsterraStats Error:",
      error
    );
  }
};

// ======================================================
// CALCULATE SMARTLINK STATS
// ======================================================

const calculateAndStoreSmartLinkStats =
  async () => {
    try {
      // GET CONFIG
      let config =
        await StatsConfig.findOne();

      if (!config) {
        config =
          await StatsConfig.create({
            impressionPercent: 0,

            cpmPercent: 0,
          });
      }

      // GET RAW DATA
      const rawStats =
        await RawsmartLinkStats.find();

      // LOOP ALL DOCS
      for (const rawDoc of rawStats) {
        const calculatedStats = [];

        // LOOP STATS ARRAY
        for (const item of rawDoc.stats) {
          // ======================================================
          // DIRECT VALUES (NO % CALCULATION)
          // ======================================================

          const finalImpressions =
            Number(item.impressions || 0);

          const finalCpm = Number(
            item.cpm || 0
          );

          // ======================================================
          // REVENUE
          // ======================================================

          const finalRevenue =
            (finalImpressions / 1000) *
            finalCpm;

          // PUSH FINAL DATA
          calculatedStats.push({
            placement: item.placement,

            domain: item.domain,

            country: item.country,

            date: item.date,

            clicks: Number(
              item.clicks || 0
            ),

            ctr: Number(item.ctr || 0),

            impressions: Math.floor(
              finalImpressions
            ),

            cpm: Number(
              finalCpm.toFixed(3)
            ),

            revenue: Number(
              finalRevenue.toFixed(2)
            ),
          });
        }

        // ======================================================
        // CHECK EXISTING
        // ======================================================

        const existing =
          await CalculatedSmartLinkStats.findOne(
            {
              userId: rawDoc.userId,

              device: rawDoc.device,

              date: rawDoc.date,
            }
          );

        // ======================================================
        // FINAL DOC
        // ======================================================

        const finalDoc = {
          userId: rawDoc.userId,

          device: rawDoc.device,

          osName: rawDoc.osName,

          browserName:
            rawDoc.browserName,

          date: rawDoc.date,

          stats: calculatedStats,
        };

        // ======================================================
        // UPDATE / CREATE
        // ======================================================

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
      console.log(
        "calculateAndStoreSmartLinkStats Error:",
        error
      );
    }
  };

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  calculateAndStoreAdsterraStats,
  calculateAndStoreSmartLinkStats,
};
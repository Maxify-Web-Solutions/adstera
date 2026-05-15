const RawAdsterraStats =
    require("../models/RawAdsterraStats");

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

const calculateAndStoreAdsterraStats =
    async () => {
        try {
            // GET CONFIG
            let config =
                await StatsConfig.findOne();

            if (!config) {
                config =
                    await StatsConfig.create({
                        impressionPercent: 10,
                        cpmPercent: 40,
                    });
            }

            // GET RAW DATA
            const rawStats =
                await RawAdsterraStats.find();

            for (const item of rawStats) {
                // APPLY %
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

                // REVENUE
                const finalRevenue =
                    (finalImpressions / 1000) *
                    finalCpm;

                // CHECK EXISTING
                const existing =
                    await CalculatedAdsterraStats.findOne(
                        {
                            domain: item.domain,
                            placement:
                                item.placement,
                            country: item.country,
                            date: item.date,
                        }
                    );

                // DATA
                const calculatedData = {
                    userId: item.userId,

                    domain: item.domain,

                    placement: item.placement,

                    country: item.country,

                    device: item.device,

                    deviceModel:
                        item.deviceModel,

                    deviceVendor:
                        item.deviceVendor,

                    osName: item.osName,

                    osVersion:
                        item.osVersion,

                    browserName:
                        item.browserName,

                    browserVersion:
                        item.browserVersion,

                    clicks: item.clicks,

                    ctr: item.ctr,

                    date: item.date,

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
                };

                // UPDATE / CREATE
                if (existing) {
                    await CalculatedAdsterraStats.findByIdAndUpdate(
                        existing._id,
                        calculatedData
                    );
                } else {
                    await CalculatedAdsterraStats.create(
                        calculatedData
                    );
                }
            }

            console.log(
                "Calculated stats stored successfully"
            );
        } catch (error) {
            console.log(error);
        }
    };

module.exports =
    calculateAndStoreAdsterraStats;


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

module.exports =
    calculateAndStoreSmartLinkStats;
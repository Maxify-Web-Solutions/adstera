const cron = require("node-cron");

const {
  saveUserMonthlyStats,
} = require("../controllers/userMonthlyStatsController");

const {
  RawfetchAndStoreAdsterraStats,
  RawfetchAndStoreCountryStats,
  RawFetchAndStoreWebsiteStats,
} = require("../controllers/Rawcontroller");

const {
  calculateAndStoreAdsterraStats,
  calculateAndStoreSmartLinkStats,
  calculateAndStoreWebsiteStats,
} = require("../controllers/calculateAndStoreAdsterraStats");

// ======================================================
// USER MONTHLY STATS
// EVERY 30 MINUTES
// RUNS AT: 00,30
// ======================================================

cron.schedule("0,30 * * * *", async () => {
  try {
    console.log(
      "⏰ Running User Monthly Stats Cron"
    );

    await saveUserMonthlyStats();

    console.log(
      "✅ User Monthly Stats Done"
    );
  } catch (error) {
    console.log(
      "USER MONTHLY STATS CRON ERROR =>",
      error.message
    );
  }
});

// ======================================================
// RAW ADSTERRA OVERALL STATS
// EVERY 15 MINUTES
// RUNS AT: 05,20,35,50
// ======================================================

cron.schedule("5,20,35,50 * * * *", async () => {
  try {
    console.log(
      "⏰ Running Raw Adsterra Overall Stats Cron"
    );

    await RawfetchAndStoreAdsterraStats();

    console.log(
      "✅ Raw Adsterra Overall Stats Done"
    );
  } catch (error) {
    console.log(
      "RAW ADSTERRA OVERALL CRON ERROR =>",
      error.message
    );
  }
});

// ======================================================
// RAW WEBSITE STATS
// EVERY 15 MINUTES
// RUNS AT: 10,25,40,55
// ======================================================

cron.schedule("10,25,40,55 * * * *", async () => {
  try {
    console.log(
      "⏰ Running Raw Website Stats Cron"
    );

    await RawFetchAndStoreWebsiteStats();

    console.log(
      "✅ Raw Website Stats Done"
    );
  } catch (error) {
    console.log(
      "RAW WEBSITE STATS CRON ERROR =>",
      error.message
    );
  }
});

// ======================================================
// RAW COUNTRY STATS
// EVERY 15 MINUTES
// RUNS AT: 00,15,30,45
// ======================================================

cron.schedule("0,15,30,45 * * * *", async () => {
  try {
    console.log(
      "⏰ Running Raw Country Stats Cron"
    );

    await RawfetchAndStoreCountryStats();

    console.log(
      "✅ Raw Country Stats Done"
    );
  } catch (error) {
    console.log(
      "RAW COUNTRY STATS CRON ERROR =>",
      error.message
    );
  }
});

// ======================================================
// CALCULATE SMARTLINK STATS
// EVERY 15 MINUTES
// RUNS AT: 02,17,32,47
// ======================================================

cron.schedule("2,17,32,47 * * * *", async () => {
  try {
    console.log(
      "⏰ Running Calculate SmartLink Stats Cron"
    );

    await calculateAndStoreSmartLinkStats();

    console.log(
      "✅ Calculate SmartLink Stats Done"
    );
  } catch (error) {
    console.log(
      "CALCULATE SMARTLINK STATS CRON ERROR =>",
      error.message
    );
  }
});

// ======================================================
// CALCULATE WEBSITE STATS
// EVERY 15 MINUTES
// RUNS AT: 07,22,37,52
// ======================================================

cron.schedule("7,22,37,52 * * * *", async () => {
  try {
    console.log(
      "⏰ Running Calculate Website Stats Cron"
    );

    await calculateAndStoreWebsiteStats();

    console.log(
      "✅ Calculate Website Stats Done"
    );
  } catch (error) {
    console.log(
      "CALCULATE WEBSITE STATS CRON ERROR =>",
      error.message
    );
  }
});

// ======================================================
// CALCULATE ADSTERRA STATS
// EVERY 15 MINUTES
// RUNS AT: 12,27,42,57
// ======================================================

cron.schedule("12,27,42,57 * * * *", async () => {
  try {
    console.log(
      "⏰ Running Calculate Adsterra Stats Cron"
    );

    await calculateAndStoreAdsterraStats();

    console.log(
      "✅ Calculate Adsterra Stats Done"
    );
  } catch (error) {
    console.log(
      "CALCULATE ADSTERRA STATS CRON ERROR =>",
      error.message
    );
  }
});
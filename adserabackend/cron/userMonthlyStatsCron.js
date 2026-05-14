const cron = require("node-cron");

const {
  saveUserMonthlyStats,
} = require("../controllers/userMonthlyStatsController");

const {
  fetchAndStoreAdsterraStatsForAllUsers,
} = require("../controllers/adsterracontroller");

// ======================================================
// FETCH ADSTERRA REVENUE
// EVERY 20 MINUTES
// ======================================================

cron.schedule("*/20 * * * *", async () => {
  try {
    console.log(
      "⏰ RUNNING ADSTERRA FETCH CRON"
    );

    await fetchAndStoreAdsterraStatsForAllUsers();

    console.log(
      "✅ ADSTERRA REVENUE UPDATED"
    );
  } catch (error) {
    console.log(
      "❌ FETCH CRON ERROR =>",
      error.message
    );
  }
});

// ======================================================
// SAVE USER MONTHLY SNAPSHOTS
// EVERY 30 MINUTES
// ======================================================

cron.schedule("*/30 * * * *", async () => {
  try {
    console.log(
      "⏰ RUNNING MONTHLY SNAPSHOT CRON"
    );

    await saveUserMonthlyStats();

    console.log(
      "✅ MONTHLY SNAPSHOTS SAVED"
    );
  } catch (error) {
    console.log(
      "❌ SNAPSHOT CRON ERROR =>",
      error.message
    );
  }
});
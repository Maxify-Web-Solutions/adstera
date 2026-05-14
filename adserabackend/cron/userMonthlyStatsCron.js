const cron = require("node-cron");

const {
  saveUserMonthlyStats,
} = require("../controllers/userMonthlyStatsController");

const {
  fetchAndStoreAdsterraStatsForAllUsers,
} = require("../controllers/adsterraController");

// ======================================================
// FETCH ADSTERRA REVENUE
// EVERY 20 MINUTES
// ======================================================

cron.schedule("*/2 * * * *", async () => {
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



cron.schedule("*/3 * * * *", async () => {
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
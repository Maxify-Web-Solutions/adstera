const cron = require("node-cron");

const {
  saveUserMonthlyStats,
} = require("../controllers/userMonthlyStatsController");

// ======================================================
// EVERY 30 MINUTES
// ======================================================

cron.schedule("*/30 * * * *", async () => {
  console.log("⏰ Running User Monthly Stats Cron");

  await saveUserMonthlyStats();
});
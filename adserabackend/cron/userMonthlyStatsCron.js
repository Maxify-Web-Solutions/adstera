const cron = require("node-cron");

const {
  saveUserMonthlyStats,
} = require("../controllers/userMonthlyStatsController");

const {
  fetchAndStoreAdsterraStats,
} = require("../controllers/adsterraController");

// ======================================================
// USER MONTHLY STATS
// EVERY 30 MINUTES
// ======================================================

cron.schedule("*/20 * * * *", async () => {
  try {
    console.log("⏰ Running User Monthly Stats Cron");

    await saveUserMonthlyStats();
  } catch (error) {
    console.log(
      "USER MONTHLY STATS CRON ERROR =>",
      error.message
    );
  }
});

// ======================================================
// ADSTERRA STATS
// EVERY 20 MINUTES
// ======================================================

cron.schedule("*/15 * * * *", async () => {
  try {
    console.log("⏰ Running Adsterra Stats Cron");

    await fetchAndStoreAdsterraStats(
      {
        query: {},
        headers: {
          "user-agent": "Mozilla/5.0",
        },
      },
      {
        status: () => ({
          json: (data) => {
            console.log(
              "ADSTERRA CRON SUCCESS =>",
              data.message
            );
          },
        }),
      }
    );
  } catch (error) {
    console.log(
      "ADSTERRA CRON ERROR =>",
      error.message
    );
  }
});
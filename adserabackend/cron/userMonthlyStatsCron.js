const cron = require("node-cron");

const {
  saveUserMonthlyStats,
} = require("../controllers/userMonthlyStatsController");

const {
  fetchAndStoreAdsterraStats,
  fetchAndStoreCountryStats,
} = require("../controllers/adsterracontroller");

// ======================================================
// USER MONTHLY STATS
// EVERY 10 MINUTES
// RUNS AT: 00,10,20,30,40,50
// ======================================================

cron.schedule("*/10 * * * *", async () => {
  try {
    console.log(
      "⏰ Running User Monthly Stats Cron"
    );

    await saveUserMonthlyStats();

  } catch (error) {
    console.log(
      "USER MONTHLY STATS CRON ERROR =>",
      error.message
    );
  }
});

// ======================================================
// ADSTERRA OVERALL STATS
// EVERY 15 MINUTES
// RUNS AT: 05,20,35,50
// ======================================================

cron.schedule("*/2 * * * *", async () => {
  try {

    console.log(
      "⏰ Running Adsterra Overall Stats Cron"
    );

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
              "ADSTERRA OVERALL SUCCESS =>",
              data.message
            );
          },
        }),
      }
    );

  } catch (error) {

    console.log(
      "ADSTERRA OVERALL CRON ERROR =>",
      error.message
    );
  }
});

// ======================================================
// ADSTERRA COUNTRY STATS
// EVERY 15 MINUTES
// RUNS AT: 12,27,42,57
// ======================================================

cron.schedule("*/1 * * * *", async () => {
  try {
    const response =
      await fetchAndStoreCountryStats();

    console.log(
      "CRON RESPONSE =>",
      response
    );
  } catch (error) {
    console.log(
      "CRON ERROR =>",
      error.message
    );
  }
});
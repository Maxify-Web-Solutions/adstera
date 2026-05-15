const cron = require("node-cron");

const {
  saveUserMonthlyStats,
} = require("../controllers/userMonthlyStatsController");

const {
  fetchAndStoreAdsterraStats,
  fetchAndStoreCountryStats,
} = require("../controllers/adsterracontroller");
const { RawfetchAndStoreAdsterraStats, RawfetchAndStoreCountryStats } = require("../controllers/Rawcontroller");

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
// ADSTERRA OVERALL STATS
// EVERY 15 MINUTES
// RUNS AT: 05,20,35,50
// ======================================================

// cron.schedule("5,20,35,50 * * * *", async () => {
//   try {

//     console.log(
//       "⏰ Running Adsterra Overall Stats Cron"
//     );

//     await fetchAndStoreAdsterraStats(
//       {
//         query: {},

//         headers: {
//           "user-agent": "Mozilla/5.0",
//         },
//       },

//       {
//         status: () => ({
//           json: (data) => {

//             console.log(
//               "ADSTERRA OVERALL SUCCESS =>",
//               data.message
//             );
//           },
//         }),
//       }
//     );

//     console.log(
//       "✅ Adsterra Overall Stats Done"
//     );

//   } catch (error) {

//     console.log(
//       "ADSTERRA OVERALL CRON ERROR =>",
//       error.message
//     );
//   }
// });

// ======================================================
// RAW ADSTERRA OVERALL STATS
// EVERY 15 MINUTES
// RUNS AT: 08,23,38,53
// GAP ADDED TO AVOID COLLISION
// ======================================================

cron.schedule("8,23,38,53 * * * *", async () => {
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
// ADSTERRA COUNTRY STATS
// EVERY 15 MINUTES
// RUNS AT: 12,27,42,57
// ======================================================

// cron.schedule("12,27,42,57 * * * *", async () => {
//   try {

//     console.log(
//       "⏰ Running Adsterra Country Stats Cron"
//     );

//     const response =
//       await fetchAndStoreCountryStats();

//     console.log(
//       "COUNTRY STATS RESPONSE =>",
//       response
//     );

//     console.log(
//       "✅ Adsterra Country Stats Done"
//     );

//   } catch (error) {

//     console.log(
//       "COUNTRY STATS CRON ERROR =>",
//       error.message
//     );
//   }
// });

// ======================================================
// RAW COUNTRY STATS
// EVERY 15 MINUTES
// RUNS AT: 15,30,45,00
// GAP ADDED TO AVOID COLLISION
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
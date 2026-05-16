const mongoose = require("mongoose");
const RawAdsterraStats = require("./models/RawAdsterraStats");

const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

// ================== MONGODB CONNECT ==================
mongoose
  .connect(
    "mongodb+srv://saqlainjin_db_user:4sUs6g3z2861Tkhx@cluster0.bb0ekzq.mongodb.net/?appName=Cluster0"
  )
  .then(() => {
    console.log("✅ MongoDB Connected");
    seedData();
  })
  .catch((err) => {
    console.log("❌ MongoDB Error:", err);
  });

// ================== BASE DATA ==================
const rawData = [
  {
    country: "ALL",
    placement: "28673024",
    date: "2026-05-16",
    domain:
      "https://www.profitablecpmratenetwork.com/prqw5i07e3?key=4dd9b5af0bbdbcdf16211a03e41757e5",
    clicks: 7,
    cpm: 5.004,
    ctr: 0.95,
    device: "desktop",
    impressions: 640,
    revenue: 13.2,
    userId: "6a083cd97df6e30d0158b2fa",
  },
];

// ================== DATE LOOP FUNCTION ==================
function generateDateRange(startDate, endDate) {
  const dates = [];

  const current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    dates.push(current.toISOString().split("T")[0]);

    current.setDate(current.getDate() + 1);
  }

  return dates;
}

// ================== RANDOM NUMBER ==================
function randomBetween(min, max, fixed = 2) {
  return Number((Math.random() * (max - min) + min).toFixed(fixed));
}

// ================== GENERATE RANDOM STATS ==================
function generateRandomStats(baseItem, date) {
  const impressions = Math.floor(randomBetween(250, 1200, 0));

  const clicks = Math.floor(impressions * randomBetween(0.005, 0.02, 4));

  const cpm = randomBetween(3.5, 6.5, 3);

  const revenue = Number(((impressions / 1000) * cpm).toFixed(6));

  const ctr = Number(((clicks / impressions) * 100).toFixed(2));

  return {
    userId: new mongoose.Types.ObjectId(baseItem.userId),

    domain: baseItem.domain,
    placement: baseItem.placement,
    country: baseItem.country,

    device: "desktop",
    deviceModel: "",
    deviceVendor: "",

    osName: "",
    osVersion: "",

    browserName: "",
    browserVersion: "",

    impressions,
    clicks,
    ctr,
    cpm,
    revenue,

    date,
  };
}

// ================== INSERT FUNCTION ==================
async function seedData() {
  try {
    // START DATE
    const startDate = "2026-04-23";

    // TODAY DATE
    const today = new Date().toISOString().split("T")[0];

    // ALL DATES
    const allDates = generateDateRange(startDate, today);

    console.log(`📅 Total Dates: ${allDates.length}`);

    for (const date of allDates) {
      // CHECK IF DATE ALREADY EXISTS
      const exists = await RawAdsterraStats.findOne({
        date,
        domain: rawData[0].domain,
        placement: rawData[0].placement,
        country: rawData[0].country,
      });

      // SKIP IF EXISTS
      if (exists) {
        console.log(`⏩ Skipped Existing Date: ${date}`);
        continue;
      }

      // GENERATE NEW DATA
      const item = generateRandomStats(rawData[0], date);

      // INSERT
      await RawAdsterraStats.create(item);

      console.log(`✅ Inserted: ${date}`);
    }

    console.log("🎉 All Missing Dates Inserted Successfully");

    process.exit();
  } catch (error) {
    console.log("❌ Upload Error:", error);
    process.exit(1);
  }
}
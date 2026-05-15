require("dotenv").config();

const mongoose = require("mongoose");
const dns = require("dns");
const axios = require("axios");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const User = require("../models/authmodel");
const AdsterraStats = require("../models/AdsterraStats");
const SmartLinkStats = require("../models/SmartLinkStats");
const Config = require("../models/Config");

const MONGO_URI =
  "mongodb+srv://saqlainjin_db_user:4sUs6g3z2861Tkhx@cluster0.bb0ekzq.mongodb.net/?appName=Cluster0";

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");

    await getUserPlacementData();
  })
  .catch((err) => {
    console.log("DB Error:", err.message);
  });

const getUserPlacementData = async () => {
  try {
    // CONFIG
    const config = await Config.findOne();

    if (!config?.adsterraApiKey) {
      console.log("Adsterra API key not found");
      return;
    }

    // ALL USERS
    const users = await User.find({}, "_id");

    for (const user of users) {
      console.log(
        `\n========== RUNNING FOR USER ID: ${user._id} ==========`
      );

      // ✅ GET ALL DATES DATA
      const stats = await AdsterraStats.find(
        {
          userId: user._id,
        },
        {
          userId: 1,
          placement: 1,
          date: 1,
        }
      ).sort({ date: 1 });

      if (stats.length === 0) {
        console.log(
          `⏭️ NO DATA FOUND FOR USER ${user._id}`
        );
        continue;
      }

      // ✅ LOOP EVERY DATE
      for (const item of stats) {
        try {
          const placementId = item.placement;

          // FORMAT DATE
          const singleDate = new Date(item.date)
            .toISOString()
            .split("T")[0];

          console.log("\n==============================");
          console.log("USER ID:", user._id);
          console.log("Placement:", placementId);
          console.log("Date:", singleDate);
          console.log("==============================");

          // API CALL
          const response = await axios.get(
            "https://api3.adsterratools.com/publisher/stats.json",
            {
              params: {
                placement: placementId,

                // ✅ SAME DATE
                start_date: singleDate,
                finish_date: singleDate,

                // ✅ COUNTRY WISE
                group_by: "country",
              },

              headers: {
                Accept: "application/json",
                "X-API-Key": config.adsterraApiKey,
                "User-Agent": "Mozilla/5.0",
              },
            }
          );

          const apiData = response.data?.items || [];

          // FIND EXISTING DOC
          let existingDoc = await SmartLinkStats.findOne({
            userId: user._id,
            device: "desktop",
            date: singleDate,
          });

          // CREATE NEW DOC IF NOT EXISTS
          if (!existingDoc) {
            existingDoc = new SmartLinkStats({
              userId: user._id,
              device: "desktop",
              osName: "",
              browserName: "",
              date: singleDate,
              stats: [],
            });

            console.log(
              `🆕 NEW DATE DOC CREATED ${singleDate}`
            );
          }

          // LOOP API DATA
          for (const row of apiData) {
            const countryName = row.country || "ALL";

            // ORIGINAL VALUES
            const originalImpressions = Number(
              row.impression || 0
            );

            const originalCpm = Number(
              row.cpm || 0
            );

            const originalRevenue = Number(
              row.revenue || 0
            );

            // FINAL VALUES
            const finalImpressions = Math.floor(
              originalImpressions * 0.9
            );

            const finalCpm = Number(
              (originalCpm * 0.5).toFixed(4)
            );

            const finalRevenue = Number(
              (originalRevenue * 0.5).toFixed(4)
            );

            // CHECK EXISTING placement + country
            const existingStatIndex =
              existingDoc.stats.findIndex(
                (s) =>
                  s.placement === placementId &&
                  s.country === countryName
              );

            // NEW DATA
            const statData = {
              placement: placementId,

              domain: row.domain || "",

              country: countryName,

              impressions: finalImpressions,

              clicks: Number(row.clicks || 0),

              ctr: Number(row.ctr || 0),

              cpm: finalCpm,

              revenue: finalRevenue,
            };

            // ✅ UPDATE EXISTING
            if (existingStatIndex !== -1) {
              existingDoc.stats[existingStatIndex] =
                statData;

              console.log(
                `♻️ UPDATED ${placementId} | ${countryName} | ${singleDate}`
              );
            } else {
              // ✅ INSERT NEW
              existingDoc.stats.push(statData);

              console.log(
                `🆕 NEW COUNTRY ADDED ${placementId} | ${countryName} | ${singleDate}`
              );
            }
          }

          // SAVE
          await existingDoc.save();

          console.log(
            `✅ SAVED USER ${user._id} | ${placementId} | ${singleDate}`
          );
        } catch (apiError) {
          console.log(
            `\nAPI Error For USER ${user._id}:`,
            apiError.response?.data || apiError.message
          );
        }
      }
    }

    console.log("\nALL DONE ✅");
  } catch (error) {
    console.log("Main Error:", error.message);
  }
};
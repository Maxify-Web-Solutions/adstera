// controllers/calculatedWebsiteController.js

const mongoose = require("mongoose");

const CalculatedWebsite = require(
  "../models/CalculatedWebsite"
);

// =====================================================
// GET ALL CALCULATED WEBSITE STATS
// USER KI SAARI DATES KA DATA
// =====================================================

exports.getCalculatedWebsiteStats =
  async (req, res) => {
    try {

      // =========================================
      // USER ID
      // =========================================

      const userId =
        req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message:
            "Unauthorized user",
        });
      }

      // =========================================
      // QUERY PARAMS
      // =========================================

      const {
        start_date,
        end_date,
      } = req.query;

      // =========================================
      // FILTER
      // =========================================

      const filter = {

        // ✅ USER ID
        userId:
          new mongoose.Types.ObjectId(
            userId
          ),
      };

      // =========================================
      // OPTIONAL DATE FILTER
      // =========================================

      // ⚠️ date STRING format me hai
      // Example: "2026-05-26"

      if (
        start_date &&
        end_date
      ) {

        filter.date = {
          $gte: start_date,
          $lte: end_date,
        };
      }

      else if (start_date) {

        filter.date = {
          $gte: start_date,
        };
      }

      else if (end_date) {

        filter.date = {
          $lte: end_date,
        };
      }

      console.log(
        "FINAL FILTER =>",
        filter
      );

      // =========================================
      // GET ALL USER DATA
      // =========================================

      const stats =
        await CalculatedWebsite.find(
          filter
        ).sort({
          date: -1,
          createdAt: -1,
        });

      // =========================================
      // NO DATA
      // =========================================

      if (!stats.length) {

        return res.status(200).json({

          success: true,

          message:
            "No stats found",

          totalStats: 0,

          totalPlacements: 0,

          totals: {

            impressions: 0,

            clicks: 0,

            ctr: 0,

            revenue: 0,
          },

          data: [],
        });
      }

      // =========================================
      // OVERALL TOTALS
      // =========================================

      let totalRevenue = 0;

      let totalImpressions = 0;

      let totalClicks = 0;

      let totalPlacements = 0;

      // =========================================
      // CALCULATE TOTALS
      // =========================================

      for (const item of stats) {

        if (
          Array.isArray(
            item.placements
          )
        ) {

          totalPlacements +=
            item.placements.length;

          for (const p of item.placements) {

            totalRevenue += Number(
              p?.revenue || 0
            );

            totalImpressions += Number(
              p?.impressions || 0
            );

            totalClicks += Number(
              p?.clicks || 0
            );
          }
        }
      }

      // =========================================
      // FINAL CTR
      // =========================================

      const finalCtr =
        totalImpressions > 0
          ? Number(
            (
              (
                totalClicks /
                totalImpressions
              ) * 100
            ).toFixed(2)
          )
          : 0;

      // =========================================
      // RESPONSE
      // =========================================

      return res.status(200).json({

        success: true,

        message:
          "Calculated website stats fetched successfully",

        // ✅ TOTAL OBJECTS
        totalStats:
          stats.length,

        // ✅ TOTAL PLACEMENTS
        totalPlacements,

        // ✅ OVERALL TOTALS
        totals: {

          impressions:
            totalImpressions,

          clicks:
            totalClicks,

          ctr:
            finalCtr,

          revenue:
            Number(
              totalRevenue.toFixed(
                6
              )
            ),
        },

        // ✅ ALL DATES DATA
        data: stats,
      });

    } catch (error) {

      console.log(
        "GET CALCULATED WEBSITE STATS ERROR =>",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch calculated website stats",

        error:
          error.message,
      });
    }
  };
const mongoose = require("mongoose");

const calculatedPlacementSchema =
  new mongoose.Schema(
    {
      type: String,

      placementId: {
        type: String,
        required: true,
      },

      adName: String,

      adUrl: String,

      isActive: {
        type: Boolean,
        default: true,
      },

      // =========================================
      // FINAL CALCULATED VALUES
      // =========================================

      impressions: {
        type: Number,
        default: 0,
      },

      clicks: {
        type: Number,
        default: 0,
      },

      ctr: {
        type: Number,
        default: 0,
      },

      cpm: {
        type: Number,
        default: 0,
      },

      revenue: {
        type: Number,
        default: 0,
      },

      // =========================================
      // RAW %
      // =========================================

      impressionPercent: {
        type: Number,
        default: 0,
      },

      cpmPercent: {
        type: Number,
        default: 0,
      },
    },
    {
      _id: true,
    }
  );

const calculatedWebsiteSchema =
  new mongoose.Schema(
    {
      userId: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,

        index: true,
      },

      website: {
        type: String,
        required: true,
        index: true,
      },

      // ✅ SMART CODE
      smartCode: {
        type: String,
        default: "",
        index: true,
      },

      status: {
        type: String,
        default: "pending",
      },

      websiteCategory: {
        type: String,
        default: "",
      },

      showAdultAds: {
        type: Boolean,
        default: false,
      },

      adFormat: [
        {
          type: String,
        },
      ],

      // =========================================
      // DATE
      // =========================================

      date: {
        type: String,
        required: true,
        index: true,
      },

      // =========================================
      // CALCULATED PLACEMENTS
      // =========================================

      placements: [
        calculatedPlacementSchema,
      ],
    },
    {
      timestamps: true,
    }
  );

// =============================================
// UNIQUE USER + WEBSITE + DATE
// =============================================

calculatedWebsiteSchema.index(
  {
    userId: 1,
    website: 1,
    date: 1,
  },
  {
    unique: true,
  }
);

module.exports =
  mongoose.model(
    "CalculatedWebsite",
    calculatedWebsiteSchema
  );
const mongoose = require("mongoose");

const RawWebsiteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },

    website: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    status: {
      type: String,
      default: "pending",
      index: true,
    },

    websiteCategory: {
      type: String,
      default: "",
      index: true,
    },

    showAdultAds: {
      type: Boolean,
      default: false,
    },

    // ✅ Selected Ad Formats
    adFormat: [
      {
        type: String,
        default: "",
      },
    ],

    // ✅ Placements
    placements: [
      {
        type: {
          type: String,
          default: "",
          index: true,
        },

        placementId: {
          type: String,
          default: "",
          index: true,
        },

        adName: {
          type: String,
          default: "",
        },

        isActive: {
          type: Boolean,
          default: true,
        },

        // 📊 Placement Wise Stats
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

        impressionPercent: {
          type: Number,
          default: 0,
        },

        cpmPercent: {
          type: Number,
          default: 0,
        },
      },
    ],

    date: {
      type: String,
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

// 🔥 Duplicate avoid
RawWebsiteSchema.index(
  {
    userId: 1,
    website: 1,
    date: 1,
  },
  { unique: true }
);

module.exports = mongoose.model("RawWebsite", RawWebsiteSchema);
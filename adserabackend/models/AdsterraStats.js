const mongoose = require("mongoose");

const adsterraStatsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true
    },

    domain: {
      type: String,
      required: true,
      index: true,
    },

    placement: {
      type: String,
      required: true,
      index: true,
    },

    country: {
      type: String,
      default: "all",
      index: true,
    },

    // ✅ DEVICE INFO
    device: {
      type: String, // mobile / desktop / tablet
      default: "desktop",
      index: true,
    },
    deviceModel: {
      type: String,
      default: "",
    },
    deviceVendor: {
      type: String,
      default: "",
    },

    // ✅ OS INFO
    osName: {
      type: String,
      default: "",
      index: true,
    },
    osVersion: {
      type: String,
      default: "",
    },

    // ✅ BROWSER INFO
    browserName: {
      type: String,
      default: "",
      index: true,
    },
    browserVersion: {
      type: String,
      default: "",
    },

    // 📊 STATS
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

    date: {
      type: String,
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

// 🔥 Unique combination (duplicate avoid)
adsterraStatsSchema.index(
  { domain: 1, placement: 1, country: 1, date: 1 },
  { unique: true }
);

module.exports = mongoose.model("AdsterraStats", adsterraStatsSchema);
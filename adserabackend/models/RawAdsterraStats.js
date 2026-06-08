const mongoose = require("mongoose");

const RawAdsterraStatsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true
    },

    domain: {
      type: String,
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

    impressionPercent: {
      type: Number,
      default: 0,
    },

    cpmPercent: {
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



module.exports = mongoose.model("RawAdsterraStats", RawAdsterraStatsSchema);
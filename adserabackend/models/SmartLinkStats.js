const mongoose = require("mongoose");

const smartLinkStatsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
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

    // 🌍 COUNTRY
    country: {
      type: String,
      default: "ALL",
      uppercase: true,
      index: true,
    },

    // 📱 DEVICE INFO
    device: {
      type: String,
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

    // 💻 OS INFO
    osName: {
      type: String,
      default: "",
      index: true,
    },

    osVersion: {
      type: String,
      default: "",
    },

    // 🌐 BROWSER INFO
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
      index: true,
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

    // 📅 DATE
    date: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ DUPLICATE PREVENTION
smartLinkStatsSchema.index(
  {
    userId: 1,
    placement: 1,
    country: 1,
    date: 1,
  },
  {
    unique: true,
  }
);

// ✅ FAST FILTER QUERIES
smartLinkStatsSchema.index({
  userId: 1,
  date: -1,
});

smartLinkStatsSchema.index({
  placement: 1,
  country: 1,
  date: -1,
});

module.exports = mongoose.model(
  "smartLinkStats",
  smartLinkStatsSchema
);
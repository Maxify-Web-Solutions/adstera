const mongoose = require("mongoose");

const calculatedAdsterraStatsSchema =
  new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
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

      // DEVICE INFO
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

      // OS INFO
      osName: {
        type: String,
        default: "",
        index: true,
      },

      osVersion: {
        type: String,
        default: "",
      },

      // BROWSER INFO
      browserName: {
        type: String,
        default: "",
        index: true,
      },

      browserVersion: {
        type: String,
        default: "",
      },

      // FINAL CALCULATED STATS
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

      // USED PERCENTAGES
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
    {
      timestamps: true,
    }
  );

// DUPLICATE AVOID
calculatedAdsterraStatsSchema.index(
  {
    domain: 1,
    placement: 1,
    country: 1,
    date: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "CalculatedAdsterraStats",
  calculatedAdsterraStatsSchema
);
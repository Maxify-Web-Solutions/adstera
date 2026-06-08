const mongoose = require("mongoose");

const demoReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      default: "ALL",
    },

    domain: String,

    placement: String,

    device: {
      type: String,
      default: "desktop",
    },

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
      default: 10,
    },

    cpmPercent: {
      type: Number,
      default: 40,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "DemoReport",
  demoReportSchema
);
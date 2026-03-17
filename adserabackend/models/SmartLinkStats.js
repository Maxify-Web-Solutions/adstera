const mongoose = require("mongoose");

const smartLinkStatsSchema = new mongoose.Schema(
  {
    linkId: {
      type: Number,
      required: true,
    },

    date: {
      type: String, // format: YYYY-MM-DD
      required: true,
    },

    impressions: {
      type: Number,
      default: 0,
    },

    clicks: {
      type: Number,
      default: 0,
    },

    revenue: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SmartLinkStats", smartLinkStatsSchema);
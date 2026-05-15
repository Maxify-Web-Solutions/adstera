// models/CalculatedSmartLinkStats.js

const mongoose = require("mongoose");

const calculatedStatsItemSchema =
  new mongoose.Schema(
    {
      placement: String,

      domain: String,

      country: {
        type: String,
        default: "ALL",
      },

      // DATE
      date: {
        type: String,
        required: true,
        index: true,
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
        default: 0,
      },

      cpmPercent: {
        type: Number,
        default: 0,
      },
    },
    {
      _id: false,
    }
  );

const CalculatedSmartLinkStatsSchema =
  new mongoose.Schema(
    {
      userId: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "users",

        required: true,

        index: true,
      },

      device: {
        type: String,

        default: "desktop",

        index: true,
      },

      osName: {
        type: String,
        default: "",
      },

      browserName: {
        type: String,
        default: "",
      },

      // MAIN DOC DATE
      date: {
        type: String,

        required: true,

        index: true,
      },

      stats: [
        calculatedStatsItemSchema,
      ],
    },
    {
      timestamps: true,
    }
  );

// UNIQUE
CalculatedSmartLinkStatsSchema.index(
  {
    userId: 1,
    device: 1,
    date: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "CalculatedSmartLinkStats",
  CalculatedSmartLinkStatsSchema
);
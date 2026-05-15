const mongoose = require("mongoose");

const statsItemSchema = new mongoose.Schema(
  {
    placement: String,

    domain: String,

    country: {
      type: String,
      default: "ALL",
    },

    // ✅ DATE INSIDE STATS
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
  },
  { _id: false }
);

const RawsmartLinkStatsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
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

    stats: [statsItemSchema],
  },
  {
    timestamps: true,
  }
);

// ✅ ONE DOC PER USER + DEVICE + DATE
// ✅ ONE DOC PER USER + DEVICE + DATE
RawsmartLinkStatsSchema.index(
  {
    userId: 1,
    device: 1,
    date: 1,
  },
  {
    unique: true,
  }
);

// ✅ FIX OVERWRITE MODEL ERROR
module.exports =
  mongoose.models.RawsmartLinkStats ||
  mongoose.model(
    "RawsmartLinkStats",
    RawsmartLinkStatsSchema
  );
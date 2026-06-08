const mongoose = require("mongoose");

// =====================================================
// STATS ITEM SCHEMA
// =====================================================

const statsItemSchema = new mongoose.Schema(
  {
    placement: {
      type: String,
      default: "",
      index: true,
    },

    domain: {
      type: String,
      default: "",
    },

    country: {
      type: String,
      default: "ALL",
      index: true,
    },

    // =================================================
    // DATE
    // =================================================

    date: {
      type: String,
      required: true,
      index: true,
    },

    // =================================================
    // STATS
    // =================================================

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

    // =================================================
    // USER PERCENT
    // =================================================

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

// =====================================================
// MAIN SCHEMA
// =====================================================

const RawsmartLinkStatsSchema =
  new mongoose.Schema(
    {
      userId: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "users",

        required: true,

        index: true,
      },

      // ===============================================
      // DEVICE
      // ===============================================

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

      // ===============================================
      // MAIN DOC DATE
      // ===============================================

      date: {
        type: String,

        required: true,

        index: true,
      },

      // ===============================================
      // STATS ARRAY
      // ===============================================

      stats: {
        type: [statsItemSchema],

        default: [],
      },
    },
    {
      timestamps: true,
    }
  );

// =====================================================
// UNIQUE INDEX
// ONE DOC PER USER + DEVICE + DATE
// =====================================================

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

// =====================================================
// OPTIONAL INDEXES
// =====================================================



// =====================================================
// EXPORT MODEL
// =====================================================

module.exports =
  mongoose.models.RawsmartLinkStats ||
  mongoose.model(
    "RawsmartLinkStats",
    RawsmartLinkStatsSchema
  );
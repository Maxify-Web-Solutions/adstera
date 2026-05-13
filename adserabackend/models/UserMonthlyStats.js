const mongoose = require("mongoose");

// ============================
// SNAPSHOT SCHEMA
// ============================

const snapshotSchema = new mongoose.Schema(
  {
    revenue: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    // snapshot save time
    time: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

// ============================
// DAILY DATA SCHEMA
// ============================

const dailyDataSchema = new mongoose.Schema(
  {
    // current day
    date: {
      type: String,
      required: true,
    },

    // every 30 min data
    snapshots: [snapshotSchema],
  },
  { _id: false }
);

// ============================
// MAIN MONTHLY SCHEMA
// ============================

const userMonthlyStatsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    mobile: {
      type: String,
      required: true,
    },

    // month wise document
    // example: 2026-05
    month: {
      type: String,
      required: true,
    },

    // full month data
    dailyData: [dailyDataSchema],
  },
  {
    timestamps: true,
  }
);

// ============================
// ONE USER = ONE MONTH DOC
// ============================

userMonthlyStatsSchema.index(
  { userId: 1, month: 1 },
  { unique: true }
);

const UserMonthlyStats = mongoose.model(
  "UserMonthlyStats",
  userMonthlyStatsSchema
);

module.exports = UserMonthlyStats;
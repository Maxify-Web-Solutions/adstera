const mongoose = require("mongoose");

const userschema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // =========================
    // 💰 USER EARNING
    // =========================

    revenue: {
      type: Number,
      default: 0,
    },

    referralAmount: {
      type: Number,
      default: 0,
    },

    // =========================
    // ✅ PERCENT HISTORY
    // TODAY CHANGE = TOMORROW APPLY
    // =========================

    percentHistory: [
      {
        date: {
          type: String,
          required: true,
        },

        impressionPercent: {
          type: Number,
          default: 20,
        },

        cpmPercent: {
          type: Number,
          default: 50,
        },
      },
    ],

    // =========================
    // ✅ REFERRAL SYSTEM
    // =========================

    referralCode: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      uppercase: true,
    },

    referredBy: {
      type: String,
      default: null,
      uppercase: true,
      trim: true,
    },

    // =========================
    // 🔥 LAST MAPS
    // =========================

    lastReferralMap: {
      type: Map,
      of: Number,
      default: {},
    },

    lastRevenueMap: {
      type: Map,
      of: Number,
      default: {},
    },

    // =========================

    lastWithdrawalDate: {
      type: String,
      default: null,
    },

    // =========================
    // 👤 ROLE
    // =========================

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
      required: true,
    },

    // =========================
    // 🔐 PASSWORD
    // =========================

    password: {
      type: String,
      required: true,
    },

    // =========================
    // ✅ USER STATUS
    // =========================

    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },

    // =========================
    // 🔥 OTP FIELDS
    // =========================

    reset_otp: {
      type: String,
      default: null,
    },

    reset_otp_expiry: {
      type: Date,
      default: null,
    },

    // =========================
    // 🖥 LAST LOGIN
    // =========================

    lastLogin: {
      date: Date,

      ip: String,

      device: String,

      os: String,

      browser: String,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model(
  "users",
  userschema
);

module.exports = User;
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

    revenue: {
      type: Number,
      default: 0,
    },

    referralAmount: {
      type: Number,
      default: 0,
    },

    percentHistory: {
      type: [
        {
          date: { type: String, required: true },
          impressionPercent: { type: Number, default: 10 },
          cpmPercent: { type: Number, default: 40 },
        },
      ],
      default: [],
    },

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

    // ✅ FIXED MAP
    lastReferralMap: {
      type: Map,
      of: new mongoose.Schema(
        {
          name: { type: String, default: "" },
          amount: { type: Number, default: 0 },
          revenue: { type: Number, default: 0 },
          percent: { type: Number, default: 0 },
          date: { type: String, default: () => new Date().toISOString().split("T")[0] },
        },
        { _id: false }
      ),
      default: () => new Map(),
    },

    // ✅ FIXED MAP (IMPORTANT)
    lastRevenueMap: {
      type: Map,
      of: Number,
      default: () => new Map(),
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    password: {
      type: String,
      required: true,
    },

    plainPassword: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },

    isDemo: {
      type: Boolean,
      default: false,
    },

    lastWithdrawalDate: {
      type: String,
      default: null,
    },

    lastLogin: {
      date: Date,
      ip: String,
      device: String,
      os: String,
      browser: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("users", userschema);
module.exports = User;
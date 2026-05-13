const mongoose = require("mongoose");

const userschema = new mongoose.Schema(
  {
    // =====================================
    // BASIC INFO
    // =====================================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    // =====================================
    // REVENUE SYSTEM
    // =====================================

    revenue: {
      type: Number,
      default: 0,
    },

    lastRevenueMap: {
      type: Map,
      of: Number,
      default: {},
    },

    // =====================================
    // ROLE
    // =====================================

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
      required: true,
    },

    // =====================================
    // USER STATUS
    // =====================================

    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },

    // =====================================
    // REFERRAL SYSTEM
    // =====================================

    referralCode: {
      type: String,
      sparse: true,
    },

    referredBy: {
      type: String,
      default: null,
    },

    // =====================================
    // LOGIN INFO
    // =====================================

    lastLogin: {
      date: {
        type: Date,
      },

      ip: {
        type: String,
      },

      device: {
        type: String,
      },

      os: {
        type: String,
      },

      browser: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

// =====================================
// INDEXES
// =====================================

userschema.index({
  email: 1,
});

userschema.index({
  mobile: 1,
});

userschema.index({
  referralCode: 1,
});

// =====================================
// MODEL
// =====================================

const User = mongoose.model(
  "users",
  userschema
);

module.exports = User;
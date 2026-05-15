const mongoose = require('mongoose');

const userschema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // ✅ Unique username
      trim: true,
      lowercase: true,

      // ❌ Space not allowed
      validate: {
        validator: function (v) {
          return !/\s/.test(v);
        },
        message: 'Username should not contain spaces',
      },
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    mobile: {
      type: String,
      required: true,
      unique: true,
    },

    revenue: {
      type: Number,
      default: 0,
    },

    lastRevenueMap: {
      type: Map,
      of: Number,
      default: {},
    },

    lastWithdrawalDate: {
      type: String,
      default: null,
    },

    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    // ✅ USER STATUS
    status: {
      type: String,
      enum: ['active', 'blocked'],
      default: 'active',
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

const User = mongoose.model('users', userschema);

module.exports = User;
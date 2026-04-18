const mongoose = require('mongoose');

const userschema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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
    // 🔥 REFERRAL SYSTEM
    // =========================

    // Unique referral code for each user

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
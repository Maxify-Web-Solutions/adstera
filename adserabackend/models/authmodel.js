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
    referralCode: {
      type: String,
      unique: true,
    },

    // Who referred this user
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      default: null,
    },

    // List of users this user referred
    referrals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
    ],

    // Optional: earnings from referrals
    referralEarnings: {
      type: Number,
      default: 0,
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

// 🔥 Auto-generate referral code before saving
userschema.pre('save', function (next) {
  if (!this.referralCode) {
    this.referralCode = this._id.toString().slice(-6);
  }
  next();
});

const User = mongoose.model('users', userschema);

module.exports = User;
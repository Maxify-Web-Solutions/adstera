const mongoose = require("mongoose");

const tempUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,

      // ❌ Space not allowed
      validate: {
        validator: function (v) {
          return !/\s/.test(v);
        },
        message:
          "Username should not contain spaces",
      },
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    mobile: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    // =====================================
    // ✅ REFERRAL SYSTEM
    // =====================================

    referredBy: {
      type: String,
      default: null,
    },

    // =====================================

    otp: {
      type: String,
      required: true,
    },

    otpExpires: {
      type: Date,
      required: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const TempUser = mongoose.model(
  "tempUsers",
  tempUserSchema
);

module.exports = TempUser;
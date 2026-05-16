// models/PlatformFee.js

const mongoose = require("mongoose");

const platformFeeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },

    withdrawalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Withdrawal",
      required: true,
    },

    originalAmount: {
      type: Number,
      required: true,
      default: 0,
    },

    feePercent: {
      type: Number,
      default: 3,
    },

    feeAmount: {
      type: Number,
      required: true,
      default: 0,
    },

    finalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "PlatformFee",
  platformFeeSchema
);
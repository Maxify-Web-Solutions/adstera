const mongoose = require("mongoose");

const withdrawalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    // User requested amount
    amount: {
      type: Number,
      required: true,
    },

    // ================= PLATFORM FEE =================

    feePercent: {
      type: Number,
      default: 3,
    },

    platformFee: {
      type: Number,
      default: 0,
    },

    // Final amount user receives
    finalAmount: {
      type: Number,
      default: 0,
    },

    // ✅ Payment Type
    paymentMethod: {
      type: String,
      enum: ["bank", "crypto"],
      required: true,
    },

    // ================= BANK DETAILS =================

    accountHolderName: {
      type: String,
      required: function () {
        return this.paymentMethod === "bank";
      },
    },

    bankName: {
      type: String,
      required: function () {
        return this.paymentMethod === "bank";
      },
    },

    accountNumber: {
      type: String,
      required: function () {
        return this.paymentMethod === "bank";
      },
    },

    ifscCode: {
      type: String,
      required: function () {
        return this.paymentMethod === "bank";
      },
    },

    // ================= CRYPTO DETAILS =================

    cryptoType: {
      type: String,
      required: function () {
        return this.paymentMethod === "crypto";
      },
    },

    walletAddress: {
      type: String,
      required: function () {
        return this.paymentMethod === "crypto";
      },
    },

    network: {
      type: String,
      required: function () {
        return this.paymentMethod === "crypto";
      },
    },

    // ================= COMMON =================

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    adminRemark: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "withdrawals",
  withdrawalSchema
);
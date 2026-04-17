const mongoose = require("mongoose");

const withdrawalOtpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  otp: String,
  expiresAt: Date,
}, { timestamps: true });

module.exports = mongoose.model("WithdrawalOtp", withdrawalOtpSchema);
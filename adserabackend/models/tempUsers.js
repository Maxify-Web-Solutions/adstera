const mongoose = require('mongoose');

const tempUserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    mobile: String,
    password: String,

    otp: String,          // OTP verification
    otpExpires: Date,     // expiry time

    isVerified: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

const TempUser = mongoose.model('tempUsers', tempUserSchema);

module.exports = TempUser;
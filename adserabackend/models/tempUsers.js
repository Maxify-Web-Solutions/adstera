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
        message: "Username should not contain spaces",
      },
    },

    email: String,

    mobile: String,

    password: String,

    otp: String,

    otpExpires: Date,

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const TempUser = mongoose.model("tempUsers", tempUserSchema);

module.exports = TempUser;
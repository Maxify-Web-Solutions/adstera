const mongoose = require("mongoose");

const smartLinkSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },

  linkId: {
    type: Number,
    unique: true
  },

  name: String,

  targetUrl: String,

  smartCode: {
    type: String,
    unique: true
  },

  key: {                 // ✅ ADD THIS
    type: String
  },

  redirectUrl: {         // ✅ ADD THIS
    type: String
  },

  finalUrl: String,

  clicks: {
    type: Number,
    default: 0
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  }

}, { timestamps: true });

module.exports = mongoose.model("SmartLink", smartLinkSchema);
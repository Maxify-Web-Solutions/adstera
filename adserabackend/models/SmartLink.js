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

  type: {
    type: String,
    enum: ["adult", "maisteram"],
    required: true
  },

  targetUrl: String,

  smartCode: {
    type: String,
    unique: true
  },

  key: {
    type: String
  },

  redirectUrl: {
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
  },

  // ✅ approve time
  approvedAt: {
    type: Date,
    default: null
  }

}, { timestamps: true });

module.exports = mongoose.model("SmartLink", smartLinkSchema);
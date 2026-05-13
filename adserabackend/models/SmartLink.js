const mongoose = require("mongoose");

const smartLinkSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },

  linkId: {
    type: Number
  },

  name: String,

  type: {
    type: String,
    enum: ["adult", "maisteram"],
    required: true
  },

  targetUrl: String,

  placementId: {
    type: String
  },

  smartCode: {
    type: String
  },

  key: {
    type: String
  },

  redirectUrl: {
    type: String
  },

  approvedAt: Date,

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
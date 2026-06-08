// models/SmartLink.js

const mongoose = require("mongoose");

const smartLinkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    linkId: {
      type: Number,
    },

    name: {
      type: String,
    },

    type: {
      type: String,
      enum: ["adult", "maisteram"],
      required: true,
    },

    targetUrl: {
      type: String,
    },

    placementId: {
      type: String,
    },

    smartCode: {
      type: String,
    },

    // ✅ NORMAL KEY
    key: {
      type: String,
    },

    // ✅ API KEY
    api_key: {
      type: String,
      index: true,
    },

    redirectUrl: {
      type: String,
    },

    approvedAt: {
      type: Date,
    },

    finalUrl: {
      type: String,
    },

    clicks: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "rejected",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "SmartLink",
  smartLinkSchema
);
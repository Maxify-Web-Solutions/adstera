const mongoose = require("mongoose");

const userStatsSummarySchema =
  new mongoose.Schema(
    {
      userId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
      },

      totalImpressions: {
        type: Number,
        default: 0,
      },

      totalClicks: {
        type: Number,
        default: 0,
      },

      totalRevenue: {
        type: Number,
        default: 0,
      },

      ctr: {
        type: Number,
        default: 0,
      },

      cpm: {
        type: Number,
        default: 0,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "UserStatsSummary",
    userStatsSummarySchema
  );
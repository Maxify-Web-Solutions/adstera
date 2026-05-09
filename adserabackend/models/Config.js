// models/Config.js

const mongoose = require("mongoose");

const configSchema =
  new mongoose.Schema(
    {
      adsterraApiKey: {
        type: String,
        default: "",
      },

      // CPM %
      cpmPercent: {
        type: Number,
        default: 100,
      },

      // Revenue %
      revenuePercent: {
        type: Number,
        default: 100,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Config",
    configSchema
  );
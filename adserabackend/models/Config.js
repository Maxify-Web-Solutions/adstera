// models/Config.js

const mongoose = require("mongoose");

const configSchema = new mongoose.Schema(
  {
    adsterraApiKey: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Config", configSchema);
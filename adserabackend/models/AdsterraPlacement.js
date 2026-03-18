const mongoose = require("mongoose");

const placementSchema = new mongoose.Schema(
  {
    placementId: {
      type: Number,
      unique: true,
    },
    domainId: Number,
    title: String,
    alias: String,
    directUrl: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdsterraPlacement", placementSchema);
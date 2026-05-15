const mongoose = require("mongoose");

const statsConfigSchema =
  new mongoose.Schema(
    {
      // IMPRESSION %
      impressionPercent: {
        type: Number,
        default: 10,
      },

      // CPM %
      cpmPercent: {
        type: Number,
        default: 40,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "StatsConfig",
  statsConfigSchema
);
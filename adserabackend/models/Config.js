// models/Config.js

const mongoose =
  require("mongoose");

const configSchema =
  new mongoose.Schema(
    {
      adsterraApiKeys: [
        {
          apiKey: {
            type: String,
            required: true,
          },

          start: {
            type: Number,
            required: true,
          },

          end: {
            type: Number,
            required: true,
          },
        },
      ],
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
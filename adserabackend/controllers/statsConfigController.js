// controllers/statsConfigController.js

const StatsConfig = require("../models/StatsConfig");

// ======================================================
// CREATE OR UPDATE CONFIG
// ======================================================

exports.saveStatsConfig = async (
  req,
  res
) => {
  try {
    const {
      impressionPercent,
      cpmPercent,
    } = req.body;

    // ==================================================
    // VALIDATION
    // ==================================================

    if (
      impressionPercent === undefined ||
      cpmPercent === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "impressionPercent and cpmPercent are required",
      });
    }

    // ==================================================
    // FIND EXISTING
    // ==================================================

    let config =
      await StatsConfig.findOne();

    // ==================================================
    // CREATE
    // ==================================================

    if (!config) {
      config =
        await StatsConfig.create({
          impressionPercent:
            Number(impressionPercent),

          cpmPercent:
            Number(cpmPercent),
        });
    }

    // ==================================================
    // UPDATE
    // ==================================================

    else {
      config.impressionPercent =
        Number(impressionPercent);

      config.cpmPercent = Number(
        cpmPercent
      );

      await config.save();
    }

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(200).json({
      success: true,
      message:
        "Stats config saved successfully",
      data: config,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "Failed to save stats config",
      error: error.message,
    });
  }
};

// ======================================================
// GET CONFIG
// ======================================================

exports.getStatsConfig = async (
  req,
  res
) => {
  try {
    let config =
      await StatsConfig.findOne();

    // ==================================================
    // DEFAULT CREATE
    // ==================================================

    if (!config) {
      config =
        await StatsConfig.create({
          impressionPercent: 10,
          cpmPercent: 40,
        });
    }

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(200).json({
      success: true,
      data: config,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch stats config",
      error: error.message,
    });
  }
};
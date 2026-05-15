// routes/statsConfigRoutes.js

const express = require("express");

const router = express.Router();

const {
  saveStatsConfig,
  getStatsConfig,
} = require(
  "../controllers/statsConfigController"
);

// ======================================================
// ROUTES
// ======================================================

// GET CONFIG
router.get(
  "/get",
  getStatsConfig
);

// SAVE CONFIG
router.post(
  "/save",
  saveStatsConfig
);

module.exports = router;
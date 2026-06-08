// routes/calculatedWebsiteRoutes.js

const express = require("express");

const router = express.Router();

const {
  getCalculatedWebsiteStats,
} = require(
  "../controllers/calculatedWebsiteController"
);

const authMiddleware = require(
  "../middleware/authMiddleware"
);

// =====================================================
// GET CALCULATED WEBSITE STATS
// =====================================================

router.get(
  "/calculated-website",
  authMiddleware,
  getCalculatedWebsiteStats
);


module.exports = router;
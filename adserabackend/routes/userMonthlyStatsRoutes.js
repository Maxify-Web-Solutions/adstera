const express = require("express");

const router = express.Router();

const {
  getAllMonthlyStats,
  getSingleUserMonthlyStats,
} = require("../controllers/userMonthlyStatsController");

// =====================================================
// GET ALL USERS MONTHLY STATS
// =====================================================

router.get(
  "/all",
  getAllMonthlyStats
);

// =====================================================
// GET SINGLE USER STATS
// =====================================================

router.get(
  "/:userId",
  getSingleUserMonthlyStats
);

module.exports = router;
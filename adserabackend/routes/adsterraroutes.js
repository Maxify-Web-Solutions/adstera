const express = require("express");
const { fetchAndStoreAdsterraStats, getAdsterraStatsFromDB } = require("../controllers/adsterracontroller");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();


// 📡 Fetch + Save Data
router.get("/fetch",authMiddleware, fetchAndStoreAdsterraStats);

router.get("/stats",authMiddleware, getAdsterraStatsFromDB);

module.exports = router;
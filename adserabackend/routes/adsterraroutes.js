const express = require("express");
const { fetchAndStoreAdsterraStats, getAdsterraStatsFromDB } = require("../controllers/adsterracontroller");
const router = express.Router();


// 📡 Fetch + Save Data
router.get("/fetch", fetchAndStoreAdsterraStats);

router.get("/stats", getAdsterraStatsFromDB);

module.exports = router;
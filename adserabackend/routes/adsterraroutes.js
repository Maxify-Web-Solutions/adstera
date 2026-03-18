const express = require("express");
const { fetchAndStoreAdsterraStats } = require("../controllers/adsterracontroller");
const router = express.Router();


// 📡 Fetch + Save Data
router.get("/fetch", fetchAndStoreAdsterraStats);

module.exports = router;
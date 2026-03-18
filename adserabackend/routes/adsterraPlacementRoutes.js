const express = require("express");
const router = express.Router();

const {
  fetchAndStorePlacements,
} = require("../controllers/adsterraPlacementController");

router.get("/adsterra/placements", fetchAndStorePlacements);

module.exports = router;
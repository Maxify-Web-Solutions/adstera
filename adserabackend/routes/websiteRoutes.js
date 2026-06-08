// routes/websiteRoutes.js

const express = require("express");

const {
  createWebsite,
  getAllWebsites,
  getSingleWebsite,
  updateWebsite,
  deleteWebsite,
} = require("../controllers/websiteController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create",authMiddleware, createWebsite);

router.get("/all",authMiddleware, getAllWebsites);

router.get("/:id",authMiddleware, getSingleWebsite);

router.put("/update/:id", updateWebsite);

router.delete("/delete/:id", deleteWebsite);

module.exports = router;
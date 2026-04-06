// routes/withdrawalRoutes.js

const express = require("express");
const router = express.Router();

const {
  createWithdrawal,
  getMyWithdrawals,
  getAllWithdrawals,
  updateWithdrawalStatus,
} = require("../controllers/withdrawalController");

// 🔐 Middleware (example)
const authMiddleware = require("../middleware/authMiddleware");

// 👤 USER ROUTES
router.post("/create", authMiddleware, createWithdrawal);
router.get("/my", authMiddleware, getMyWithdrawals);

// 👑 ADMIN ROUTES
// router.get("/all", authMiddleware, isAdmin, getAllWithdrawals);
// router.put("/update", authMiddleware, isAdmin, updateWithdrawalStatus);

module.exports = router;
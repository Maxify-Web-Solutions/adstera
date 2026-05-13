const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getProfile,
  logout,
  verifyOTP,
  forgotPassword,
  verifyOTPAndReset,
} = require("../controllers/auth");

const authMiddleware = require("../middleware/authMiddleware");


// AUTH ROUTES
router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);


// FORGOT PASSWORD ROUTES
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", verifyOTPAndReset);


// USER ROUTES
router.get("/profile", authMiddleware, getProfile);
router.post("/logout", logout);


module.exports = router;
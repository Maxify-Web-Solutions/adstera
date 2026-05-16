const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/authmodel");
const UAParser = require("ua-parser-js");
const TempUser = require("../models/tempUsers");

const {
  sendAccountVerificationOTP,
  sendResetPasswordOTP,
} = require("../utils/mailer.js");


// ======================================================
// GENERATE TOKEN
// ======================================================

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};


// ======================================================
// REGISTER
// ======================================================

const register = async (req, res) => {
  try {
    let { name, email, mobile, password } = req.body;

    // VALIDATION
    if (!name || !email || !mobile || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // NORMALIZE
    name = name.trim();
    email = email.toLowerCase().trim();
    mobile = mobile.trim();

    // NAME SPACE CHECK
    if (/\s/.test(name)) {
      return res.status(400).json({
        success: false,
        message: "Space is not allowed in name",
      });
    }

    // PASSWORD CHECK
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // CHECK EXISTING USER
    const userExist = await User.findOne({
      $or: [{ email }, { mobile }],
    });

    if (userExist) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // GENERATE OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // SAVE TEMP USER
    await TempUser.findOneAndUpdate(
      { email },
      {
        name,
        email,
        mobile,
        password,
        otp,
        otpExpires: Date.now() + 5 * 60 * 1000,
        isVerified: false,
      },
      {
        upsert: true,
        new: true,
      }
    );

    // SEND OTP
    const isSent = await sendAccountVerificationOTP(email, otp);

    if (!isSent) {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// VERIFY OTP
// ======================================================

const verifyOTP = async (req, res) => {
  try {
    let { email, otp } = req.body;

    // VALIDATION
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email & OTP required",
      });
    }

    // NORMALIZE
    email = email.toLowerCase().trim();

    // FIND TEMP USER
    const tempUser = await TempUser.findOne({ email });

    if (!tempUser) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // OTP MATCH
    if (tempUser.otp !== otp.toString()) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // OTP EXPIRE
    if (Date.now() > tempUser.otpExpires) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // CHECK EXISTING USER
    const existingUser = await User.findOne({
      $or: [
        { email: tempUser.email.toLowerCase().trim() },
        { mobile: tempUser.mobile },
        { name: tempUser.name.trim() }, // NAME CHECK
      ],
    });

    if (existingUser) {
      let errorMessage = "User already exists";

      if (
        existingUser.email === tempUser.email.toLowerCase().trim()
      ) {
        errorMessage = "Email already registered";
      } else if (
        existingUser.mobile === tempUser.mobile
      ) {
        errorMessage = "Mobile number already registered";
      } else if (
        existingUser.name.trim().toLowerCase() ===
        tempUser.name.trim().toLowerCase()
      ) {
        errorMessage = "Username already taken";
      }

      return res.status(400).json({
        success: false,
        message: errorMessage,
      });
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(
      tempUser.password,
      10
    );

    // CREATE USER
    const user = await User.create({
      name: tempUser.name.trim(),
      email: tempUser.email.toLowerCase().trim(),
      mobile: tempUser.mobile,
      password: hashedPassword,
      role: "user",
    });

    // DELETE TEMP USER
    await TempUser.deleteOne({ email });

    // TOKEN
    const token = generateToken(user._id);

    // COOKIE
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // REMOVE PASSWORD
    const userObj = user.toObject();
    delete userObj.password;

    return res.status(201).json({
      success: true,
      message: "OTP verified successfully",
      token,
      user: userObj,
    });

  } catch (error) {

    // DUPLICATE KEY ERROR HANDLE
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];

      let message = "Duplicate field error";

      if (field === "email") {
        message = "Email already registered";
      } else if (field === "mobile") {
        message = "Mobile number already registered";
      } else if (field === "name") {
        message = "Username already taken";
      }

      return res.status(400).json({
        success: false,
        message,
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// LOGIN
// ======================================================

const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    // ================= VALIDATION =================
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // ================= NORMALIZE =================
    email = email.toLowerCase().trim();

    // ================= FAST USER QUERY =================
    const user = await User.findOne({ email })
      .select("+password")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ================= FAST PASSWORD CHECK =================
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // ================= ROLE CHECK =================
    if (user.role !== "user") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // ================= TOKEN =================
    const token = generateToken(user._id);

    // ================= COOKIE =================
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // ================= REMOVE PASSWORD =================
    delete user.password;

    // ================= RESPONSE =================
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user,
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ======================================================
// GET PROFILE
// ======================================================

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// LOGOUT
// ======================================================

const logout = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// FORGOT PASSWORD
// ======================================================

const forgotPassword = async (req, res) => {
  try {
    let { email } = req.body;

    // VALIDATION
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email required",
      });
    }

    // NORMALIZE
    email = email.toLowerCase().trim();

    // FIND USER
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email not found",
      });
    }

    // GENERATE OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // SAVE OTP
    user.reset_otp = otp;
    user.reset_otp_expiry = Date.now() + 5 * 60 * 1000;

    await user.save();

    // SEND MAIL
    const isSent = await sendResetPasswordOTP(email, otp);

    if (!isSent) {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// VERIFY OTP & RESET PASSWORD
// ======================================================

const verifyOTPAndReset = async (req, res) => {
  try {
    let { email, otp, newPassword } = req.body;

    // VALIDATION
    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // NORMALIZE
    email = email.toLowerCase().trim();

    // FIND USER
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // CHECK OTP
    if (user.reset_otp !== otp.toString()) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // OTP EXPIRED
    if (Date.now() > user.reset_otp_expiry) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // PASSWORD LENGTH
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // UPDATE PASSWORD
    user.password = hashedPassword;

    // CLEAR OTP
    user.reset_otp = null;
    user.reset_otp_expiry = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  register,
  verifyOTP,
  login,
  getProfile,
  logout,
  forgotPassword,
  verifyOTPAndReset,
};
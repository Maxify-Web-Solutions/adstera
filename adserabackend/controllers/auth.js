const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/authmodel");
const UAParser = require("ua-parser-js");
const TempUser = require("../models/tempUsers");

const { sendAccountVerificationOTP } = require("../utils/mailer.js");



// generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};


// REGISTER

const  register = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ check main DB
    const userexist = await User.findOne({
      $or: [{ email }, { mobile }],
    });

    if (userexist) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ save temp user
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
      { upsert: true, new: true }
    );

    // ✅ SEND EMAIL (🔥 MAIN PART)
    const isSent = await sendAccountVerificationOTP(email, otp);

    if (!isSent) {
      return res.status(500).json({
        message: "Failed to send OTP email",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent to email successfully",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email & OTP required" });
    }

    // ✅ Find temp user
    const tempUser = await TempUser.findOne({ email });

    if (!tempUser) {
      return res.status(400).json({ message: "User not found" });
    }

    // ✅ OTP match
    if (tempUser.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // ✅ Expiry check
    if (Date.now() > tempUser.otpExpires) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(tempUser.password, 10);

    // ✅ Create real user
    const user = await User.create({
      name: tempUser.name,
      email: tempUser.email,
      mobile: tempUser.mobile,
      password: hashedPassword,
    });

    // ✅ Mark verified (optional)
    tempUser.isVerified = true;
    await tempUser.save();

    // ✅ Delete temp user (recommended)
    await TempUser.deleteOne({ email });

    // ✅ Generate token
    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // production me true
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "OTP verified & user created",
      user,
      token,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// LOGIN

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    if (user.role !== "user") {
      return res.status(403).json({
        message: "Access denied. Only user can login."
      });
    }

    // ✅ USER-AGENT PARSE
    const ua = req.headers["user-agent"];
    const parser = new UAParser(ua);
    const device = parser.getDevice();
    const os = parser.getOS();
    const browser = parser.getBrowser();

    // ✅ UPDATE LAST LOGIN
    user.lastLogin = {
      date: new Date(),
      ip: req.ip || req.headers["x-forwarded-for"],
      device: device.model || "Desktop",
      os: os.name + " " + os.version,
      browser: browser.name + " " + browser.version
    };

    await user.save();

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const { password: pass, ...userData } = user._doc;

    res.json({
      success: true,
      message: "Login successful",
      user: userData
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// GET PROFILE
const getProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user.id).select("-password");

    res.json({
      success: true,
      user,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// LOGOUT
const logout = async (req, res) => {
  try {

    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    res.json({
      success: true,
      message: "Logout successful",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  register,
  login,
  getProfile,
  logout,
  verifyOTP,

};
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

const register = async (req, res) => {
  try {
    let { name, email, mobile, password } = req.body;

    // ✅ VALIDATION
    if (!name || !email || !mobile || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ✅ NORMALIZE DATA
    name = name.trim();
    email = email.toLowerCase().trim();
    mobile = mobile.trim();

    // ✅ PASSWORD LENGTH CHECK
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // ✅ CHECK MAIN DB
    const userExist = await User.findOne({
      $or: [{ email }, { mobile }],
    });

    if (userExist) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // ✅ GENERATE OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ SAVE TEMP USER
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

    // ✅ SEND OTP EMAIL
    const isSent = await sendAccountVerificationOTP(email, otp);

    if (!isSent) {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email",
      });
    }

    // ✅ RESPONSE
    return res.status(200).json({
      success: true,
      message: "OTP sent to email successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




const verifyOTP = async (req, res) => {
  try {
    let { email, otp } = req.body;

    // ✅ VALIDATION
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email & OTP required",
      });
    }

    // ✅ NORMALIZE EMAIL
    email = email.toLowerCase().trim();

    // ✅ FIND TEMP USER
    const tempUser = await TempUser.findOne({ email });

    if (!tempUser) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ OTP MATCH
    if (tempUser.otp !== otp.toString()) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // ✅ OTP EXPIRY
    if (Date.now() > tempUser.otpExpires) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // ✅ CHECK EXISTING USER
    const existingUser = await User.findOne({
      $or: [
        { email: tempUser.email.toLowerCase().trim() },
        { mobile: tempUser.mobile }
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // ✅ HASH PASSWORD
    const hashedPassword = await bcrypt.hash(tempUser.password, 10);

    // ✅ CREATE REAL USER
    const user = await User.create({
      name: tempUser.name,
      email: tempUser.email.toLowerCase().trim(),
      mobile: tempUser.mobile,
      password: hashedPassword,
      role: "user"
    });

    // ✅ MARK VERIFIED
    tempUser.isVerified = true;
    await tempUser.save();

    // ✅ DELETE TEMP USER
    await TempUser.deleteOne({ email });

    // ✅ GENERATE TOKEN
    const token = generateToken(user._id);

    // ✅ COOKIE SET
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // production me true
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // ✅ REMOVE PASSWORD
    const userObj = user.toObject();
    delete userObj.password;

    // ✅ RESPONSE
    return res.status(201).json({
      success: true,
      message: "OTP verified & user created",
      user: userObj,
      token,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// LOGIN
const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    // ✅ VALIDATION
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // ✅ NORMALIZE EMAIL
    email = email.toLowerCase().trim();

    // ✅ FIND USER WITH PASSWORD
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // ✅ CHECK PASSWORD
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // ✅ ROLE CHECK
    if (user.role !== "user") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only user can login."
      });
    }

    // ✅ USER AGENT PARSE
    const ua = req.headers["user-agent"];

    const parser = new UAParser(ua);

    const device = parser.getDevice();
    const os = parser.getOS();
    const browser = parser.getBrowser();

    // ✅ LAST LOGIN UPDATE
    user.lastLogin = {
      date: new Date(),
      ip: req.ip || req.headers["x-forwarded-for"] || "Unknown",
      device: device.model || "Desktop",
      os: `${os.name || ""} ${os.version || ""}`,
      browser: `${browser.name || ""} ${browser.version || ""}`
    };

    await user.save();

    // ✅ TOKEN GENERATE
    const token = generateToken(user._id);

    // ✅ COOKIE SET
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // production me true karna
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // ✅ REMOVE PASSWORD
    const userObj = user.toObject();
    delete userObj.password;

    // ✅ RESPONSE
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: userObj
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
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
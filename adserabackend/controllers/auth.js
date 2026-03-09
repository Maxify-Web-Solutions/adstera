const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/authmodel");

// generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};


// REGISTER
const register = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userexist = await User.findOne({ email });

    if (userexist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashpassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      mobile,
      password: hashpassword,
    });

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const ismatch = await bcrypt.compare(password, user.password);

    if (!ismatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Login successful",
      user,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
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
};
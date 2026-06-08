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

const generateToken = (id, name, email) => {
  return jwt.sign({ id, name, email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};


// ======================================================
// REGISTER
// ======================================================

const register = async (req, res) => {
  try {
    let {
      name,
      email,
      mobile,
      password,
      referralCode,
    } = req.body;

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

    if (referralCode) {
      referralCode = referralCode.trim().toUpperCase();
    }

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
        message:
          "Password must be at least 6 characters",
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

    // =====================================
    // ✅ CHECK REFERRAL CODE
    // =====================================

    let referredBy = null;

    if (referralCode) {
      const refUser = await User.findOne({
        referralCode,
      });

      if (!refUser) {
        return res.status(400).json({
          success: false,
          message: "Invalid referral code",
        });
      }

      referredBy = refUser.referralCode;
    }

    // =====================================
    // 🔐 HASH PASSWORD
    // =====================================

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // GENERATE OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // SAVE TEMP USER
    await TempUser.findOneAndUpdate(
      { email },
      {
        name,
        email,
        mobile,

        // ✅ HASH PASSWORD
        password: hashedPassword,

        // ✅ PLAIN PASSWORD
        plainPassword: password,

        // ✅ REFERRAL DATA
        referredBy,

        otp,
        otpExpires: Date.now() + 5 * 60 * 1000,
        isVerified: false,
      },
      {
        upsert: true,
        returnDocument: "after",
      }
    );

    // SEND OTP
    const isSent =
      await sendAccountVerificationOTP(
        email,
        otp
      );

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
    const tempUser = await TempUser.findOne({
      email,
    });

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
        {
          email:
            tempUser.email
              .toLowerCase()
              .trim(),
        },
        { mobile: tempUser.mobile },
        {
          name:
            tempUser.name
              .trim()
              .toLowerCase(),
        },
      ],
    });

    if (existingUser) {
      let errorMessage =
        "User already exists";

      if (
        existingUser.email ===
        tempUser.email
          .toLowerCase()
          .trim()
      ) {
        errorMessage =
          "Email already registered";
      } else if (
        existingUser.mobile ===
        tempUser.mobile
      ) {
        errorMessage =
          "Mobile number already registered";
      } else if (
        existingUser.name
          .trim()
          .toLowerCase() ===
        tempUser.name
          .trim()
          .toLowerCase()
      ) {
        errorMessage =
          "Username already taken";
      }

      return res.status(400).json({
        success: false,
        message: errorMessage,
      });
    }

    // =====================================
    // ✅ GENERATE UNIQUE REFERRAL CODE
    // =====================================

    let referralCode;
    let isCodeExists = true;

    while (isCodeExists) {
      referralCode =
        tempUser.name
          .replace(/\s+/g, "")
          .toUpperCase()
          .slice(0, 4) +
        Math.floor(
          1000 + Math.random() * 9000
        );

      const codeExists =
        await User.findOne({
          referralCode,
        });

      if (!codeExists) {
        isCodeExists = false;
      }
    }

    // =====================================
    // ✅ CREATE USER
    // =====================================

    const user = await User.create({
      name: tempUser.name.trim(),
      email: tempUser.email
        .toLowerCase()
        .trim(),
      mobile: tempUser.mobile,

      // ✅ HASH PASSWORD
      password: tempUser.password,

      // ✅ PLAIN PASSWORD
      plainPassword:
        tempUser.plainPassword,

      role: "user",

      // ✅ REFERRAL SYSTEM
      referralCode,
      referredBy:
        tempUser.referredBy || null,
    });

    // DELETE TEMP USER
    await TempUser.deleteOne({ email });

    // TOKEN
    const token = generateToken(
      user._id
    );

    // COOKIE
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge:
        7 * 24 * 60 * 60 * 1000,
    });

    // REMOVE PASSWORD
    const userObj = user.toObject();

    delete userObj.password;

    return res.status(201).json({
      success: true,
      message:
        "OTP verified successfully",
      token,
      user: userObj,
    });

  } catch (error) {

    // DUPLICATE KEY ERROR HANDLE
    if (error.code === 11000) {
      const field = Object.keys(
        error.keyPattern
      )[0];

      let message =
        "Duplicate field error";

      if (field === "email") {
        message =
          "Email already registered";
      } else if (field === "mobile") {
        message =
          "Mobile number already registered";
      } else if (field === "name") {
        message =
          "Username already taken";
      } else if (
        field === "referralCode"
      ) {
        message =
          "Referral code conflict, try again";
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

    // ================= USER QUERY =================
    const user = await User.findOne({ email })
      .select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ================= PASSWORD CHECK =================
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // ================= DEMO EXPIRY CHECK =================
    if (
      user.isDemo &&
      user.demoEndDate &&
      new Date() > new Date(user.demoEndDate)
    ) {
      user.isDemo = false;
      user.demoStartDate = null;
      user.demoEndDate = null;

      await user.save();
    }

    // ================= ROLE CHECK =================
    if (user.role !== "user") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // ================= TOKEN =================
    const token = generateToken(user._id, user.name, user.email);

    // ================= COOKIE =================
    res.cookie("token", token, {
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        "production",
      sameSite: "strict",
      maxAge:
        7 * 24 * 60 * 60 * 1000,
    });

    // ================= RESPONSE USER =================
    const userObj = user.toObject();

    delete userObj.password;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,

      user: {
        ...userObj,

        isDemo:
          userObj.isDemo || false,

        demoStartDate:
          userObj.demoStartDate ||
          null,

        demoEndDate:
          userObj.demoEndDate ||
          null,
      },
    });

  } catch (error) {
    console.error(
      "LOGIN ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Internal server error",
    });
  }
};


// ======================================================
// GET PROFILE
// ======================================================

// const getProfile = async (req, res) => {
//   try {

//     // =========================
//     // GET USER
//     // =========================

//     const user = await User.findById(
//       req.user.id
//     )
//       .select(
//         "-password -lastRevenueMap -lastLogin -reset_otp -reset_otp_expiry -createdAt -updatedAt -status -role"
//       )
//       .lean();

//     // =========================
//     // USER NOT FOUND
//     // =========================

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     // =========================
//     // TOTAL JOIN COUNT
//     // =========================

//     const referralCode = (user.referralCode || "").trim();

//     console.log("Referral Code:", referralCode);

//     const totalJoinedUsers = referralCode
//       ? await User.countDocuments({
//         referredBy: {
//           $regex: new RegExp(`^${referralCode}$`, "i"),
//         },
//       })
//       : 0;
      

//     // =========================
//     // REFERRAL HISTORY
//     // =========================

//     let referralHistory = [];

//     // =========================
//     // MAP EXISTS
//     // =========================

//     if (
//       user.lastReferralMap &&
//       typeof user.lastReferralMap ===
//       "object"
//     ) {

//       referralHistory =
//         Object.values(
//           user.lastReferralMap
//         ).map((item) => ({
//           name:
//             item?.name ||
//             "Unknown",

//           amount:
//             Number(
//               item?.amount || 0
//             ),
//           revenue:
//             Number(
//               item?.revenue || 0
//             ),

//           date:
//             item?.date || null,
//         }));
//     }

//     // =========================
//     // SORT BY AMOUNT
//     // =========================

//     referralHistory.sort(
//       (a, b) =>
//         Number(b.amount || 0) -
//         Number(a.amount || 0)
//     );

//     // =========================
//     // REFERRAL PERCENT
//     // =========================

//     let referralPercent = 0;

//     if (
//       Number(
//         user.referralAmount || 0
//       ) >= 0 &&
//       Number(
//         user.referralAmount || 0
//       ) < 200
//     ) {

//       referralPercent = 10;

//     } else if (
//       Number(
//         user.referralAmount || 0
//       ) >= 200 &&
//       Number(
//         user.referralAmount || 0
//       ) <= 350
//     ) {

//       referralPercent = 12;

//     } else if (
//       Number(
//         user.referralAmount || 0
//       ) > 350
//     ) {

//       referralPercent = 15;
//     }

//     // =========================
//     // RESPONSE
//     // =========================

//     return res.status(200).json({
//       success: true,

//       user: {
//         ...user,

//         totalJoinedUsers,

//         referralPercent,

//         referralHistory,
//       },
//     });

//   } catch (error) {

//     return res.status(500).json({
//       success: false,
//       message:
//         error.message,
//     });
//   }
// };

const getProfile = async (req, res) => {
  try {
    // =========================
    // GET USER
    // =========================

    const user = await User.findById(req.user.id)
      .select(
        "-password -lastRevenueMap -lastLogin -reset_otp -reset_otp_expiry -createdAt -updatedAt -status -role"
      )
      .lean();

    // =========================
    // USER NOT FOUND
    // =========================

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // =========================
    // REFERRAL CODE
    // =========================

    const referralCode = (user.referralCode || "").trim();

    // =========================
    // TOTAL JOIN COUNT
    // =========================

    const totalJoinedUsers = referralCode
      ? await User.countDocuments({
          referredBy: {
            $regex: new RegExp(`^${referralCode}$`, "i"),
          },
        })
      : 0;

    // =========================
    // GET ALL REFERRED USERS
    // SHOW EVEN IF NO REVENUE
    // =========================

    let referralHistory = [];

    if (referralCode) {
      const referredUsers = await User.find({
        referredBy: {
          $regex: new RegExp(`^${referralCode}$`, "i"),
        },
      })
        .select(
          "name referralAmount totalRevenue revenue createdAt email mobile"
        )
        .lean();

      referralHistory = referredUsers.map((item) => ({
        name: item?.name || "Unknown",
        email: item?.email || "",
        mobile: item?.mobile || "",
        amount: Number(item?.referralAmount || 0),

        // revenue field schema ke hisab se adjust kar lena
        revenue: Number(
          item?.totalRevenue ||
            item?.revenue ||
            0
        ),

        date: item?.createdAt || null,
      }));
    }

    // =========================
    // SORT BY AMOUNT DESC
    // =========================

    referralHistory.sort(
      (a, b) =>
        Number(b.amount || 0) -
        Number(a.amount || 0)
    );

    // =========================
    // REFERRAL PERCENT
    // =========================

    let referralPercent = 0;

    const referralAmount = Number(
      user.referralAmount || 0
    );

    if (
      referralAmount >= 0 &&
      referralAmount < 200
    ) {
      referralPercent = 10;
    } else if (
      referralAmount >= 200 &&
      referralAmount <= 350
    ) {
      referralPercent = 12;
    } else if (
      referralAmount > 350
    ) {
      referralPercent = 15;
    }

    // =========================
    // RESPONSE
    // =========================

    return res.status(200).json({
      success: true,

      user: {
        ...user,

        totalJoinedUsers,

        referralPercent,

        referralHistory,
      },
    });
  } catch (error) {
    console.error(
      "Get Profile Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Internal Server Error",
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
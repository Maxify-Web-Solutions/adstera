// controllers/withdrawalController.js

const Withdrawal = require("../models/withdrawalModel");
const User = require("../models/authmodel");
const { sendWithdrawalOTP } = require("../utils/mailer");
const WithdrawalOtp = require("../models/WithdrawalOtp");

exports.createWithdrawal = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      amount,
      paymentMethod,

      // bank
      accountHolderName,
      bankName,
      accountNumber,
      ifscCode,

      otp,

      // crypto
      cryptoType,
      walletAddress,
      network,
    } = req.body;

    // ✅ Amount validation
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    // ✅ Payment method validation
    if (!paymentMethod || !["bank", "crypto"].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method (bank / crypto required)",
      });
    }

    // ✅ User check
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ Balance check
    if (user.revenue < amount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
      });
    }

    // ================= VALIDATIONS =================

    if (paymentMethod === "bank") {
      if (!accountHolderName || !bankName || !accountNumber || !ifscCode) {
        return res.status(400).json({
          success: false,
          message: "All bank details are required",
        });
      }
    }

    if (paymentMethod === "crypto") {
      if (!cryptoType || !walletAddress || !network) {
        return res.status(400).json({
          success: false,
          message: "All crypto details are required",
        });
      }
    }

    // ================= OTP VERIFY =================

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is required",
      });
    }

    // DB se latest OTP lao
    const otpRecord = await WithdrawalOtp.findOne({ userId })
      .sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    }

    // expire check
    if (otpRecord.expiresAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // match check
    if (otpRecord.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    user.revenue -= amount;
    await user.save();

    // ================= CREATE DATA =================
    const withdrawalData = {
      userId,
      amount,
      paymentMethod,
    };

    if (paymentMethod === "bank") {
      withdrawalData.accountHolderName = accountHolderName;
      withdrawalData.bankName = bankName;
      withdrawalData.accountNumber = accountNumber;
      withdrawalData.ifscCode = ifscCode;
    }

    if (paymentMethod === "crypto") {
      withdrawalData.cryptoType = cryptoType;
      withdrawalData.walletAddress = walletAddress;
      withdrawalData.network = network;
    }

    const withdrawal = await Withdrawal.create(withdrawalData);

    res.status(200).json({
      success: true,
      message: "Withdrawal request submitted",
      withdrawal,
      remainingBalance: user.revenue,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// dummy email function (baad me nodemailer laga dena)

exports.sendWithdrawalOtp = async (req, res) => {
  try {
    const userId = req.user.id;


    const { amount } = req.body;

    // ✅ user check
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ OTP generate
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ DB me save
    await WithdrawalOtp.create({
      userId,
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 min
    });

    // ✅ email send
    await sendWithdrawalOTP(user.email, otp, amount);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ✅ 2. Get My Withdrawals
exports.getMyWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      withdrawals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ✅ 3. Admin - Get All Withdrawals
exports.getAllWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find()
      .populate("userId", "name email mobile")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      withdrawals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ✅ 4. Admin - Approve / Reject
exports.updateWithdrawalStatus = async (req, res) => {
  try {
    const { withdrawalId, status, remark } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const withdrawal = await Withdrawal.findById(withdrawalId);

    if (!withdrawal) {
      return res.status(404).json({
        success: false,
        message: "Withdrawal not found",
      });
    }

    if (withdrawal.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Already processed",
      });
    }

    withdrawal.status = status;
    withdrawal.adminRemark = remark || "";

    // 🔁 Refund if rejected
    if (status === "rejected") {
      const user = await User.findById(withdrawal.userId);
      user.revenue += withdrawal.amount;
      await user.save();
    }

    await withdrawal.save();

    res.status(200).json({
      success: true,
      message: `Withdrawal ${status}`,
      withdrawal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
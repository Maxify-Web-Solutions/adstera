// controllers/withdrawalController.js

const Withdrawal = require("../models/withdrawalModel");
const User = require("../models/authmodel");
const { sendWithdrawalOTP } = require("../utils/mailer");
const WithdrawalOtp = require("../models/WithdrawalOtp");
const mongoose = require("mongoose");
const PlatformFee = require("../models/PlatformFee");


// ✅ 1. Create Withdrawal




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

    // =================================================
    // AMOUNT VALIDATION
    // =================================================

    if (!amount || Number(amount) <= 25) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    // =================================================
    // PAYMENT METHOD VALIDATION
    // =================================================

    if (
      !paymentMethod ||
      !["bank", "crypto"].includes(paymentMethod)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid payment method (bank / crypto required)",
      });
    }

    // =================================================
    // USER CHECK
    // =================================================

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // =================================================
    // BALANCE CHECK
    // =================================================

    if (
      Number(user.revenue) < Number(amount)
    ) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
      });
    }

    // =================================================
    // BANK VALIDATION
    // =================================================

    if (paymentMethod === "bank") {
      if (
        !accountHolderName ||
        !bankName ||
        !accountNumber ||
        !ifscCode
      ) {
        return res.status(400).json({
          success: false,
          message:
            "All bank details are required",
        });
      }
    }

    // =================================================
    // CRYPTO VALIDATION
    // =================================================

    if (paymentMethod === "crypto") {
      if (
        !cryptoType ||
        !walletAddress ||
        !network
      ) {
        return res.status(400).json({
          success: false,
          message:
            "All crypto details are required",
        });
      }
    }

    // =================================================
    // OTP REQUIRED
    // =================================================

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is required",
      });
    }

    // =================================================
    // GET LATEST OTP
    // =================================================

    const otpRecord =
      await WithdrawalOtp.findOne({
        userId,
      }).sort({
        createdAt: -1,
      });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    }

    // =================================================
    // OTP EXPIRE CHECK
    // =================================================

    if (
      otpRecord.expiresAt < Date.now()
    ) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // =================================================
    // OTP MATCH CHECK
    // =================================================

    if (
      String(otpRecord.otp) !==
      String(otp)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // =================================================
    // PLATFORM FEE CALCULATION
    // =================================================

    const originalAmount = Number(amount);

    const feePercent = 3;

    const feeAmount = Number(
      (
        (originalAmount * feePercent) /
        100
      ).toFixed(6)
    );

    const finalAmount = Number(
      (
        originalAmount - feeAmount
      ).toFixed(6)
    );

    // =================================================
    // DEDUCT USER BALANCE
    // =================================================

    user.revenue = Number(
      (
        Number(user.revenue) -
        originalAmount
      ).toFixed(6)
    );

    // =================================================
    // SAVE LAST WITHDRAWAL DATE
    // =================================================

    user.lastWithdrawalDate =
      new Date()
        .toISOString()
        .split("T")[0];

    await user.save();

    // =================================================
    // CREATE WITHDRAWAL DATA
    // =================================================

    const withdrawalData = {
      userId,

      // user requested amount
      amount: originalAmount,

      // fee data
      platformFee: feeAmount,
      feePercent,
      finalAmount,

      paymentMethod,
    };

    // =================================================
    // BANK DATA
    // =================================================

    if (paymentMethod === "bank") {
      withdrawalData.accountHolderName =
        accountHolderName;

      withdrawalData.bankName =
        bankName;

      withdrawalData.accountNumber =
        accountNumber;

      withdrawalData.ifscCode =
        ifscCode;
    }

    // =================================================
    // CRYPTO DATA
    // =================================================

    if (paymentMethod === "crypto") {
      withdrawalData.cryptoType =
        cryptoType;

      withdrawalData.walletAddress =
        walletAddress;

      withdrawalData.network =
        network;
    }

    // =================================================
    // CREATE WITHDRAWAL
    // =================================================

    const withdrawal =
      await Withdrawal.create(
        withdrawalData
      );

    // =================================================
    // SAVE PLATFORM FEE
    // =================================================

    await PlatformFee.create({
      userId,
      withdrawalId:
        withdrawal._id,

      originalAmount,
      feePercent,
      feeAmount,
      finalAmount,
    });

    // =================================================
    // DELETE USED OTP
    // =================================================

    await WithdrawalOtp.deleteMany({
      userId,
    });

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,
      message:
        "Withdrawal request submitted successfully",

      withdrawal,

      platformFee: feeAmount,

      userWillReceive:
        finalAmount,

      remainingBalance:
        Number(
          user.revenue.toFixed(6)
        ),

      lastWithdrawalDate:
        user.lastWithdrawalDate,
    });
  } catch (error) {
    console.log(
      "WITHDRAWAL ERROR =>",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
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

    // ✅ BALANCE CHECK
    if (Number(user.revenue) < Number(amount)) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
      });
    }

    // ✅ OTP generate
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // ✅ DB me save
    await WithdrawalOtp.create({
      userId,
      otp,
      expiresAt:
        Date.now() + 5 * 60 * 1000,
    });

    // ✅ email send
    await sendWithdrawalOTP(
      user.email,
      otp,
      amount
    );

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
    console.log("REQ USER:", req.user);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    const rawUserId = req.user._id || req.user.id;

    if (!rawUserId) {
      return res.status(400).json({
        success: false,
        message: "User ID missing",
      });
    }

    // ✅ SAFE ObjectId handling
    let userId = rawUserId;

    if (mongoose.Types.ObjectId.isValid(rawUserId)) {
      userId = new mongoose.Types.ObjectId(rawUserId.toString());
    }

    const withdrawals = await Withdrawal.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: withdrawals.length,
      withdrawals,
    });

  } catch (error) {
    console.error("WITHDRAWAL ERROR FULL:", error);

    return res.status(500).json({
      success: false,
      message: error.message, // 👈 IMPORTANT DEBUG
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
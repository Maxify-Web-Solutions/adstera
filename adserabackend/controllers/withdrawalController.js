// controllers/withdrawalController.js

const Withdrawal = require("../models/withdrawalModel");
const User = require("../models/authmodel");

// ✅ 1. Create Withdrawal (User)
exports.createWithdrawal = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      amount,
      accountHolderName,
      bankName,
      accountNumber,
      ifscCode,
    } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.revenue < amount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
      });
    }

    // ✅ Deduct revenue
    user.revenue -= amount;
    await user.save();

    // ✅ Create withdrawal
    const withdrawal = await Withdrawal.create({
      userId,
      amount,
      accountHolderName,
      bankName,
      accountNumber,
      ifscCode,
    });

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
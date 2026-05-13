const User = require("../models/authmodel");
const UserMonthlyStats = require("../models/UserMonthlyStats");

// =====================================================
// SAVE USER MONTHLY STATS
// =====================================================

exports.saveUserMonthlyStats = async () => {
  try {
    console.log("⏰ Saving User Monthly Stats...");

    // all users
    const users = await User.find({});

    // current date/time
    const now = new Date();

    // current month
    // example: 2026-05
    const month = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}`;

    // current date
    // example: 2026-05-13
    const today = now.toISOString().split("T")[0];

    // loop all users
    for (const user of users) {
      // find existing monthly doc
      let monthlyDoc = await UserMonthlyStats.findOne({
        userId: user._id,
        month,
      });

      // snapshot object
      const snapshot = {
        revenue: user.revenue || 0,
        status: user.status,
        role: user.role,
        time: new Date(),
      };

      // =====================================================
      // CREATE NEW MONTH DOCUMENT
      // =====================================================

      if (!monthlyDoc) {
        await UserMonthlyStats.create({
          userId: user._id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          month,

          dailyData: [
            {
              date: today,
              snapshots: [snapshot],
            },
          ],
        });

        console.log(`✅ New Monthly Doc Created`);

        continue;
      }

      // =====================================================
      // FIND TODAY DATA
      // =====================================================

      const dayIndex = monthlyDoc.dailyData.findIndex(
        (d) => d.date === today
      );

      // =====================================================
      // IF TODAY NOT FOUND
      // =====================================================

      if (dayIndex === -1) {
        monthlyDoc.dailyData.push({
          date: today,
          snapshots: [snapshot],
        });
      }

      // =====================================================
      // IF TODAY EXISTS
      // =====================================================

      else {
        monthlyDoc.dailyData[dayIndex].snapshots.push(
          snapshot
        );
      }

      await monthlyDoc.save();

      console.log(`✅ Updated ${user.name}`);
    }

    console.log("🚀 All User Stats Saved");
  } catch (error) {
    console.log("❌ Error:", error.message);
  }
};

// =====================================================
// GET ALL MONTHLY STATS
// =====================================================

exports.getAllMonthlyStats = async (req, res) => {
  try {
    const data = await UserMonthlyStats.find()
      .populate("userId", "name email mobile")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET SINGLE USER MONTHLY STATS
// =====================================================

exports.getSingleUserMonthlyStats = async (
  req,
  res
) => {
  try {
    const { userId } = req.params;

    const data = await UserMonthlyStats.find({
      userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
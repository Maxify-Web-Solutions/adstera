const User = require("../models/authmodel");
const UserMonthlyStats = require("../models/UserMonthlyStats");

// =====================================================
// SAVE USER MONTHLY STATS
// =====================================================

exports.saveUserMonthlyStats = async () => {
  try {
    console.log("⏰ Saving User Monthly Stats...");



    const users = await User.find({}).lean();

    // current time
    const now = new Date();

    // month => 2026-05
    const month = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}`;

    // date => 2026-05-14
    const today = now.toISOString().split("T")[0];

    // =====================================================
    // LOOP USERS
    // =====================================================

    for (const user of users) {
      try {
        // safe revenue number
        const currentRevenue = Number(
          user.revenue || 0
        );

        console.log(
          `👤 ${user.name} Revenue: ${currentRevenue}`
        );

        // =====================================================
        // FIND MONTHLY DOC
        // =====================================================

        let monthlyDoc =
          await UserMonthlyStats.findOne({
            userId: user._id,
            month,
          });

        // =====================================================
        // SNAPSHOT
        // =====================================================

        const snapshot = {
          revenue: currentRevenue,
          status: user.status || "active",
          role: user.role || "user",
          time: new Date(),
        };

        // =====================================================
        // CREATE NEW MONTH DOC
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

          console.log(
            `✅ New Monthly Doc Created For ${user.name}`
          );

          continue;
        }

        // =====================================================
        // FIND TODAY DATA
        // =====================================================

        let todayData = monthlyDoc.dailyData.find(
          (d) => d.date === today
        );

        // =====================================================
        // CREATE TODAY DATA
        // =====================================================

        if (!todayData) {
          monthlyDoc.dailyData.push({
            date: today,
            snapshots: [snapshot],
          });

          await monthlyDoc.save();

          console.log(
            `✅ New Day Added For ${user.name}`
          );

          continue;
        }

        // =====================================================
        // GET LAST SNAPSHOT
        // =====================================================

        const lastSnapshot =
          todayData.snapshots[
            todayData.snapshots.length - 1
          ];

        // =====================================================
        // SKIP IF REVENUE SAME
        // =====================================================

        if (
          lastSnapshot &&
          Number(lastSnapshot.revenue) ===
            Number(currentRevenue)
        ) {
          console.log(
            `⏭️ Revenue Unchanged For ${user.name}`
          );

          continue;
        }

        // =====================================================
        // PUSH NEW SNAPSHOT
        // =====================================================

        todayData.snapshots.push(snapshot);

        await monthlyDoc.save();

        console.log(
          `✅ Revenue Updated For ${user.name}`
        );
      } catch (userError) {
        console.log(
          `❌ User Error (${user.name}):`,
          userError.message
        );
      }
    }

    console.log("🚀 All User Stats Saved");
  } catch (error) {
    console.log("❌ Main Error:", error.message);
  }
};

// =====================================================
// GET ALL MONTHLY STATS
// =====================================================

exports.getAllMonthlyStats = async (
  req,
  res
) => {
  try {
    const data = await UserMonthlyStats.find()
      .populate("userId", "name email mobile revenue")
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

exports.getSingleUserMonthlyStats =
  async (req, res) => {
    try {
      const { userId } = req.params;

      const data =
        await UserMonthlyStats.find({
          userId,
        }).sort({
          createdAt: -1,
        });

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
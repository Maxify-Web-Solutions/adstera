const SmartLink = require("../models/SmartLink");
const crypto = require("crypto");
const mongoose = require("mongoose");
const SmartLinkStats = require("../models/SmartLinkStats");


// ================= CREATE =================
exports.createSmartLink = async (req, res) => {
    try {
        const { type } = req.body;

        if (!type || !["adult", "maisteram"].includes(type)) {
            return res.status(400).json({
                success: false,
                message: "Invalid type (adult / maisteram required)"
            });
        }

        const totalLinks = await SmartLink.countDocuments({
            userId: req.user.id,
        });

        // ✅ TYPE BASED NAME
        const name = type === "adult"
            ? `Adultlink_${totalLinks + 1}`
            : `Smartlink_${totalLinks + 1}`;

        // ✅ SAME LOGIC (UNCHANGED)
        const numericId = Math.floor(10000000 + Math.random() * 90000000);
        const smartCode = crypto.randomBytes(4).toString("hex");
        const key = crypto.randomBytes(16).toString("hex");

        const baseUrl = "https://adstorx.com";
        // const baseUrl = "https://bestprofitablecpmhike.tech";


        const finalUrl = `${baseUrl}/s/${smartCode}?key=${key}`;

        const smartLink = await SmartLink.create({
            userId: req.user.id,
            name,
            linkId: numericId,
            smartCode,
            key,
            finalUrl,
            type,
            status: "pending",
        });

        res.status(201).json({
            success: true,
            message: "Smart link created",
            smartLink,
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



// ================= GET USER LINKS =================
exports.getSmartLinksByUser = async (req, res) => {
    try {
        const smartLinks = await SmartLink.find({
            userId: req.user.id,
        })
            .populate("userId", "name email mobile")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: smartLinks.length,
            data: smartLinks,
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



// ================= APPROVE =================
exports.approveSmartLink = async (req, res) => {
    try {
        const { id } = req.params;
        const { redirectUrl } = req.body;

        const updateData = {
            status: "approved",
        };

        if (redirectUrl) {
            updateData.redirectUrl = redirectUrl;
        }

        const smartLink = await SmartLink.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!smartLink) {
            return res.status(404).json({
                success: false,
                message: "Smart link not found",
            });
        }

        res.json({
            success: true,
            message: "Approved successfully",
            smartLink,
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



// ================= EXTERNAL UPDATE =================
exports.updateSmartLinkData = async (req, res) => {
    try {
        const { linkId, redirectUrl, status } = req.body;

        const link = await SmartLink.findOneAndUpdate(
            { linkId },
            {
                redirectUrl,
                status: status || "approved",
            },
            { new: true }
        );

        if (!link) {
            return res.status(404).json({
                success: false,
                message: "Link not found",
            });
        }

        res.json({
            success: true,
            message: "Updated from external system",
            link,
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



// ================= TRACK IMPRESSION =================
exports.getSmartLinkStats = async (
  req,
  res
) => {
  try {
    const userId = req.user?.id;

    const {
      start_date,
      end_date,
      placement,
      country,
      page = 1,
      limit = 20,
    } = req.query;

    // ✅ AUTH
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // ✅ FILTER
    const filter = {
      userId:
        new mongoose.Types.ObjectId(
          userId
        ),
    };

    // ✅ DATE FILTER
    if (
      start_date &&
      end_date
    ) {
      filter.date = {
        $gte: start_date,
        $lte: end_date,
      };
    }

    // ✅ PLACEMENT FILTER
    if (placement) {
      filter.placement =
        placement;
    }

    // ✅ COUNTRY FILTER
    if (
      country &&
      country.toUpperCase() !==
        "ALL"
    ) {
      filter.country = {
        $in: country
          .split(",")
          .map((c) =>
            c
              .trim()
              .toUpperCase()
          ),
      };
    }

    // ✅ PAGINATION
    const currentPage =
      Number(page) || 1;

    const perPage =
      Number(limit) || 20;

    const skip =
      (currentPage - 1) *
      perPage;

    // ✅ FETCH DATA
    const stats =
      await SmartLinkStats
        .find(filter)
        .sort({
          date: -1,
          createdAt: -1,
        })
        .skip(skip)
        .limit(perPage)
        .lean();

    // ✅ TOTAL RECORDS
    const totalRecords =
      await SmartLinkStats.countDocuments(
        filter
      );

    // ✅ TOTALS
    const totalsAgg =
      await SmartLinkStats.aggregate(
        [
          {
            $match: filter,
          },

          {
            $group: {
              _id: null,

              totalImpressions:
                {
                  $sum:
                    "$impressions",
                },

              totalClicks: {
                $sum: "$clicks",
              },

              totalRevenue: {
                $sum: "$revenue",
              },
            },
          },
        ]
      );

    const totals =
      totalsAgg[0] || {
        totalImpressions: 0,
        totalClicks: 0,
        totalRevenue: 0,
      };

    // ✅ CTR
    const ctr =
      totals.totalImpressions >
      0
        ? (totals.totalClicks /
            totals.totalImpressions) *
          100
        : 0;

    // ✅ CPM
    const cpm =
      totals.totalImpressions >
      0
        ? (totals.totalRevenue /
            totals.totalImpressions) *
          1000
        : 0;

    // ✅ COUNTRY WISE SUMMARY
    const countrySummary =
      await SmartLinkStats.aggregate(
        [
          {
            $match: filter,
          },

          {
            $group: {
              _id: "$country",

              impressions: {
                $sum:
                  "$impressions",
              },

              clicks: {
                $sum: "$clicks",
              },

              revenue: {
                $sum: "$revenue",
              },
            },
          },

          {
            $project: {
              _id: 0,

              country: "$_id",

              impressions: 1,

              clicks: 1,

              revenue: {
                $round: [
                  "$revenue",
                  6,
                ],
              },

              ctr: {
                $cond: [
                  {
                    $gt: [
                      "$impressions",
                      0,
                    ],
                  },

                  {
                    $multiply: [
                      {
                        $divide: [
                          "$clicks",
                          "$impressions",
                        ],
                      },
                      100,
                    ],
                  },

                  0,
                ],
              },
            },
          },

          {
            $sort: {
              impressions: -1,
            },
          },
        ]
      );

    // ✅ RESPONSE
    return res.status(200).json({
      success: true,

      page: currentPage,

      limit: perPage,

      totalPages: Math.ceil(
        totalRecords /
          perPage
      ),

      totalRecords,

      filters: {
        start_date:
          start_date || null,

        end_date:
          end_date || null,

        placement:
          placement || null,

        country:
          country || "ALL",
      },

      totals: {
        totalImpressions:
          Number(
            totals.totalImpressions ||
              0
          ),

        totalClicks: Number(
          totals.totalClicks ||
            0
        ),

        totalRevenue: Number(
          (
            totals.totalRevenue ||
            0
          ).toFixed(6)
        ),

        ctr: Number(
          ctr.toFixed(2)
        ),

        cpm: Number(
          cpm.toFixed(6)
        ),
      },

      countrySummary,

      data: stats,
    });
  } catch (error) {
    console.error(
      "SMARTLINK STATS ERROR =>",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to fetch smartlink stats",

      error: error.message,
    });
  }
};


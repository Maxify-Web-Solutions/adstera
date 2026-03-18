const SmartLink = require("../models/SmartLink");
const SmartLinkStats = require("../models/SmartLinkStats"); // ✅ ADD
const crypto = require("crypto");


// ================= CREATE =================
exports.createSmartLink = async (req, res) => {
    try {
        const totalLinks = await SmartLink.countDocuments({
            userId: req.user.id,
        });

        const name = `Smartlink_${totalLinks + 1}`;

        const numericId = Math.floor(10000000 + Math.random() * 90000000);

        const smartCode = crypto.randomBytes(4).toString("hex");
        const key = crypto.randomBytes(16).toString("hex");

        const baseUrl = "http://localhost:5000";

        const finalUrl = `${baseUrl}/s/${smartCode}?key=${key}`; // ✅ FIXED

        const smartLink = await SmartLink.create({
            userId: req.user.id,
            name,
            linkId: numericId,
            smartCode,
            key,
            finalUrl,
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
exports.trackImpression = async (req, res) => {
    try {
        const { linkId } = req.body;

        const today = new Date().toISOString().split("T")[0];

        await SmartLinkStats.findOneAndUpdate(
            { linkId, date: today },
            {
                $inc: { impressions: 1 },
            },
            { upsert: true }
        );

        res.json({ success: true });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getSmartLinkStats = async (req, res) => {
    try {
        const { linkId } = req.params;

        const stats = await SmartLinkStats.find({ linkId })
            .sort({ date: -1 });

        const formatted = stats.map((item) => {
            const ctr =
                item.impressions > 0
                    ? ((item.clicks / item.impressions) * 100).toFixed(2)
                    : 0;

            const cpm =
                item.impressions > 0
                    ? ((item.revenue / item.impressions) * 1000).toFixed(2)
                    : 0;

            return {
                date: item.date,
                impressions: item.impressions,
                clicks: item.clicks,
                ctr: `${ctr}%`,
                cpm: `$${cpm}`,
                revenue: `$${item.revenue.toFixed(2)}`,
            };
        });

        // TOTAL
        const total = stats.reduce(
            (acc, item) => {
                acc.impressions += item.impressions;
                acc.clicks += item.clicks;
                acc.revenue += item.revenue;
                return acc;
            },
            { impressions: 0, clicks: 0, revenue: 0 }
        );

        const totalCTR =
            total.impressions > 0
                ? ((total.clicks / total.impressions) * 100).toFixed(2)
                : 0;

        const totalCPM =
            total.impressions > 0
                ? ((total.revenue / total.impressions) * 1000).toFixed(2)
                : 0;

        res.json({
            success: true,
            data: formatted,
            total: {
                impressions: total.impressions,
                clicks: total.clicks,
                ctr: `${totalCTR}%`,
                cpm: `$${totalCPM}`,
                revenue: `$${total.revenue.toFixed(2)}`,
            },
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ================= REDIRECT (CLICK + REVENUE) =================
exports.redirectSmartLink = async (req, res) => {
    try {
        const { code } = req.params;
        const { key } = req.query; // ✅ GET KEY

        const link = await SmartLink.findOne({ smartCode: code });

        if (!link) return res.status(404).send("Link not found");

        if (link.key !== key) {   // ✅ VALIDATION
            return res.status(403).send("Invalid key");
        }

        if (link.status !== "approved") {
            return res.send("Waiting for approval...");
        }

        if (!link.redirectUrl) {
            return res.send("Redirect not ready");
        }

        const today = new Date().toISOString().split("T")[0];

        const revenuePerClick = 0.01;

        await SmartLinkStats.findOneAndUpdate(
            { linkId: link.linkId, date: today },
            {
                $inc: {
                    clicks: 1,
                    revenue: revenuePerClick,
                },
            },
            { upsert: true }
        );

        link.clicks += 1;
        await link.save();

        return res.redirect(link.redirectUrl);

    } catch (err) {
        res.status(500).send(err.message);
    }
};




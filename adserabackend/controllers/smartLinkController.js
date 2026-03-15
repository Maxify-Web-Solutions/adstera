const SmartLink = require("../models/SmartLink");
const crypto = require("crypto");


exports.createSmartLink = async (req, res) => {

    try {

        const { name, targetUrl } = req.body;

        const code = crypto.randomBytes(4).toString("hex");

        const smartLink = await SmartLink.create({

            userId: req.user.id,
            name,
            targetUrl,
            smartCode: code

        });

        res.status(201).json({

            success: true,
            message: "Smart link created and waiting for admin approval",
            smartLink

        });

    } catch (err) {

        res.status(500).json({ error: err.message });

    }

};
exports.approveSmartLink = async (req, res) => {

    try {

        const { id } = req.params;

        const smartLink = await SmartLink.findByIdAndUpdate(

            id,
            { status: "approved" },
            { new: true }

        );

        res.json({

            success: true,
            message: "Smart link approved",
            smartLink

        });

    } catch (err) {

        res.status(500).json({ error: err.message });

    }

};

exports.redirectSmartLink = async (req, res) => {

    try {

        const { code } = req.params;

        const link = await SmartLink.findOne({ smartCode: code });

        if (!link) {
            return res.status(404).send("Link not found");
        }

        if (link.status !== "approved") {
            return res.send("Link is not approved yet");
        }

        link.clicks += 1;

        await link.save();

        res.redirect(link.targetUrl);

    } catch (err) {

        res.status(500).send(err.message);

    }

};
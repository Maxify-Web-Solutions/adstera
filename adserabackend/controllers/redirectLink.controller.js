const express = require("express");
const router = express.Router();

const TrackingLink = require("../models/SmartLink");

// OPEN SMART LINK
router.get("/s/:code", async (req, res) => {
  try {
    const { code } = req.params;
    

    // find approved link
    const link = await TrackingLink.findOne({
      smartCode: code,
      status: "approved",
    });

    if (!link) {
      return res.status(404).json({
        success: false,
        message: "Link not found",
      });
    }

    // increase clicks
    await TrackingLink.findByIdAndUpdate(link._id, {
      $inc: { clicks: 1 },
    });

    // redirect user
    return res.redirect(link.redirectUrl);

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

module.exports = router;
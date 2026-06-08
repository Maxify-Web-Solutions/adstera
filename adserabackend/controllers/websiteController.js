const Website = require("../models/Website");
const crypto = require("crypto");
const mongoose = require("mongoose");


// CREATE WEBSITE

const createWebsite = async (req, res) => {
  try {
    const {
      website,
      websiteCategory,
      showAdultAds,
      adFormat,
      placements,
      bannerSizes, // ✅ frontend se aayega
    } = req.body;

    // =========================
    // VALIDATION
    // =========================
    if (!website || !websiteCategory) {
      return res.status(400).json({
        success: false,
        message: "Website and category required",
      });
    }

    const formats = Array.isArray(adFormat)
      ? adFormat
      : [];

    const selectedBannerSizes = Array.isArray(
      bannerSizes
    )
      ? bannerSizes
      : [];

    // =========================
    // BANNER VALIDATION
    // =========================
    if (
      formats.includes("Banner") &&
      selectedBannerSizes.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please select at least one banner size",
      });
    }

    // =========================
    // DUPLICATE CHECK
    // =========================
    const existingCategory =
      await Website.findOne({
        website: website.trim(),
        websiteCategory: websiteCategory.trim(),
      });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message:
          "Website category already exists",
      });
    }

    // =========================
    // EXISTING WEBSITE CHECK
    // =========================
    const existingWebsite =
      await Website.findOne({
        website: website.trim(),
      });

    // =========================
    // SMART CODE
    // =========================
    let smartCode = "";

    if (existingWebsite?.smartCode) {
      smartCode =
        existingWebsite.smartCode;
    } else {
      let codeExists = true;

      while (codeExists) {
        smartCode =
          crypto
            .randomBytes(4)
            .toString("hex");

        const exists =
          await Website.findOne({
            smartCode,
          });

        if (!exists) {
          codeExists = false;
        }
      }
    }

    // =========================
    // AUTO PLACEMENTS
    // =========================
    const autoPlacements =
      formats.map((type) => ({
        type,
        placementId: "",
        adUrl: "",
        adName: "",
        isActive: true,

        sizes:
          type === "Banner"
            ? selectedBannerSizes
            : [],
      }));

    // =========================
    // FINAL PLACEMENTS
    // =========================
    const finalPlacements =
      Array.isArray(placements) &&
      placements.length > 0
        ? placements.map((p) => ({
            type: p.type,

            placementId:
              p.placementId || "",

            adUrl:
              p.adUrl || "",

            adName:
              p.adName || "",

            isActive:
              p.isActive === true ||
              p.isActive === "true",

            sizes:
              p.type === "Banner"
                ? Array.isArray(
                    p.sizes
                  ) &&
                  p.sizes.length > 0
                  ? p.sizes
                  : selectedBannerSizes
                : [],
          }))
        : autoPlacements;

    // =========================
    // CREATE WEBSITE
    // =========================
    const newWebsite =
      await Website.create({
        userId: req.user.id,
        name: req.user.name,
        email: req.user.email,

        website: website.trim(),
        websiteCategory:
          websiteCategory.trim(),

        smartCode,

        apiKey:
          existingWebsite?.apiKey ||
          "",

        showAdultAds:
          showAdultAds === true ||
          showAdultAds === "true",

        adFormat: formats,

        placements:
          finalPlacements,

        status: "pending",
      });

    return res.status(201).json({
      success: true,
      message:
        "Website created successfully",
      data: newWebsite,
    });
  } catch (error) {
    console.error(
      "CREATE WEBSITE ERROR =>",
      error
    );

    // Mongo duplicate error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          "Website category already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Internal server error",
    });
  }
};




// GET ALL WEBSITES
const getAllWebsites = async (req, res) => {
  try {

    // =========================================
    // USER ID
    // =========================================

    const userId = req.user?.id;

    console.log("USER ID =>", userId);

    // =========================================
    // VALIDATION
    // =========================================

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    // =========================================
    // FIND USER WEBSITES
    // =========================================

    const websites = await Website.find({

      // ✅ FIND BY USER ID
      userId:
        new mongoose.Types.ObjectId(
          userId
        ),

    }).sort({
      createdAt: -1,
    });

    // =========================================
    // NO DATA
    // =========================================

    if (!websites.length) {
      return res.status(404).json({
        success: false,
        message: "No websites found",
      });
    }

    // =========================================
    // RESPONSE
    // =========================================

    return res.status(200).json({

      success: true,

      count: websites.length,

      data: websites,

    });

  } catch (error) {

    console.log(
      "GET ALL WEBSITES ERROR =>",
      error.message
    );

    return res.status(500).json({

      success: false,

      message: error.message,

    });
  }
};



// GET SINGLE WEBSITE
const getSingleWebsite = async (req, res) => {
  try {

    const website = await Website.findById(req.params.id);

    if (!website) {
      return res.status(404).json({
        success: false,
        message: "Website not found",
      });
    }

    res.status(200).json({
      success: true,
      data: website,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// UPDATE WEBSITE
const updateWebsite = async (req, res) => {
  try {

    const updatedWebsite = await Website.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        returnDocument: "after" ,
        runValidators: true,
      }
    );

    if (!updatedWebsite) {
      return res.status(404).json({
        success: false,
        message: "Website not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Website updated successfully",
      data: updatedWebsite,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// DELETE WEBSITE
const deleteWebsite = async (req, res) => {
  try {

    const website = await Website.findById(req.params.id);

    if (!website) {
      return res.status(404).json({
        success: false,
        message: "Website not found",
      });
    }

    await website.deleteOne();

    res.status(200).json({
      success: true,
      message: "Website deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



module.exports = {
  createWebsite,
  getAllWebsites,
  getSingleWebsite,
  updateWebsite,
  deleteWebsite,
};
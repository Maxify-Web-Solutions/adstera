const mongoose = require("mongoose");

/**
 * =========================
 * PLACEMENT SCHEMA
 * =========================
 */
const placementSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "Popunder",
        "Native Banner",
        "Banner",
        "Smartlink",
        "Social Bar",
      ],
      required: true,
    },

    placementId: {
      type: String,
      default: "",
    },

    adUrl: {
      type: String,
      default: "",
    },

    adName: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // ✅ BANNER SIZES SUPPORT (ONLY FOR Banner TYPE)
    sizes: {
      type: [
        {
          type: String,
          enum: [
            "468x60",
            "160x300",
            "320x50",
            "300x250",
            "160x600",
            "728x90",
          ],
        },
      ],
      default: [],
    },
  },
  { _id: false }
);

/**
 * =========================
 * WEBSITE SCHEMA
 * =========================
 */
const websiteSchema = new mongoose.Schema(
  {
    // USER ID
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },


    // WEBSITE URL
    website: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    // CATEGORY
    websiteCategory: {
      type: String,
      required: true,
      trim: true,
    },

    // SMART CODE
    smartCode: {
      type: String,
      unique: true,
    },

    apiKey: {
      type: String,
      trim: true,
    },

    // ADULT ADS
    showAdultAds: {
      type: Boolean,
      default: false,
    },

    // AD FORMATS
    adFormat: {
      type: [
        {
          type: String,
          enum: [
            "Popunder",
            "Native Banner",
            "Banner",
            "Smartlink",
            "Social Bar",
          ],
        },
      ],
      default: [],
    },

    // PLACEMENTS
    placements: {
      type: [placementSchema],
      default: [],
    },

    // STATUS
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

/**
 * =========================
 * INDEXES
 * =========================
 */
websiteSchema.index({
  website: 1,
  websiteCategory: 1,
});

module.exports = mongoose.model("Website", websiteSchema);
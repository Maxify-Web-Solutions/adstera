const axios = require("axios");
const AdsterraPlacement = require("../models/AdsterraPlacement");


exports.fetchAndStorePlacements = async (req, res) => {
  try {
    const response = await axios.get(
      "https://api3.adsterratools.com/publisher/placements.json",
      {
        headers: {
          "X-API-Key": process.env.ADSTERA_API_KEY,
        },
      }
    );

    const items = response.data?.items || [];

    if (!items.length) {
      return res.status(200).json({
        success: true,
        message: "No placements found",
        data: [],
      });
    }

    let saved = [];

    // 💾 SAVE / UPDATE
    for (let item of items) {
      try {
        const doc = await AdsterraPlacement.findOneAndUpdate(
          { placementId: item.id },
          {
            $set: {
              placementId: item.id,
              domainId: item.domain_id,
              title: item.title,
              alias: item.alias,
              directUrl: item.direct_url,
            },
          },
          {
            upsert: true,
            new: true,
          }
        );

        saved.push(doc);
      } catch (err) {
        console.error("DB Error:", err.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Placements fetched & stored successfully",
      total: saved.length,
      data: saved,
    });
  } catch (error) {
    console.error("API Error:", error?.response?.data || error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch placements",
      error: error?.response?.data || error.message,
    });
  }
};




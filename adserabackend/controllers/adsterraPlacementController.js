const axios = require("axios");
const AdsterraPlacement = require("../models/AdsterraPlacement");
const Config = require("../models/Config");

exports.fetchAndStorePlacements = async (req, res) => {
  try {
    // ================= CONFIG =================

    const config = await Config.findOne();

    if (
      !config ||
      !config.adsterraApiKeys ||
      !config.adsterraApiKeys.length
    ) {
      return res.status(400).json({
        success: false,
        message: "No Adsterra API key found",
      });
    }

    // ================= API KEY =================

    const apiKey =
      config.adsterraApiKeys[0].apiKey?.trim();

    console.log("Using API Key:", apiKey);

    // ================= API CALL =================

    const response = await axios.get(
      "https://api3.adsterratools.com/publisher/placements.json",
      {
        headers: {
          "X-API-Key": apiKey,
          Accept: "application/json",
        },
      }
    );

    // ================= ITEMS =================

    const items = response.data?.items || [];

    if (!items.length) {
      return res.status(200).json({
        success: true,
        message: "No placements found",
        data: [],
      });
    }

    // ================= SAVE DATA =================

    let saved = [];

    for (let item of items) {
      try {
        const doc =
          await AdsterraPlacement.findOneAndUpdate(
            {
              placementId: item.id,
            },
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
              returnDocument: "after" ,
              setDefaultsOnInsert: true,
            }
          );

        saved.push(doc);

      } catch (err) {
        console.error(
          "DB Error:",
          err.message
        );
      }
    }

    // ================= RESPONSE =================

    return res.status(200).json({
      success: true,
      message:
        "Placements fetched & stored successfully",
      total: saved.length,
      data: saved,
    });

  } catch (error) {

    console.error(
      "API 3 Error:",
      error?.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch placements",
      error:
        error?.response?.data || error.message,
    });
  }
};
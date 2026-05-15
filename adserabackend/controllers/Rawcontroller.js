const axios = require("axios");
const mongoose = require("mongoose");
const UAParser = require("ua-parser-js");
const SmartLink = require("../models/SmartLink");
const AdsterraStats = require("../models/RawAdsterraStats");
const SmartLinkStats = require("../models/RawSmartLinkStats");
const User = require("../models/authmodel");
const Config = require("../models/Config");



exports.RawfetchAndStoreAdsterraStats =
  async (req = null, res = null) => {
    try {
      // =================================================
      // QUERY
      // =================================================

      const start_date =
        req?.query?.start_date || null;

      const end_date =
        req?.query?.end_date || null;

      // =================================================
      // GET ALL USERS
      // =================================================

      const users = await User.find({});

      if (!users.length) {
        const responseData = {
          success: false,
          message: "No users found",
        };

        if (res) {
          return res
            .status(404)
            .json(responseData);
        }

        return responseData;
      }

      // =================================================
      // CONFIG
      // =================================================

      const config = await Config.findOne();

      if (!config?.adsterraApiKey) {
        const responseData = {
          success: false,
          message:
            "Adsterra API key not found",
        };

        if (res) {
          return res
            .status(400)
            .json(responseData);
        }

        return responseData;
      }

      // =================================================
      // DATE HELPERS
      // =================================================

      const today = new Date();

      const normalizeDate = (d) => {
        if (!d) {
          return today
            .toISOString()
            .split("T")[0];
        }

        if (typeof d === "string") {
          return d.includes("T")
            ? d.split("T")[0]
            : d;
        }

        if (d instanceof Date) {
          return d
            .toISOString()
            .split("T")[0];
        }

        return today
          .toISOString()
          .split("T")[0];
      };

      // =================================================
      // DEFAULT DATES
      // =================================================

      const currentDate =
        normalizeDate(new Date());

      const oldDate = new Date();

      oldDate.setDate(
        oldDate.getDate() - 15
      );

      const defaultStartDate =
        normalizeDate(oldDate);

      const defaultEndDate =
        currentDate;

      const finalStartDate =
        start_date || defaultStartDate;

      const finalEndDate =
        end_date || defaultEndDate;

      // =================================================
      // DEVICE INFO
      // =================================================

      const ua =
        req?.headers?.["user-agent"] ||
        "Mozilla/5.0";

      const parser = new UAParser(ua);

      const device = parser.getDevice();

      const os = parser.getOS();

      const browser = parser.getBrowser();

      const deviceType =
        device.type || "desktop";

      const osName = os.name || "";

      const browserName =
        browser.name || "";

      // =================================================
      // TOTAL STORAGE
      // =================================================

      let totalUsers = 0;

      let totalLinks = 0;

      let totalRevenue = 0;

      // =================================================
      // LOOP ALL USERS
      // =================================================

      for (const user of users) {
        try {
          const userId = user._id;

          // =================================================
          // GET LINKS
          // =================================================

          const links =
            await SmartLink.find({
              userId,
            });

          if (!links.length) {
            continue;
          }

          totalUsers += 1;

          totalLinks += links.length;

          // =================================================
          // STORAGE
          // =================================================

          const overallOps = [];

          const revenueTracker =
            new Set();

          let userNewRevenue = 0;

          // =================================================
          // LOOP LINKS
          // =================================================

          for (const link of links) {
            try {
              const placementId = String(
                link.placementId || ""
              ).trim();

              if (!placementId) {
                continue;
              }

              // =============================================
              // APPROVED DATE
              // =============================================

              const approvedDate =
                link.approvedAt
                  ? normalizeDate(
                      link.approvedAt
                    )
                  : null;

              // =============================================
              // FINAL START DATE
              // =============================================

              let apiStartDate =
                finalStartDate;

              if (approvedDate) {
                apiStartDate =
                  approvedDate;
              }

              const domain =
                link.domain ||
                link.redirectUrl ||
                link.targetUrl ||
                "unknown";

              // =============================================
              // API CALL
              // =============================================

              const overallResponse =
                await axios.get(
                  "https://api3.adsterratools.com/publisher/stats.json",
                  {
                    params: {
                      placement:
                        placementId,

                      start_date:
                        apiStartDate,

                      finish_date:
                        finalEndDate,

                      group_by:
                        "date",
                    },

                    headers: {
                      Accept:
                        "application/json",

                      "X-API-Key":
                        config.adsterraApiKey,

                      "User-Agent":
                        "Mozilla/5.0",
                    },
                  }
                );

              let overallData =
                overallResponse.data
                  ?.items || [];

              // =============================================
              // FILTER APPROVED DATE
              // =============================================

              overallData =
                overallData.filter(
                  (item) => {
                    if (
                      !approvedDate
                    ) {
                      return true;
                    }

                    const itemDate =
                      normalizeDate(
                        item.date
                      );

                    return (
                      itemDate >=
                      approvedDate
                    );
                  }
                );

              // =============================================
              // SAVE STATS
              // =============================================

              for (const item of overallData) {
                const impressions =
                  Number(
                    item.impression
                  ) || 0;

                const clicks =
                  Number(
                    item.clicks
                  ) || 0;

                const revenue =
                  Number(
                    item.revenue
                  ) || 0;

                const ctr =
                  impressions > 0
                    ? Number(
                        (
                          (clicks /
                            impressions) *
                          100
                        ).toFixed(2)
                      )
                    : 0;

                const cpm =
                  Number(item.cpm) ||
                  0;

                const adsterraDate =
                  String(
                    normalizeDate(
                      item.date
                    )
                  ).trim();

                const revenueKey = [
                  placementId,
                  adsterraDate,
                ].join("|");

                if (
                  !revenueTracker.has(
                    revenueKey
                  )
                ) {
                  totalRevenue +=
                    revenue;

                  revenueTracker.add(
                    revenueKey
                  );
                }

                overallOps.push({
                  updateOne: {
                    filter: {
                      userId:
                        new mongoose.Types.ObjectId(
                          userId
                        ),

                      placement:
                        String(
                          placementId
                        ),

                      country: "ALL",

                      date: String(
                        adsterraDate
                      ),
                    },

                    update: {
                      $set: {
                        userId:
                          new mongoose.Types.ObjectId(
                            userId
                          ),

                        domain,

                        placement:
                          String(
                            placementId
                          ),

                        country:
                          "ALL",

                        date: String(
                          adsterraDate
                        ),

                        device:
                          deviceType,

                        osName,

                        browserName,

                        impressions,

                        clicks,

                        revenue,

                        ctr,

                        cpm,
                      },
                    },

                    upsert: true,
                  },
                });
              }
            } catch (err) {
              console.log(
                "LINK ERROR =>",
                link?._id,
                err?.response
                  ?.data ||
                  err.message
              );
            }
          }

          // =================================================
          // BULK SAVE
          // =================================================

          if (overallOps.length) {
            await AdsterraStats.bulkWrite(
              overallOps,
              {
                ordered: false,
              }
            );
          }

          // =================================================
          // USER REVENUE UPDATE
          // =================================================

          if (
            !user.lastRevenueMap
          ) {
            user.lastRevenueMap =
              new Map();
          }

          for (const op of overallOps) {
            const data =
              op.updateOne.update
                .$set;

            const date = String(
              data.date
            ).trim();

            const placement = String(
              data.placement
            ).trim();

            const revenueKey = `${placement}_${date}`;

            const currentRevenue =
              Number(
                data.revenue || 0
              );

            const oldRevenue =
              Number(
                (
                  user.lastRevenueMap.get(
                    revenueKey
                  ) || 0
                ).toFixed(6)
              );

            const finalCurrentRevenue =
              Number(
                currentRevenue.toFixed(
                  6
                )
              );

            // =============================================
            // SKIP SAME OR LOWER
            // =============================================

            if (
              finalCurrentRevenue <=
              oldRevenue
            ) {
              continue;
            }

            // =============================================
            // ONLY DIFFERENCE
            // =============================================

            const difference =
              Number(
                (
                  finalCurrentRevenue -
                  oldRevenue
                ).toFixed(6)
              );

            userNewRevenue +=
              difference;

            // =============================================
            // UPDATE MAP
            // =============================================

            user.lastRevenueMap.set(
              revenueKey,
              finalCurrentRevenue
            );
          }

          // =================================================
          // FINAL USER REVENUE
          // =================================================

          if (userNewRevenue > 0) {
            user.revenue = Number(
              (
                Number(
                  user.revenue || 0
                ) +
                Number(
                  userNewRevenue
                )
              ).toFixed(6)
            );
          }

          // =================================================
          // SAVE USER
          // =================================================

          await user.save();
        } catch (err) {
          console.log(
            "USER PROCESS ERROR =>",
            user?._id,
            err.message
          );
        }
      }

      // =================================================
      // FINAL RESPONSE
      // =================================================

      const finalResponse = {
        success: true,

        message:
          "All users stats updated successfully",

        totalUsers,

        totalLinks,

        totalRevenue: Number(
          totalRevenue.toFixed(6)
        ),

        start_date:
          finalStartDate,

        end_date: finalEndDate,
      };

      if (res) {
        return res
          .status(200)
          .json(finalResponse);
      }

      return finalResponse;
    } catch (error) {
      console.error(
        "ADSTERRA FETCH ERROR =>",
        error?.response?.data ||
          error.message
      );

      const errorResponse = {
        success: false,

        message:
          "Failed to fetch stats",

        error:
          error?.response?.data ||
          error.message,
      };

      if (res) {
        return res
          .status(500)
          .json(errorResponse);
      }

      return errorResponse;
    }
  };


// =========================================================
// COUNTRY STATS
// =========================================================

exports.RawfetchAndStoreCountryStats =
  async () => {
    try {
      const config =
        await Config.findOne();

      if (
        !config?.adsterraApiKey
      ) {
        return {
          success: false,
          message:
            "Adsterra API Key Missing",
        };
      }

      // TODAY DATE
      const today = new Date()
        .toISOString()
        .split("T")[0];

      // ALL USERS
      const users =
        await User.find(
          {},
          "_id"
        );

      let totalUpdated = 0;

      for (const user of users) {
        // ONLY TODAY DATA
        const stats =
          await AdsterraStats.find(
            {
              userId: user._id,
              date: today,
            },
            {
              placement: 1,
              date: 1,
            }
          );

        if (!stats.length) {
          continue;
        }

        // FIND TODAY DOC
        let existingDoc =
          await SmartLinkStats.findOne(
            {
              userId: user._id,
              device: "desktop",
              date: today,
            }
          );

        // CREATE NEW DOC
        if (!existingDoc) {
          existingDoc =
            new SmartLinkStats({
              userId: user._id,
              device: "desktop",
              osName: "",
              browserName: "",
              date: today,
              stats: [],
            });
        }

        // LOOP PLACEMENTS
        for (const item of stats) {
          try {
            const placementId =
              String(
                item.placement
              );

            // API CALL
            const response =
              await axios.get(
                "https://api3.adsterratools.com/publisher/stats.json",
                {
                  params: {
                    placement:
                      placementId,

                    start_date:
                      today,

                    finish_date:
                      today,

                    group_by:
                      "country",
                  },

                  headers: {
                    Accept:
                      "application/json",

                    "X-API-Key":
                      config.adsterraApiKey,

                    "User-Agent":
                      "Mozilla/5.0",
                  },
                }
              );

            const apiData =
              response?.data
                ?.items || [];

            if (
              !apiData.length
            ) {
              continue;
            }

            // LOOP COUNTRY DATA
            for (const row of apiData) {
              const countryName =
                row.country ||
                "ALL";

              // DIRECT VALUES
              const impressions =
                Number(
                  row.impression ||
                    0
                );

              const clicks =
                Number(
                  row.clicks || 0
                );

              const ctr =
                Number(
                  row.ctr || 0
                );

              const cpm =
                Number(
                  Number(
                    row.cpm || 0
                  ).toFixed(4)
                );

              const revenue =
                Number(
                  Number(
                    row.revenue ||
                      0
                  ).toFixed(4)
                );

              // FIND EXISTING
              const existingIndex =
                existingDoc.stats.findIndex(
                  (s) =>
                    String(
                      s.placement
                    ) ===
                      placementId &&
                    s.country ===
                      countryName &&
                    s.date === today
                );

              // NEW OBJECT
              const statData = {
                placement:
                  placementId,

                domain:
                  row.domain ||
                  "",

                country:
                  countryName,

                date: today,

                impressions,

                clicks,

                ctr,

                cpm,

                revenue,
              };

              // UPDATE
              if (
                existingIndex !== -1
              ) {
                existingDoc.stats[
                  existingIndex
                ] = statData;
              }

              // INSERT
              else {
                existingDoc.stats.push(
                  statData
                );
              }

              totalUpdated++;
            }
          } catch (
            apiError
          ) {
            console.log(
              "API ERROR:",
              apiError.message
            );
          }
        }

        // FORCE UPDATE
        existingDoc.markModified(
          "stats"
        );

        // SAVE
        await existingDoc.save();
      }

      return {
        success: true,
        message:
          "Country Stats Saved Successfully",
        totalUpdated,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.message,
      };
    }
  };
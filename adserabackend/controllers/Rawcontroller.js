const axios = require("axios");
const mongoose = require("mongoose");
const UAParser = require("ua-parser-js");
const SmartLink = require("../models/SmartLink");
const RawAdsterraStats = require("../models/RawAdsterraStats");
const RawsmartLinkStats = require("../models/RawSmartLinkStats");
const User = require("../models/authmodel");
const Config = require("../models/Config");



const Website = require("../models/Website"); // original website data
const RawWebsite = require("../models/RawWebsitemodel"); // stats save



exports.RawFetchAndStoreWebsiteStats =
  async (req = null, res = null) => {
    try {

      // ============================================
      // QUERY
      // ============================================

      const start_date =
        req?.query?.start_date || null;

      const end_date =
        req?.query?.end_date || null;

      // ============================================
      // USERS
      // ============================================

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

      // ============================================
      // DATE HELPERS
      // ============================================

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

      const currentDate =
        normalizeDate(new Date());

      const oldDate = new Date();

      oldDate.setDate(
        oldDate.getDate() - 15
      );

      const finalStartDate =
        start_date ||
        normalizeDate(oldDate);

      const finalEndDate =
        end_date || currentDate;

      // ============================================
      // TOTALS
      // ============================================

      let totalUsers = 0;

      let totalWebsites = 0;

      let totalRevenue = 0;

      // ============================================
      // LOOP USERS
      // ============================================

      for (const user of users) {

        try {

          const userId = user._id;

          // ========================================
          // PERCENT HISTORY
          // ========================================

          const percentHistory =
            Array.isArray(
              user.percentHistory
            )
              ? user.percentHistory
              : [];

          // ========================================
          // GET WEBSITES
          // ========================================

          const websites =
            await Website.find({
              userId,
            });

          if (!websites.length) {
            continue;
          }

          totalUsers += 1;

          totalWebsites +=
            websites.length;

          // ========================================
          // LOOP WEBSITE
          // ========================================

          for (const websiteData of websites) {

            try {

              const domain = String(
                websiteData.website || ""
              ).trim();

              if (!domain) {
                continue;
              }

              // ====================================
              // WEBSITE API KEY
              // ====================================

              const websiteApiKey =
                String(
                  websiteData?.apiKey || ""
                ).trim();

              if (!websiteApiKey) {

                console.log(
                  "NO API KEY FOUND =>",
                  domain
                );

                continue;
              }

              const placements =
                Array.isArray(
                  websiteData.placements
                )
                  ? websiteData.placements
                  : [];

              if (!placements.length) {
                continue;
              }

              // ====================================
              // LOOP PLACEMENTS
              // ====================================

              for (const p of placements) {

                try {

                  const placementId =
                    String(
                      p?.placementId || ""
                    ).trim();

                  if (!placementId) {
                    continue;
                  }

                  console.log(
                    "FETCHING =>",
                    placementId
                  );

                  // ====================================
                  // FETCH STATS
                  // ====================================

                  let allItems = [];

                  try {

                    console.log(
                      "USING WEBSITE API KEY =>",
                      placementId
                    );

                    const response =
                      await axios.get(
                        "https://api3.adsterratools.com/publisher/stats.json",
                        {
                          params: {
                            placement:
                              placementId,

                            start_date:
                              finalStartDate,

                            finish_date:
                              finalEndDate,

                            group_by:
                              "date",
                          },

                          headers: {
                            Accept:
                              "application/json",

                            "X-API-Key":
                              websiteApiKey,

                            "User-Agent":
                              "Mozilla/5.0",
                          },

                          timeout: 30000,
                        }
                      );

                    // ================================
                    // ITEMS
                    // ================================

                    const items =
                      Array.isArray(
                        response?.data
                          ?.items
                      )
                        ? response.data
                          .items
                        : [];

                    console.log(
                      "ITEMS =>",
                      items.length
                    );

                    if (items.length) {
                      allItems.push(
                        ...items
                      );
                    }

                  } catch (apiError) {

                    console.log(
                      "API KEY FAILED =>",
                      apiError?.response
                        ?.data ||
                      apiError.message
                    );

                    continue;
                  }

                  // ====================================
                  // REMOVE DUPLICATE DATES
                  // ====================================

                  const uniqueItemsMap =
                    new Map();

                  for (const item of allItems) {

                    const itemDate =
                      String(
                        normalizeDate(
                          item?.date
                        )
                      ).trim();

                    if (!itemDate) {
                      continue;
                    }

                    if (
                      !uniqueItemsMap.has(
                        itemDate
                      )
                    ) {
                      uniqueItemsMap.set(
                        itemDate,
                        item
                      );
                    }
                  }

                  const finalItems =
                    Array.from(
                      uniqueItemsMap.values()
                    );

                  // ====================================
                  // CHECK DATA
                  // ====================================

                  if (
                    !finalItems.length
                  ) {

                    console.log(
                      "NO DATA FOUND =>",
                      placementId
                    );

                    continue;
                  }

                  console.log(
                    "TOTAL FINAL ITEMS =>",
                    finalItems.length
                  );

                  // ====================================
                  // LOOP FINAL ITEMS
                  // ====================================

                  for (const item of finalItems) {

                    try {

                      const impressions =
                        Number(
                          item?.impression
                        ) || 0;

                      const clicks =
                        Number(
                          item?.clicks
                        ) || 0;

                      const revenue =
                        Number(
                          item?.revenue
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
                        Number(
                          item?.cpm
                        ) || 0;

                      // ============================
                      // DATE
                      // ============================

                      const adsterraDate =
                        String(
                          normalizeDate(
                            item?.date
                          )
                        ).trim();

                      if (
                        !adsterraDate
                      ) {
                        continue;
                      }

                      // ============================
                      // DEFAULT %
                      // ============================

                      let impressionPercent = 0;

                      let cpmPercent = 0;

                      // ============================
                      // MATCH HISTORY
                      // ============================

                      const matchedHistory =
                        percentHistory
                          .filter((h) => {

                            if (!h?.date) {
                              return false;
                            }

                            const historyDate =
                              new Date(
                                h.date
                              );

                            if (
                              isNaN(
                                historyDate.getTime()
                              )
                            ) {
                              return false;
                            }

                            historyDate.setUTCDate(
                              historyDate.getUTCDate() +
                              1
                            );

                            const applyDate =
                              historyDate
                                .toISOString()
                                .split("T")[0];

                            return (
                              applyDate <=
                              adsterraDate
                            );
                          })
                          .sort(
                            (a, b) =>
                              new Date(
                                b.date
                              ) -
                              new Date(
                                a.date
                              )
                          )[0];

                      // ============================
                      // APPLY %
                      // ============================

                      if (
                        matchedHistory
                      ) {

                        impressionPercent =
                          Number(
                            matchedHistory.impressionPercent
                          ) || 0;

                        cpmPercent =
                          Number(
                            matchedHistory.cpmPercent
                          ) || 0;
                      }

                      totalRevenue +=
                        revenue;

                      // ============================
                      // FIND DOC
                      // ============================

                      let existingDoc =
                        await RawWebsite.findOne(
                          {
                            userId,

                            website:
                              domain,

                            date: {
                              $eq:
                                adsterraDate,
                            },
                          }
                        );

                      // ============================
                      // CREATE DOC
                      // ============================

                      if (
                        !existingDoc
                      ) {

                        existingDoc =
                          await RawWebsite.create(
                            {
                              userId,

                              website:
                                domain,

                              status:
                                websiteData.status,

                              websiteCategory:
                                websiteData.websiteCategory,

                              showAdultAds:
                                websiteData.showAdultAds,

                              adFormat:
                                websiteData.adFormat,

                              date:
                                adsterraDate,

                              placements:
                                [],
                            }
                          );

                        console.log(
                          "NEW DATE OBJECT CREATED =>",
                          adsterraDate
                        );
                      }

                      // ============================
                      // FIND PLACEMENT
                      // ============================

                      const existingPlacement =
                        existingDoc.placements.find(
                          (pl) =>
                            String(
                              pl?.placementId ||
                              ""
                            ).trim() ===
                            placementId
                        );

                      // ============================
                      // PLACEMENT DATA
                      // ============================

                      const placementData = {
                        type:
                          p?.type || "",

                        placementId,

                        adName:
                          p?.adName || "",

                        adUrl:
                          p?.adUrl || "",

                        isActive:
                          p?.isActive ||
                          false,

                        impressions,

                        clicks,

                        ctr,

                        cpm,

                        revenue,

                        impressionPercent,

                        cpmPercent,
                      };

                      // ============================
                      // UPDATE / PUSH
                      // ============================

                      if (
                        existingPlacement
                      ) {

                        existingPlacement.type =
                          placementData.type;

                        existingPlacement.adName =
                          placementData.adName;

                        existingPlacement.adUrl =
                          placementData.adUrl;

                        existingPlacement.isActive =
                          placementData.isActive;

                        existingPlacement.impressions =
                          placementData.impressions;

                        existingPlacement.clicks =
                          placementData.clicks;

                        existingPlacement.ctr =
                          placementData.ctr;

                        existingPlacement.cpm =
                          placementData.cpm;

                        existingPlacement.revenue =
                          placementData.revenue;

                        existingPlacement.impressionPercent =
                          placementData.impressionPercent;

                        existingPlacement.cpmPercent =
                          placementData.cpmPercent;

                        console.log(
                          "PLACEMENT UPDATED =>",
                          placementId,
                          adsterraDate
                        );

                      } else {

                        existingDoc.placements.push(
                          placementData
                        );

                        console.log(
                          "NEW PLACEMENT ADDED =>",
                          placementId,
                          adsterraDate
                        );
                      }

                      // ============================
                      // SAVE
                      // ============================

                      existingDoc.markModified(
                        "placements"
                      );

                      await existingDoc.save();

                      console.log(
                        "SAVED =>",
                        placementId,
                        adsterraDate
                      );

                    } catch (itemError) {

                      console.log(
                        "ITEM ERROR =>",
                        itemError.message
                      );

                      continue;
                    }
                  }

                } catch (placementError) {

                  console.log(
                    "PLACEMENT ERROR =>",
                    placementError.message
                  );

                  continue;
                }
              }

            } catch (websiteError) {

              console.log(
                "WEBSITE ERROR =>",
                websiteError.message
              );

              continue;
            }
          }

        } catch (userError) {

          console.log(
            "USER ERROR =>",
            userError.message
          );

          continue;
        }
      }

      // ============================================
      // FINAL RESPONSE
      // ============================================

      const responseData = {
        success: true,

        message:
          "Website stats stored successfully",

        totalUsers,

        totalWebsites,

        totalRevenue:
          Number(
            totalRevenue.toFixed(6)
          ),

        start_date:
          finalStartDate,

        end_date:
          finalEndDate,
      };

      if (res) {

        return res
          .status(200)
          .json(responseData);
      }

      console.log(
        "RAW WEBSITE STATS SUCCESS"
      );

      return responseData;

    } catch (error) {

      const errorResponse = {
        success: false,

        message:
          "Failed to fetch website stats",

        error:
          error?.response?.data ||
          error.message,
      };

      if (res) {

        return res
          .status(500)
          .json(errorResponse);
      }

      console.log(
        "RAW WEBSITE STATS CRON ERROR =>",
        errorResponse.error
      );

      return errorResponse;
    }
  };

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
      // DATE HELPERS
      // =================================================

      const today = new Date();

      const normalizeDate = (
        d
      ) => {
        if (!d) {
          return today
            .toISOString()
            .split("T")[0];
        }

        if (
          typeof d === "string"
        ) {
          return d.includes("T")
            ? d.split("T")[0]
            : d;
        }

        if (
          d instanceof Date
        ) {
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
        normalizeDate(
          new Date()
        );

      const oldDate =
        new Date();

      oldDate.setDate(
        oldDate.getDate() - 15
      );

      const defaultStartDate =
        normalizeDate(
          oldDate
        );

      const defaultEndDate =
        currentDate;

      const finalStartDate =
        start_date ||
        defaultStartDate;

      const finalEndDate =
        end_date ||
        defaultEndDate;

      // =================================================
      // DEVICE INFO
      // =================================================

      const ua =
        req?.headers?.[
        "user-agent"
        ] || "Mozilla/5.0";

      const parser =
        new UAParser(ua);

      const device =
        parser.getDevice();

      const os = parser.getOS();

      const browser =
        parser.getBrowser();

      const deviceType =
        device.type ||
        "desktop";

      const deviceModel =
        device.model || "";

      const deviceVendor =
        device.vendor || "";

      const osName =
        os.name || "";

      const osVersion =
        os.version || "";

      const browserName =
        browser.name || "";

      const browserVersion =
        browser.version || "";

      // =================================================
      // TOTAL STORAGE
      // =================================================

      let totalUsers = 0;

      let totalLinks = 0;

      let totalRevenue = 0;

      // =================================================
      // LOOP USERS
      // =================================================

      for (const user of users) {
        try {
          const userId =
            user._id;

          // =============================================
          // USER PERCENT HISTORY
          // =============================================

          const percentHistory =
            Array.isArray(
              user.percentHistory
            )
              ? user.percentHistory
              : [];

          // =============================================
          // GET LINKS
          // =============================================

          const links =
            await SmartLink.find({
              userId,
            });

          if (!links.length) {
            continue;
          }

          totalUsers += 1;

          totalLinks +=
            links.length;

          // =============================================
          // STORAGE
          // =============================================

          const overallOps = [];

          const revenueTracker =
            new Set();

          // =============================================
          // LOOP LINKS
          // =============================================

          for (const link of links) {
            try {
              const placementId =
                String(
                  link.placementId ||
                  ""
                ).trim();

              if (!placementId) {
                continue;
              }

              // =========================================
              // API KEY
              // =========================================

              const apiKey =
                String(
                  link.api_key || ""
                ).trim();

              if (!apiKey) {
                console.log(
                  "NO API KEY =>",
                  link._id
                );

                continue;
              }

              // =========================================
              // APPROVED DATE
              // =========================================

              const approvedDate =
                link.approvedAt
                  ? normalizeDate(
                    link.approvedAt
                  )
                  : null;

              // =========================================
              // FINAL START DATE
              // =========================================

              let apiStartDate =
                finalStartDate;

              if (approvedDate) {
                apiStartDate =
                  approvedDate;
              }

              // =========================================
              // SAFE DOMAIN
              // =========================================

              let domain =
                link.domain ||
                link.redirectUrl ||
                link.targetUrl ||
                "";

              domain =
                typeof domain ===
                  "string" &&
                  domain.trim() !== ""
                  ? domain.trim()
                  : `placement-${placementId}`;

              // =========================================
              // DEBUG
              // =========================================

              if (
                !domain ||
                domain.trim() === ""
              ) {
                console.log(
                  "INVALID DOMAIN =>",
                  {
                    placementId,
                    linkId:
                      link._id,
                  }
                );

                continue;
              }

              // =========================================
              // API CALL
              // =========================================

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
                        apiKey,

                      "User-Agent":
                        "Mozilla/5.0",
                    },
                  }
                );

              let overallData =
                overallResponse
                  ?.data?.items || [];

              // =========================================
              // FILTER APPROVED DATE
              // =========================================

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

              // =========================================
              // SAVE STATS
              // =========================================

              for (const item of overallData) {
                try {
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
                        ).toFixed(
                          2
                        )
                      )
                      : 0;

                  const cpm =
                    Number(
                      item.cpm
                    ) || 0;

                  const adsterraDate =
                    String(
                      normalizeDate(
                        item.date
                      )
                    ).trim();

                  // =======================================
                  // DEFAULT PERCENT
                  // =======================================

                  let impressionPercent = 0;

                  let cpmPercent = 0;

                  const matchedHistory =
                    percentHistory
                      .filter(
                        (h) => {
                          if (
                            !h?.date
                          ) {
                            return false;
                          }

                          const historyDate =
                            new Date(
                              h.date
                            );

                          if (
                            isNaN(
                              historyDate.getTime()
                            )
                          ) {
                            return false;
                          }

                          historyDate.setUTCDate(
                            historyDate.getUTCDate() +
                            1
                          );

                          const applyDate =
                            historyDate
                              .toISOString()
                              .split(
                                "T"
                              )[0];

                          return (
                            applyDate <=
                            adsterraDate
                          );
                        }
                      )
                      .sort(
                        (a, b) =>
                          new Date(
                            b.date
                          ) -
                          new Date(
                            a.date
                          )
                      )[0];

                  // =======================================
                  // APPLY %
                  // =======================================

                  if (
                    matchedHistory
                  ) {
                    impressionPercent =
                      Number(
                        matchedHistory.impressionPercent
                      ) || 0;

                    cpmPercent =
                      Number(
                        matchedHistory.cpmPercent
                      ) || 0;
                  }

                  // =======================================
                  // REVENUE KEY
                  // =======================================

                  const revenueKey =
                    [
                      placementId,
                      adsterraDate,
                    ].join("|");

                  // =======================================
                  // TOTAL REVENUE
                  // =======================================

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

                  // =======================================
                  // SAVE RAW STATS
                  // =======================================

                  overallOps.push({
                    updateOne: {
                      filter: {
                        userId:
                          new mongoose.Types.ObjectId(
                            userId
                          ),

                        // IMPORTANT FIX
                        domain,

                        placement:
                          String(
                            placementId
                          ),

                        country:
                          "ALL",

                        date:
                          String(
                            adsterraDate
                          ),
                      },

                      update: {
                        $set: {
                          userId:
                            new mongoose.Types.ObjectId(
                              userId
                            ),

                          // IMPORTANT FIX
                          domain,

                          placement:
                            String(
                              placementId
                            ),

                          country:
                            "ALL",

                          date:
                            String(
                              adsterraDate
                            ),

                          // DEVICE

                          device:
                            deviceType,

                          deviceModel,

                          deviceVendor,

                          // OS

                          osName,

                          osVersion,

                          // BROWSER

                          browserName,

                          browserVersion,

                          // STATS

                          impressions,

                          clicks,

                          revenue,

                          ctr,

                          cpm,

                          // PERCENT

                          impressionPercent,

                          cpmPercent,
                        },
                      },

                      upsert: true,
                    },
                  });
                } catch (
                rowError
                ) {
                  console.log(
                    "ROW ERROR =>",
                    rowError.message
                  );
                }
              }
            } catch (err) {
              console.log(
                "LINK ERROR =>",
                err?.response
                  ?.data ||
                err.message
              );

              continue;
            }
          }

          // =============================================
          // BULK SAVE
          // =============================================

          if (
            overallOps.length > 0
          ) {
            try {
              await RawAdsterraStats.bulkWrite(
                overallOps,
                {
                  ordered: false,
                }
              );

              console.log(
                `BULK states SAVED => ${overallOps.length}`
              );
            } catch (
            bulkError
            ) {
              console.log(
                "BULK WRITE ERROR =>",
                bulkError.message
              );
            }
          }
        } catch (err) {
          console.log(
            "USER ERROR =>",
            err.message
          );

          continue;
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

        totalRevenue:
          Number(
            totalRevenue.toFixed(
              6
            )
          ),

        start_date:
          finalStartDate,

        end_date:
          finalEndDate,
      };

      if (res) {
        return res
          .status(200)
          .json(
            finalResponse
          );
      }

      return finalResponse;
    } catch (error) {
      const errorResponse = {
        success: false,

        message:
          "Failed to fetch stats",

        error:
          error?.response
            ?.data ||
          error.message,
      };

      if (res) {
        return res
          .status(500)
          .json(
            errorResponse
          );
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

      // ==================================================
      // TODAY DATE
      // ==================================================

      const today =
        new Date()
          .toISOString()
          .split("T")[0];

      // ==================================================
      // USERS
      // ==================================================

      const users =
        await User.find({});

      let totalUpdated = 0;

      // ==================================================
      // LOOP USERS
      // ==================================================

      for (const user of users) {

        // ================================================
        // TODAY %
        // ================================================

        let impressionPercent = 0;

        let cpmPercent = 0;

        const percentHistory =
          user?.percentHistory || [];

        const todayPercent =
          percentHistory.find(
            (p) => {

              const historyDate =
                new Date(
                  p.date
                )
                  .toISOString()
                  .split("T")[0];

              return (
                historyDate ===
                today
              );

            }
          );

        if (todayPercent) {

          impressionPercent =
            Number(
              todayPercent.impressionPercent ||
              0
            );

          cpmPercent =
            Number(
              todayPercent.cpmPercent ||
              0
            );

        }

        // ================================================
        // USER STATS
        // ================================================

        const stats =
          await RawAdsterraStats.find(
            {
              userId:
                user._id,

              date:
                today,
            },
            {
              placement: 1,
            }
          );

        if (!stats.length) {
          continue;
        }

        // ================================================
        // FIND DOC
        // ================================================

        let existingDoc =
          await RawsmartLinkStats.findOne(
            {
              userId:
                user._id,

              device:
                "desktop",

              date:
                today,
            }
          );

        // ================================================
        // CREATE DOC
        // ================================================

        if (!existingDoc) {

          existingDoc =
            new RawsmartLinkStats(
              {
                userId:
                  user._id,

                device:
                  "desktop",

                osName:
                  "",

                browserName:
                  "",

                date:
                  today,

                stats: [],
              }
            );

        }

        // ================================================
        // LOOP PLACEMENTS
        // ================================================

        for (const item of stats) {

          try {

            const placementId =
              String(
                item.placement
              );

            // ============================================
            // FIND SMART LINK
            // ============================================

            const smartLink =
              await SmartLink.findOne(
                {
                  placementId,
                }
              );

            if (!smartLink) {

              console.log(
                "SmartLink not found =>",
                placementId
              );

              continue;
            }

            // ============================================
            // API KEY
            // ============================================

            const apiKey =
              String(
                smartLink.api_key || ""
              ).trim();

            if (!apiKey) {

              console.log(
                "No API key found =>",
                smartLink._id
              );

              continue;
            }

            // ============================================
            // API CALL
            // ============================================

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
                      apiKey,

                    "User-Agent":
                      "Mozilla/5.0",
                  },
                }
              );

            // ============================================
            // API DATA
            // ============================================

            const apiData =
              response?.data
                ?.items || [];

            if (
              !apiData.length
            ) {

              continue;
            }

            // ============================================
            // LOOP COUNTRY DATA
            // ============================================

            for (const row of apiData) {

              try {

                const countryName =
                  row.country ||
                  "ALL";

                // ==========================================
                // VALUES
                // ==========================================

                const impressions =
                  Number(
                    row.impression || 0
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
                    row.cpm || 0
                  );

                const revenue =
                  Number(
                    (
                      (impressions /
                        1000) *
                      cpm
                    ).toFixed(4)
                  );

                // ==========================================
                // DATA
                // ==========================================

                const statData =
                {
                  placement:
                    placementId,

                  domain:
                    row.domain ||
                    "",

                  country:
                    countryName,

                  date:
                    today,

                  impressions,

                  clicks,

                  ctr,

                  cpm,

                  revenue,

                  impressionPercent,

                  cpmPercent,
                };

                // ==========================================
                // UPDATE EXISTING DOC STATS
                // ==========================================

                // ==========================================
                // UPDATE RAW SMART LINK STATS
                // ==========================================

                const existingIndex =
                  existingDoc.stats.findIndex(
                    (s) =>
                      String(s.placement) ===
                      placementId &&
                      s.country ===
                      countryName &&
                      s.date === today
                  );

                if (existingIndex !== -1) {

                  existingDoc.stats[
                    existingIndex
                  ] = statData;

                  console.log(
                    "UPDATED =>",
                    placementId,
                    countryName
                  );

                } else {

                  existingDoc.stats.push(
                    statData
                  );

                  console.log(
                    "INSERTED =>",
                    placementId,
                    countryName
                  );

                }

                totalUpdated++;

              } catch (
              rowError
              ) {

                console.log(
                  "ROW SAVE ERROR =>",
                  rowError.message
                );

              }

            }

          } catch (
          apiError
          ) {

            console.log(
              "RAW COUNTRY API ERROR =>",
              apiError.response
                ?.data ||
              apiError.message
            );

          }
        }

        // ================================================
        // FORCE UPDATE
        // ================================================

        existingDoc.markModified(
          "stats"
        );

        // ================================================
        // SAVE
        // ================================================

        await existingDoc.save();

      }

      // ==================================================
      // SUCCESS
      // ==================================================

      return {

        success: true,

        message:
          "Raw Country Stats Saved Successfully",

        totalUpdated,
      };

    } catch (error) {

      console.log(
        "RAW COUNTRY STATS ERROR =>",
        error
      );

      return {

        success: false,

        message:
          error.message,
      };

    }
  };


  
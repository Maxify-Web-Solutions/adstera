import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../redux/slice/authSlice";
import smartLinkReducer from "../redux/slice/smartLinkSlice";
import smartLinkStatsReducer from "../redux/slice/smartLinkStatsSlice";
import adsterraReducer from "../redux/slice/adsterraStatsSlice";
import withdrawalReducer from "../redux/slice/withdrawalSlice";
import adsterraPlacementReducer from "../redux/slice/adsterraPlacementSlice";
import smartlinkFilterReducer from "../redux/slice/smartlinkFilterSlice";
import websiteReducer from "../redux/slice/websiteSlice";
import calculatedWebsiteReducer from "../redux/slice/calculatedWebsiteSlice";
import contactReducer from "../redux/slice/contactSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    smartlink: smartLinkReducer,
    smartlinkStats: smartLinkStatsReducer, // 🔥 rename for clarity
    adsterra: adsterraReducer,
    withdrawal: withdrawalReducer,
    adsterraPlacements: adsterraPlacementReducer,
    smartlinkFilter: smartlinkFilterReducer, // 🔥 rename for clarity
    website: websiteReducer,
    calculatedWebsite: calculatedWebsiteReducer,
    contact: contactReducer,


  },

  devTools: process.env.NODE_ENV !== "production", // ✅ best practice

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // ✅ avoids date / API issues
    }),
});
import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../redux/slice/authSlice";
import smartLinkReducer from "../redux/slice/smartLinkSlice";
import smartLinkStatsReducer from "../redux/slice/smartLinkStatsSlice";
import adsterraReducer from "../redux/slice/adsterraStatsSlice";
import withdrawalReducer from "../redux/slice/withdrawalSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    smartlink: smartLinkReducer,
    smartlinkStats: smartLinkStatsReducer, // 🔥 rename for clarity
    adsterra: adsterraReducer,
     withdrawal: withdrawalReducer,
  },

  devTools: process.env.NODE_ENV !== "production", // ✅ best practice

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // ✅ avoids date / API issues
    }),
});
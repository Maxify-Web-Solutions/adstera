import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../redux/slice/authSlice";
import smartLinkReducer from "../redux/slice/smartLinkSlice";
import smartLinkStatsReducer from "../redux/slice/smartLinkStatsSlice";
import adsterraReducer from "../redux/slice/adsterraStatsSlice";

export const store = configureStore({

  reducer: {

    auth: authReducer,

    smartlink: smartLinkReducer,
    stats: smartLinkStatsReducer,
    adsterra: adsterraReducer,


  },

});
import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../redux/slice/authSlice";
import smartLinkReducer from "../redux/slice/smartLinkSlice";

export const store = configureStore({

  reducer: {

    auth: authReducer,

    smartlink: smartLinkReducer,

  },

});
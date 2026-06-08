// redux/slice/calculatedWebsiteSlice.js

import {
    createSlice,
    createAsyncThunk,
} from "@reduxjs/toolkit";

import { api } from "./axiosConfig";

// ======================================================
// GET CALCULATED WEBSITE STATS
// ======================================================

export const getCalculatedWebsiteStats =
    createAsyncThunk(
        "calculatedWebsite/getCalculatedWebsiteStats",

        async (
            {
                start_date,
                end_date,
                website,
            } = {},
            thunkAPI
        ) => {
            try {

                const params = {};

                if (start_date) {
                    params.start_date =
                        start_date;
                }

                if (end_date) {
                    params.end_date =
                        end_date;
                }

                if (website) {
                    params.website =
                        website;
                }

                const response =
                    await api.get(
                        "/calculated-website",
                        {
                            params,
                        }
                    );

                return response.data;

            } catch (error) {

                return thunkAPI.rejectWithValue(
                    error?.response?.data || {
                        message:
                            "Failed to fetch calculated website stats",
                    }
                );
            }
        }
    );

// ======================================================
// INITIAL STATE
// ======================================================

const initialState = {

    loading: false,

    success: false,

    error: null,

    totalStats: 0,

    totalPlacements: 0,

    totals: {
        impressions: 0,
        clicks: 0,
        ctr: 0,
        revenue: 0,
    },

    data: [],
};

// ======================================================
// SLICE
// ======================================================

const calculatedWebsiteSlice =
    createSlice({
        name:
            "calculatedWebsite",

        initialState,

        reducers: {

            clearCalculatedWebsiteState:
                (state) => {

                    state.loading =
                        false;

                    state.success =
                        false;

                    state.error =
                        null;
                },
        },

        extraReducers:
            (builder) => {

                builder

                    // ======================================
                    // PENDING
                    // ======================================

                    .addCase(
                        getCalculatedWebsiteStats.pending,

                        (state) => {

                            state.loading =
                                true;

                            state.success =
                                false;

                            state.error =
                                null;
                        }
                    )

                    // ======================================
                    // FULFILLED
                    // ======================================

                    .addCase(
                        getCalculatedWebsiteStats.fulfilled,

                        (state, action) => {

                            state.loading =
                                false;

                            state.success =
                                true;

                            state.error =
                                null;

                            state.totalStats =
                                action.payload
                                    ?.totalStats || 0;

                            state.totalPlacements =
                                action.payload
                                    ?.totalPlacements || 0;

                            state.totals =
                                action.payload
                                    ?.totals || {
                                    impressions: 0,
                                    clicks: 0,
                                    ctr: 0,
                                    revenue: 0,
                                };

                            state.data =
                                action.payload
                                    ?.data || [];
                        }
                    )

                    // ======================================
                    // REJECTED
                    // ======================================

                    .addCase(
                        getCalculatedWebsiteStats.rejected,

                        (state, action) => {

                            state.loading =
                                false;

                            state.success =
                                false;

                            state.error =
                                action.payload
                                    ?.message ||
                                "Something went wrong";
                        }
                    );
            },
    });

// ======================================================
// EXPORTS
// ======================================================

export const {
    clearCalculatedWebsiteState,
} =
    calculatedWebsiteSlice.actions;

export default
    calculatedWebsiteSlice.reducer;
import {
    createSlice,
    createAsyncThunk,
} from "@reduxjs/toolkit";
import { api } from "./axiosConfig";


// =====================================
// API
// =====================================

const API = "/api/stats";

// =====================================
// GET SMARTLINK STATS
// =====================================

export const getSmartLinkStats =
    createAsyncThunk(
        "smartlinkFilter/getSmartLinkStats",

        async (
            queryParams,
            { rejectWithValue }
        ) => {
            try {
                const response =
                    await api.get(
                        `/smartlink/smartlink-stats`,
                        {
                            params: queryParams,
                            withCredentials: true,
                        }
                    );

                return response.data;
            } catch (error) {
                return rejectWithValue(
                    error.response?.data || {
                        success: false,
                        message:
                            "Something went wrong",
                    }
                );
            }
        }
    );

// =====================================
// INITIAL STATE
// =====================================

const initialState = {
    loading: false,
    success: false,
    error: null,

    // 📊 DATA
    data: [],

    // 📄 PAGINATION
    page: 1,
    limit: 20,
    totalPages: 0,
    totalRecords: 0,

    // 🎯 FILTERS
    filters: {
        start_date: null,
        end_date: null,
        placement: null,
        country: "ALL",
    },

    // 💰 TOTALS
    totals: {
        totalImpressions: 0,
        totalClicks: 0,
        totalRevenue: 0,
        ctr: 0,
        cpm: 0,
    },

    // 🌍 COUNTRY SUMMARY
    countrySummary: [],
};

// =====================================
// SLICE
// =====================================

const smartlinkFilterSlice =
    createSlice({
        name: "smartlinkFilter",

        initialState,

        reducers: {
            // ✅ MANUAL FILTER UPDATE
            setFilters: (
                state,
                action
            ) => {
                state.filters = {
                    ...state.filters,
                    ...action.payload,
                };
            },

            // ✅ RESET FILTERS
            resetFilters: (
                state
            ) => {
                state.filters = {
                    start_date: null,
                    end_date: null,
                    placement: null,
                    country: "ALL",
                };
            },

            // ✅ RESET ALL
            resetStats: (state) => {
                state.loading = false;
                state.success = false;
                state.error = null;

                state.data = [];

                state.page = 1;
                state.limit = 20;
                state.totalPages = 0;
                state.totalRecords = 0;

                state.filters = {
                    start_date: null,
                    end_date: null,
                    placement: null,
                    country: "ALL",
                };

                state.totals = {
                    totalImpressions: 0,
                    totalClicks: 0,
                    totalRevenue: 0,
                    ctr: 0,
                    cpm: 0,
                };

                state.countrySummary = [];
            },
        },

        extraReducers: (
            builder
        ) => {
            builder

                // =====================================
                // GET SMARTLINK STATS
                // =====================================

                .addCase(
                    getSmartLinkStats.pending,
                    (state) => {
                        state.loading = true;
                        state.error = null;
                    }
                )

                .addCase(
                    getSmartLinkStats.fulfilled,
                    (state, action) => {
                        state.loading = false;
                        state.success = true;

                        const payload =
                            action.payload;

                        if (
                            payload?.success
                        ) {
                            // 📊 DATA
                            state.data =
                                payload.data ||
                                [];

                            // 📄 PAGINATION
                            state.page =
                                payload.page ||
                                1;

                            state.limit =
                                payload.limit ||
                                20;

                            state.totalPages =
                                payload.totalPages ||
                                0;

                            state.totalRecords =
                                payload.totalRecords ||
                                0;

                            // 🎯 FILTERS
                            state.filters =
                                payload.filters || {
                                    start_date:
                                        null,
                                    end_date:
                                        null,
                                    placement:
                                        null,
                                    country:
                                        "ALL",
                                };

                            // 💰 TOTALS
                            state.totals = {
                                totalImpressions:
                                    Number(
                                        payload
                                            .totals
                                            ?.totalImpressions ||
                                        0
                                    ),

                                totalClicks:
                                    Number(
                                        payload
                                            .totals
                                            ?.totalClicks ||
                                        0
                                    ),

                                totalRevenue:
                                    Number(
                                        payload
                                            .totals
                                            ?.totalRevenue ||
                                        0
                                    ),

                                ctr: Number(
                                    payload
                                        .totals
                                        ?.ctr || 0
                                ),

                                cpm: Number(
                                    payload
                                        .totals
                                        ?.cpm || 0
                                ),
                            };

                            // 🌍 COUNTRY SUMMARY
                            state.countrySummary =
                                payload.countrySummary ||
                                [];
                        } else {
                            state.error =
                                payload?.message ||
                                "Failed to fetch stats";
                        }
                    }
                )

                .addCase(
                    getSmartLinkStats.rejected,
                    (state, action) => {
                        state.loading = false;
                        state.success = false;

                        state.error =
                            action.payload
                                ?.message ||
                            "Failed to fetch smartlink stats";
                    }
                );
        },
    });

// =====================================
// EXPORT ACTIONS
// =====================================

export const {
    setFilters,
    resetFilters,
    resetStats,
} =
    smartlinkFilterSlice.actions;

// =====================================
// EXPORT REDUCER
// =====================================

export default
    smartlinkFilterSlice.reducer;
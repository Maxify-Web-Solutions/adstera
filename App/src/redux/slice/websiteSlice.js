// reducer/slice/websiteSlice.js

import {
    createSlice,
    createAsyncThunk,
} from "@reduxjs/toolkit";

import { api } from "./axiosConfig";

const initialState = {
    websites: [],
    website: null,

    // =====================================
    // CALCULATED WEBSITE
    // =====================================

    calculatedWebsiteStats: [],
    calculatedWebsiteTotals: null,

    loading: false,
    error: null,
};

// ======================================================
// CREATE WEBSITE
// ======================================================

export const createWebsite =
    createAsyncThunk(
        "website/createWebsite",

        async (
            data,
            { rejectWithValue }
        ) => {
            try {

                const res =
                    await api.post(
                        "/website/create",
                        data
                    );

                return res.data;

            } catch (error) {

                return rejectWithValue(
                    error.response.data
                );
            }
        }
    );

// ======================================================
// GET ALL WEBSITES
// ======================================================

export const getAllWebsites =
    createAsyncThunk(
        "website/getAllWebsites",

        async (
            _,
            { rejectWithValue }
        ) => {
            try {

                const res =
                    await api.get(
                        "/website/all"
                    );

                return res.data;

            } catch (error) {

                return rejectWithValue(
                    error.response.data
                );
            }
        }
    );

// ======================================================
// GET SINGLE WEBSITE
// ======================================================

export const getSingleWebsite =
    createAsyncThunk(
        "website/getSingleWebsite",

        async (
            id,
            { rejectWithValue }
        ) => {
            try {

                const res =
                    await api.get(
                        `/website/${id}`
                    );

                return res.data;

            } catch (error) {

                return rejectWithValue(
                    error.response.data
                );
            }
        }
    );

// ======================================================
// GET CALCULATED WEBSITE STATS
// ======================================================

export const getCalculatedWebsiteStats =
    createAsyncThunk(
        "website/getCalculatedWebsiteStats",

        async (
            params = {},
            { rejectWithValue }
        ) => {
            try {

                const query =
                    new URLSearchParams(
                        params
                    ).toString();

                const res =
                    await api.get(
                        `/calculated-website${query ? `?${query}` : ""
                        }`
                    );

                return res.data;

            } catch (error) {

                return rejectWithValue(
                    error.response.data
                );
            }
        }
    );

// ======================================================
// SLICE
// ======================================================

const websiteSlice =
    createSlice({
        name: "website",

        initialState,

        reducers: {

            // =====================================
            // CLEAR ERROR
            // =====================================

            clearWebsiteError: (
                state
            ) => {
                state.error = null;
            },

            // =====================================
            // CLEAR SINGLE WEBSITE
            // =====================================

            clearSingleWebsite: (
                state
            ) => {
                state.website = null;
            },

            // =====================================
            // CLEAR CALCULATED
            // =====================================

            clearCalculatedWebsiteStats:
                (state) => {

                    state.calculatedWebsiteStats =
                        [];

                    state.calculatedWebsiteTotals =
                        null;
                },
        },

        extraReducers: (
            builder
        ) => {

            builder

                // =================================
                // CREATE WEBSITE
                // =================================

                .addCase(
                    createWebsite.pending,
                    (state) => {
                        state.loading =
                            true;
                    }
                )

                .addCase(
                    createWebsite.fulfilled,
                    (
                        state,
                        action
                    ) => {
                        state.loading =
                            false;

                        state.websites.unshift(
                            action.payload.data
                        );
                    }
                )

                .addCase(
                    createWebsite.rejected,
                    (
                        state,
                        action
                    ) => {
                        state.loading =
                            false;

                        state.error =
                            action.payload?.message;
                    }
                )

                // =================================
                // GET ALL WEBSITE
                // =================================

                .addCase(
                    getAllWebsites.pending,
                    (state) => {
                        state.loading =
                            true;
                    }
                )

                .addCase(
                    getAllWebsites.fulfilled,
                    (
                        state,
                        action
                    ) => {
                        state.loading =
                            false;

                        state.websites =
                            action.payload.data;
                    }
                )

                .addCase(
                    getAllWebsites.rejected,
                    (
                        state,
                        action
                    ) => {
                        state.loading =
                            false;

                        state.error =
                            action.payload?.message;
                    }
                )

                // =================================
                // GET SINGLE WEBSITE
                // =================================

                .addCase(
                    getSingleWebsite.pending,
                    (state) => {
                        state.loading =
                            true;
                    }
                )

                .addCase(
                    getSingleWebsite.fulfilled,
                    (
                        state,
                        action
                    ) => {
                        state.loading =
                            false;

                        state.website =
                            action.payload.data;
                    }
                )

                .addCase(
                    getSingleWebsite.rejected,
                    (
                        state,
                        action
                    ) => {
                        state.loading =
                            false;

                        state.error =
                            action.payload?.message;
                    }
                )

                // =================================
                // GET CALCULATED WEBSITE STATS
                // =================================

                .addCase(
                    getCalculatedWebsiteStats.pending,
                    (state) => {
                        state.loading =
                            true;
                    }
                )

                .addCase(
                    getCalculatedWebsiteStats.fulfilled,
                    (
                        state,
                        action
                    ) => {

                        state.loading =
                            false;

                        state.calculatedWebsiteStats =
                            action.payload.data;

                        state.calculatedWebsiteTotals =
                            action.payload.totals;
                    }
                )

                .addCase(
                    getCalculatedWebsiteStats.rejected,
                    (
                        state,
                        action
                    ) => {

                        state.loading =
                            false;

                        state.error =
                            action.payload?.message;
                    }
                );
        },
    });

// ======================================================
// EXPORTS
// ======================================================

export const {
    clearWebsiteError,
    clearSingleWebsite,
    clearCalculatedWebsiteStats,
} = websiteSlice.actions;

export default websiteSlice.reducer;
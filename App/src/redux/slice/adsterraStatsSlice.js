import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "./axiosConfig";

// ======================================================
// 🚀 FETCH + STORE (API CALL)
// ======================================================

export const fetchAdsterraStats = createAsyncThunk(
    "adsterra/fetchStats",
    async (params = {}, { rejectWithValue }) => {
        try {
            const { data } = await api.get(
                "/adsterra/fetch",
                {
                    params,
                }
            );

            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || {
                    message: error.message,
                }
            );
        }
    }
);

// ======================================================
// 📊 GET DATA FROM DB
// ======================================================

export const getAdsterraStats = createAsyncThunk(
    "adsterra/getStats",
    async (params = {}, { rejectWithValue }) => {
        try {
            const { data } = await api.get(
                "/adsterra/stats",
                {
                    params,
                }
            );

            console.log(
                "ADSTERRA RESPONSE =>",
                data
            );

            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || {
                    message: error.message,
                }
            );
        }
    }
);

// ======================================================
// 🎯 SLICE
// ======================================================

const adsterraSlice = createSlice({
    name: "adsterra",

    initialState: {
        // ========================
        // LOADING
        // ========================

        loading: false,
        fetchLoading: false,

        // ========================
        // OVERALL DATA
        // ========================

        data: [],
        totals: {},

        // ========================
        // COUNTRY DATA
        // ========================

        countryData: [],
        countryTotals: {},

        // ========================
        // PAGINATION
        // ========================

        page: 1,
        totalPages: 1,
        totalRecords: 0,

        // ========================
        // STATUS
        // ========================

        error: null,
        success: false,
    },

    reducers: {
        // ========================
        // CLEAR ERROR
        // ========================

        clearAdsterraError: (state) => {
            state.error = null;
        },

        // ========================
        // RESET
        // ========================

        resetAdsterra: (state) => {
            state.loading = false;
            state.fetchLoading = false;

            state.data = [];
            state.totals = {};

            state.countryData = [];
            state.countryTotals = {};

            state.page = 1;
            state.totalPages = 1;
            state.totalRecords = 0;

            state.error = null;
            state.success = false;
        },
    },

    extraReducers: (builder) => {
        builder

            // ==================================================
            // 🚀 FETCH API
            // ==================================================

            .addCase(
                fetchAdsterraStats.pending,
                (state) => {
                    state.fetchLoading = true;
                    state.error = null;
                    state.success = false;
                }
            )

            .addCase(
                fetchAdsterraStats.fulfilled,
                (state) => {
                    state.fetchLoading = false;
                    state.success = true;
                }
            )

            .addCase(
                fetchAdsterraStats.rejected,
                (state, action) => {
                    state.fetchLoading = false;

                    state.error =
                        action.payload?.message ||
                        "Fetch failed";
                }
            )

            // ==================================================
            // 📊 GET DB DATA
            // ==================================================

            .addCase(
                getAdsterraStats.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                getAdsterraStats.fulfilled,
                (state, action) => {
                    state.loading = false;


                    // =====================================
                    // OVERALL
                    // =====================================

                    state.data =
                        action.payload?.overall
                            ?.data || [];

                    state.totals =
                        action.payload?.overall
                            ?.totals || {};

                    // =====================================
                    // COUNTRY
                    // =====================================

                    state.countryData =
                        action.payload?.country
                            ?.data || [];

                    state.countryTotals =
                        action.payload?.country
                            ?.totals || {};

                    // =====================================
                    // PAGINATION
                    // =====================================

                    state.page =
                        action.payload?.pagination
                            ?.page || 1;

                    state.totalPages =
                        action.payload?.pagination
                            ?.totalPages || 1;

                    state.totalRecords =
                        action.payload?.pagination
                            ?.totalRecords || 0;

                    // =====================================
                    // SUCCESS
                    // =====================================

                    state.success = true;
                }
            )

            .addCase(
                getAdsterraStats.rejected,
                (state, action) => {
                    state.loading = false;

                    state.error =
                        action.payload?.message ||
                        "Failed to load stats";
                }
            );
    },
});

// ======================================================
// EXPORTS
// ======================================================

export const {
    clearAdsterraError,
    resetAdsterra,
} = adsterraSlice.actions;

export default adsterraSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "./axiosConfig";

// 🚀 FETCH + STORE (API CALL)
export const fetchAdsterraStats = createAsyncThunk(
    "adsterra/fetchStats",
    async (params = {}, { rejectWithValue }) => {
        try {
            const { data } = await api.get("/adsterra/fetch", {
                params,
            });

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

// 📊 GET DB DATA
export const getAdsterraStats = createAsyncThunk(
    "adsterra/getStats",
    async (params = {}, { rejectWithValue }) => {
        try {
            const { data } = await api.get("/adsterra/stats", {
                params,
            });

            console.log("ADSTERRA STATS =>", data);

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

// 🎯 SLICE
const adsterraSlice = createSlice({
    name: "adsterra",

    initialState: {
        loading: false,
        fetchLoading: false,

        // table data
        data: [],

        // totals
        totals: {
            totalImpressions: 0,
            totalClicks: 0,
            totalRevenue: 0,
            ctr: 0,
            cpm: 0,
        },

        // country summary
        countrySummary: [],

        // pagination
        page: 1,
        limit: 20,
        totalPages: 1,
        totalRecords: 0,

        // filters
        filters: {
            start_date: null,
            end_date: null,
            placement: null,
            country: "ALL",
        },

        error: null,
        success: false,
    },

    reducers: {
        clearAdsterraError: (state) => {
            state.error = null;
        },

        resetAdsterra: (state) => {
            state.loading = false;
            state.fetchLoading = false;

            state.data = [];

            state.totals = {
                totalImpressions: 0,
                totalClicks: 0,
                totalRevenue: 0,
                ctr: 0,
                cpm: 0,
            };

            state.countrySummary = [];

            state.page = 1;
            state.limit = 20;
            state.totalPages = 1;
            state.totalRecords = 0;

            state.filters = {
                start_date: null,
                end_date: null,
                placement: null,
                country: "ALL",
            };

            state.error = null;
            state.success = false;
        },
    },

    extraReducers: (builder) => {
        builder

            // 🚀 FETCH API
            .addCase(fetchAdsterraStats.pending, (state) => {
                state.fetchLoading = true;
                state.error = null;
                state.success = false;
            })

            .addCase(fetchAdsterraStats.fulfilled, (state, action) => {
                state.fetchLoading = false;
                state.success = action.payload?.success || true;
            })

            .addCase(fetchAdsterraStats.rejected, (state, action) => {
                state.fetchLoading = false;

                state.error =
                    action.payload?.message ||
                    "Fetch failed";

                state.success = false;
            })

            // 📊 GET STATS
            .addCase(getAdsterraStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getAdsterraStats.fulfilled, (state, action) => {
                state.loading = false;

                // ✅ main data
                state.data = action.payload?.data || [];

                // ✅ totals
                state.totals =
                    action.payload?.totals || {
                        totalImpressions: 0,
                        totalClicks: 0,
                        totalRevenue: 0,
                        ctr: 0,
                        cpm: 0,
                    };

                // ✅ country summary
                state.countrySummary =
                    action.payload?.countrySummary || [];

                // ✅ pagination
                state.page = action.payload?.page || 1;

                state.limit =
                    action.payload?.limit || 20;

                state.totalPages =
                    action.payload?.totalPages || 1;

                state.totalRecords =
                    action.payload?.totalRecords || 0;

                // ✅ filters
                state.filters =
                    action.payload?.filters || {
                        start_date: null,
                        end_date: null,
                        placement: null,
                        country: "ALL",
                    };

                state.success =
                    action.payload?.success || true;
            })

            .addCase(getAdsterraStats.rejected, (state, action) => {
                state.loading = false;

                state.error =
                    action.payload?.message ||
                    "Failed to load stats";

                state.success = false;
            });
    },
});

export const {
    clearAdsterraError,
    resetAdsterra,
} = adsterraSlice.actions;

export default adsterraSlice.reducer;
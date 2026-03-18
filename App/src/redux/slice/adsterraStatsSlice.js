import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "./axiosConfig";

// 🔥 FETCH & STORE (API HIT)
export const fetchAdsterraStats = createAsyncThunk(
    "adsterra/fetchStats",
    async (params, { rejectWithValue }) => {
        try {
            const res = await api.get("/adsterra/fetch", {
                params,
            });

            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data || { message: "Something went wrong" }
            );
        }
    }
);

// 🔥 GET FROM DB
export const getAdsterraStats = createAsyncThunk(
    "adsterra/getStats",
    async (params, { rejectWithValue }) => {
        try {
            const res = await api.get("/adsterra/stats", {
                params,
            });

            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data || { message: "Something went wrong" }
            );
        }
    }
);

const adsterraSlice = createSlice({
    name: "adsterra",
    initialState: {
        loading: false,
        error: null,

        // API fetch data
        apiData: [],
        apiTotal: 0,

        // DB data
        stats: [],
        totals: {
            totalImpressions: 0,
            totalClicks: 0,
            totalRevenue: 0,
        },
        totalRecords: 0,
        page: 1,
    },

    reducers: {
        clearAdsterraState: (state) => {
            state.loading = false;
            state.error = null;
            state.apiData = [];
            state.stats = [];
            state.totals = {
                totalImpressions: 0,
                totalClicks: 0,
                totalRevenue: 0,
            };
        },
    },

    extraReducers: (builder) => {
        builder

            // =========================
            // 🚀 FETCH & STORE
            // =========================
            .addCase(fetchAdsterraStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdsterraStats.fulfilled, (state, action) => {
                state.loading = false;
                state.apiData = action.payload.data || [];
                state.apiTotal = action.payload.total || 0;
            })
            .addCase(fetchAdsterraStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Fetch failed";
            })

            // =========================
            // 📊 GET FROM DB
            // =========================
            .addCase(getAdsterraStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAdsterraStats.fulfilled, (state, action) => {
                state.loading = false;

                state.stats = action.payload.data || [];
                state.totals = action.payload.totals || {};
                state.totalRecords = action.payload.totalRecords || 0;
                state.page = action.payload.page || 1;
            })
            .addCase(getAdsterraStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "DB fetch failed";
            });
    },
});

export const { clearAdsterraState } = adsterraSlice.actions;

export default adsterraSlice.reducer;
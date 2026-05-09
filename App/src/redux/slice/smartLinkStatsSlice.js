import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ==============================
// ✅ API BASE URL
// ==============================
const API = "/api/stats"; // apne backend route ke hisab se change kar lena

// ==============================
// ✅ THUNKS
// ==============================

// 👉 Track Impression
export const trackImpression = createAsyncThunk(
    "stats/trackImpression",
    async (linkId, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${API}/impression`, { linkId });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// 👉 Get Smart Link Stats (with filters)
export const getSmartLinkStats = createAsyncThunk(
    "stats/getSmartLinkStats",
    async (queryParams, { rejectWithValue }) => {
        try {
            // queryParams can be { start_date, end_date, placement, country, page, limit }
            const res = await axios.get(`${API}/smartlink-stats`, { 
                params: queryParams 
            });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// ==============================
// ✅ SLICE
// ==============================
const smartLinkStatsSlice = createSlice({
    name: "smartLinkStats",
    initialState: {
        loading: false,
        success: false,
        error: null,
        
        // 📊 Stats Data
        data: [],           // main stats array (daily/weekly data)
        
        // 📄 Pagination
        page: 1,
        limit: 20,
        totalPages: 0,
        totalRecords: 0,
        
        // 🎯 Filters Applied
        filters: {
            start_date: null,
            end_date: null,
            placement: null,
            country: "ALL",
        },
        
        // 💰 Totals Summary
        totals: {
            totalImpressions: 0,
            totalClicks: 0,
            totalRevenue: 0,
            ctr: 0,      // Click Through Rate (%)
            cpm: 0,      // Cost Per Mille (per 1000 impressions)
        },
        
        // 🌍 Country wise breakdown
        countrySummary: [],
    },
    reducers: {
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
        
        // Manual filter update (without API call)
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        
        // Reset filters only
        resetFilters: (state) => {
            state.filters = {
                start_date: null,
                end_date: null,
                placement: null,
                country: "ALL",
            };
        },
    },
    extraReducers: (builder) => {
        builder

            // ================= TRACK IMPRESSION =================
            .addCase(trackImpression.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(trackImpression.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(trackImpression.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ================= GET SMART LINK STATS =================
            .addCase(getSmartLinkStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSmartLinkStats.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                
                const { payload } = action;
                
                if (payload?.success) {
                    // 📄 Pagination
                    state.page = payload.page || 1;
                    state.limit = payload.limit || 20;
                    state.totalPages = payload.totalPages || 0;
                    state.totalRecords = payload.totalRecords || 0;
                    
                    // 🎯 Filters
                    if (payload.filters) {
                        state.filters = payload.filters;
                    }
                    
                    // 💰 Totals
                    if (payload.totals) {
                        state.totals = {
                            totalImpressions: payload.totals.totalImpressions || 0,
                            totalClicks: payload.totals.totalClicks || 0,
                            totalRevenue: payload.totals.totalRevenue || 0,
                            ctr: payload.totals.ctr || 0,
                            cpm: payload.totals.cpm || 0,
                        };
                    }
                    
                    // 🌍 Country Summary
                    state.countrySummary = payload.countrySummary || [];
                    
                    // 📊 Main Stats Data
                    state.data = payload.data || [];
                } else {
                    state.error = payload?.message || "Failed to fetch stats";
                }
            })
            .addCase(getSmartLinkStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to fetch smartlink stats";
            });
    },
});

// ✅ EXPORT ALL ACTIONS (Yeh sabse important hai)
export const { resetStats, setFilters, resetFilters } = smartLinkStatsSlice.actions;

// ✅ EXPORT REDUCER AS DEFAULT
export default smartLinkStatsSlice.reducer;
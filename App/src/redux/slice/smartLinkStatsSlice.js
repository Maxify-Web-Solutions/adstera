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

// 👉 Get Stats
export const getSmartLinkStats = createAsyncThunk(
    "stats/getSmartLinkStats",
    async (linkId, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${API}/${linkId}`);
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
        stats: [],
        total: null,
        success: false,
        error: null,
    },
    reducers: {
        resetStats: (state) => {
            state.loading = false;
            state.stats = [];
            state.total = null;
            state.success = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder

            // ================= TRACK IMPRESSION =================
            .addCase(trackImpression.pending, (state) => {
                state.loading = true;
            })
            .addCase(trackImpression.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(trackImpression.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ================= GET STATS =================
            .addCase(getSmartLinkStats.pending, (state) => {
                state.loading = true;
            })
            .addCase(getSmartLinkStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload.data;
                state.total = action.payload.total;
                state.success = true;
            })
            .addCase(getSmartLinkStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetStats } = smartLinkStatsSlice.actions;
export default smartLinkStatsSlice.reducer;
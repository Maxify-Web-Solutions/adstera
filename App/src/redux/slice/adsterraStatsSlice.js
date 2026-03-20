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
                error.response?.data || { message: error.message }
            );
        }
    }
);
 
// 📊 GET FROM DB
export const getAdsterraStats = createAsyncThunk(
    "adsterra/getStats",
    async (params = {}, { rejectWithValue }) => {
        try {
            const { data } = await api.get("/adsterra/stats", {
                params,
            });
            console.log(data,"qwertyu");

            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: error.message }
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
        data: [],
        totals: {},
        page: 1,
        totalRecords: 0,
        error: null,
        success: false,
    },
    reducers: {
        clearAdsterraError: (state) => {
            state.error = null;
        },
        resetAdsterra: (state) => {
            state.data = [];
            state.totals = {};
            state.page = 1;
            state.totalRecords = 0;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder

            // 🔄 FETCH API
            .addCase(fetchAdsterraStats.pending, (state) => {
                state.fetchLoading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(fetchAdsterraStats.fulfilled, (state) => {
                state.fetchLoading = false;
                state.success = true;
            })
            .addCase(fetchAdsterraStats.rejected, (state, action) => {
                state.fetchLoading = false;
                state.error = action.payload?.message || "Fetch failed";
            })

            // 📊 GET DB DATA
            .addCase(getAdsterraStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAdsterraStats.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload?.data || [];
                state.totals = action.payload?.totals || {};
                state.page = action.payload?.page || 1;
                state.totalRecords = action.payload?.totalRecords || 0;
            })
            .addCase(getAdsterraStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to load stats";
            });
    },
});

export const { clearAdsterraError, resetAdsterra } =
    adsterraSlice.actions;

export default adsterraSlice.reducer;
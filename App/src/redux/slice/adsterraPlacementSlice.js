import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "./axiosConfig";

// 🔥 Async thunk (API call)
export const fetchPlacements = createAsyncThunk(
  "adsterra/fetchPlacements",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/adsterra/placements"); 
      // 👆 apna backend route yaha adjust kar lena

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

const adsterraPlacementSlice = createSlice({
  name: "adsterraPlacements",
  initialState: {
    loading: false,
    placements: [],
    total: 0,
    error: null,
    success: false,
  },

  reducers: {
    clearPlacementState: (state) => {
      state.error = null;
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchPlacements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchPlacements.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.placements = action.payload?.data || [];
        state.total = action.payload?.total || 0;
      })

      .addCase(fetchPlacements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { clearPlacementState } = adsterraPlacementSlice.actions;

export default adsterraPlacementSlice.reducer;
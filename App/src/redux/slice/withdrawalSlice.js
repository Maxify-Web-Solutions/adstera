import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "./axiosConfig";
import { toast } from "react-toastify";

// =============================
// 🔥 1. SEND OTP
// =============================
export const sendWithdrawalOtp = createAsyncThunk(
  "withdraw/sendOtp",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/withdrawal/send-otp", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "OTP failed" });
    }
  }
);

// =============================
// 🔥 2. CREATE WITHDRAWAL
// =============================
export const createWithdrawal = createAsyncThunk(
  "withdraw/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/withdrawal/create", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Withdrawal failed" }
      );
    }
  }
);

// =============================
// 🔥 3. GET MY WITHDRAWALS
// =============================
export const getMyWithdrawals = createAsyncThunk(
  "withdraw/getMy",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/withdrawal/my");
      return res.data.withdrawals;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Fetch failed" }
      );
    }
  }
);

// =============================
// 🔥 SLICE
// =============================
const withdrawalSlice = createSlice({
  name: "withdrawal",
  initialState: {
    loading: false,
    error: null,
    success: null,
    withdrawals: [],
    otpSent: false,
  },

  reducers: {
    clearWithdrawalState: (state) => {
      state.error = null;
      state.success = null;
    },
  },

  extraReducers: (builder) => {
    builder;

    // ================= OTP =================
    builder
      .addCase(sendWithdrawalOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendWithdrawalOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otpSent = true;
        state.success = action.payload.message;

        toast.success(action.payload.message || "OTP sent successfully");
      })
      .addCase(sendWithdrawalOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;

        toast.error(action.payload?.message || "OTP failed");
      });

    // ================= CREATE =================
    builder
      .addCase(createWithdrawal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWithdrawal.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.otpSent = false;

        // ✅ add latest withdrawal on top
        state.withdrawals.unshift(action.payload.withdrawal);

        toast.success(action.payload.message || "Withdrawal successful");
      })
      .addCase(createWithdrawal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;

        toast.error(action.payload?.message || "Withdrawal failed");
      });

    // ================= GET =================
    builder
      .addCase(getMyWithdrawals.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyWithdrawals.fulfilled, (state, action) => {
        state.loading = false;
        state.withdrawals = action.payload;
      })
      .addCase(getMyWithdrawals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;

        toast.error(action.payload?.message || "Failed to load withdrawals");
      });
  },
});

export const { clearWithdrawalState } = withdrawalSlice.actions;
export default withdrawalSlice.reducer;
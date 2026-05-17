import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "./axiosConfig";
import { toast } from "react-toastify";

/* =========================
   REGISTER USER (SEND OTP)
========================= */
export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ name, email, mobile, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        mobile,
        password,
      });

      toast.success("OTP sent to your email");
      return response.data; // 🔥 no need only user
    } catch (error) {
      const msg =
        error.response?.data?.message || "Registration failed";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

/* =========================
   VERIFY OTP
========================= */
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/verify-otp", {
        email,
        otp,
      });

      toast.success("Account Created Successfully!");
      return res.data.user; // ✅ user return
    } catch (err) {
      const msg = err.response?.data?.message || "OTP Failed";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

/* =========================
   LOGIN USER
========================= */
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

/* =========================
   GET LOGGED-IN USER
========================= */
export const getUser = createAsyncThunk(
  "auth/getUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/profile");
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user"
      );
    }
  }
);

/* =========================
   FORGOT PASSWORD
========================= */
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/forgot-password", {
        email,
      });

      toast.success(response.data.message || "OTP sent successfully");

      return response.data;

    } catch (error) {
      const msg =
        error.response?.data?.message || "Failed to send OTP";

      toast.error(msg);

      return rejectWithValue(msg);
    }
  }
);


/* =========================
   RESET PASSWORD
========================= */
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ email, otp, newPassword }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });

      toast.success(
        response.data.message || "Password reset successful"
      );

      return response.data;

    } catch (error) {
      const msg =
        error.response?.data?.message || "Password reset failed";

      toast.error(msg);

      return rejectWithValue(msg);
    }
  }
);

/* =========================
   LOGOUT USER
========================= */
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/auth/logout");

      return null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Logout failed"
      );
    }
  }
);

/* =========================
   INITIAL STATE
========================= */
const initialState = {
  loading: false,
  user: JSON.parse(localStorage.getItem("user")) || null, // ✅ persist login
  error: null,
  isAuthChecked: false,
};

/* =========================
   SLICE
========================= */
const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* ===== REGISTER ===== */
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===== VERIFY OTP ===== */
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthChecked = true;

        // ✅ save user
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===== LOGIN ===== */
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthChecked = true;

        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===== GET USER ===== */
      .addCase(getUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(getUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthChecked = true;
      })

      /* ===== FORGOT PASSWORD ===== */
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===== RESET PASSWORD ===== */
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })

    addCase(logoutUser.fulfilled, (state) => {
      state.loading = false;
      state.user = null;
      state.error = null;
      state.isAuthChecked = false;

      localStorage.removeItem("user");
    })

      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
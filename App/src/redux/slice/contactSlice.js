import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "./axiosConfig";

// ==========================================
// CREATE CONTACT
// ==========================================

export const createContact = createAsyncThunk(
  "contact/create",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post(
        "/contact",
        payload
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Something went wrong",
        }
      );
    }
  }
);

const initialState = {
  loading: false,
  success: false,
  error: null,
  contact: null,
};

const contactSlice = createSlice({
  name: "contact",
  initialState,

  reducers: {
    resetContactState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.contact = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ==========================
      // CREATE CONTACT
      // ==========================

      .addCase(createContact.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(createContact.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.contact = action.payload.data;
      })

      .addCase(createContact.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
          action.payload?.message ||
          "Failed to send message";
      });
  },
});

export const {
  resetContactState,
} = contactSlice.actions;

export default contactSlice.reducer;
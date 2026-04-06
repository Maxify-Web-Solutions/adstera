import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../slice/axiosConfig";

/* =========================
   CREATE SMART LINK
========================= */
export const createSmartLink = createAsyncThunk(
    "smartlink/create",
    async ({ trafficType }, { rejectWithValue }) => {
        try {
            const response = await api.post("/smartlink/create", {
                type: trafficType, // ✅ mapping
            });

            return response.data.smartLink;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to create smart link"
            );
        }
    }
);

/* =========================
   APPROVE SMART LINK (ADMIN)
========================= */
export const approveSmartLink = createAsyncThunk(
    "smartlink/approve",
    async (id, { rejectWithValue }) => {
        try {
            // ✅ FIX: PUT request
            const response = await api.put(`/smartlink/approve/${id}`);
            return response.data.smartLink;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to approve smart link"
            );
        }
    }
);

/* =========================
   GET MY SMART LINKS
========================= */
export const getSmartLinksByUser = createAsyncThunk(
    "smartlink/getMyLinks",
    async (_, { rejectWithValue }) => {
        try {
            // ✅ FIX: no userId
            const response = await api.get(`/smartlink/my-links`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch smart links"
            );
        }
    }
);

/* =========================
   INITIAL STATE
========================= */
const initialState = {
    loading: false,
    smartLinks: [],
    createdLink: null,
    error: null,
};

/* =========================
   SLICE
========================= */
const smartLinkSlice = createSlice({
    name: "smartlink",
    initialState,

    reducers: {
        clearSmartLinkError: (state) => {
            state.error = null;
        },

        resetCreatedLink: (state) => {
            state.createdLink = null;
        },
    },

    extraReducers: (builder) => {
        builder

            /* ===== CREATE ===== */
            .addCase(createSmartLink.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(createSmartLink.fulfilled, (state, action) => {
                state.loading = false;
                state.createdLink = action.payload;

                // 🔥 top pe add
                state.smartLinks.unshift(action.payload);
            })

            .addCase(createSmartLink.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            /* ===== APPROVE ===== */
            .addCase(approveSmartLink.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(approveSmartLink.fulfilled, (state, action) => {
                state.loading = false;

                const updatedLink = action.payload;

                // 🔥 update specific item
                state.smartLinks = state.smartLinks.map((link) =>
                    link._id === updatedLink._id ? updatedLink : link
                );
            })

            .addCase(approveSmartLink.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            /* ===== GET LINKS ===== */
            .addCase(getSmartLinksByUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getSmartLinksByUser.fulfilled, (state, action) => {
                state.loading = false;
                state.smartLinks = action.payload;
            })

            .addCase(getSmartLinksByUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearSmartLinkError, resetCreatedLink } =
    smartLinkSlice.actions;

export default smartLinkSlice.reducer;
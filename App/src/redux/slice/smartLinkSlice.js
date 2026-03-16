import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../slice/axiosConfig";

/* =========================
   CREATE SMART LINK
========================= */
export const createSmartLink = createAsyncThunk(
    "smartlink/create",
    async ({ name, targetUrl }, { rejectWithValue }) => {
        try {
            const response = await api.post("/smartlink/create", {
                name,
                targetUrl,
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
            const response = await api.get(`/smartlink/approve/${id}`);
            return response.data.smartLink;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to approve smart link"
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

            /* ===== CREATE SMART LINK ===== */

            .addCase(createSmartLink.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(createSmartLink.fulfilled, (state, action) => {
                state.loading = false;

                state.createdLink = action.payload;

                state.smartLinks.unshift(action.payload);
            })

            .addCase(createSmartLink.rejected, (state, action) => {
                state.loading = false;

                state.error = action.payload;
            })

            /* ===== APPROVE SMART LINK ===== */

            .addCase(approveSmartLink.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(approveSmartLink.fulfilled, (state, action) => {
                state.loading = false;

                const updatedLink = action.payload;

                const index = state.smartLinks.findIndex(
                    (link) => link._id === updatedLink._id
                );

                if (index !== -1) {
                    state.smartLinks[index] = updatedLink;
                }
            })

            .addCase(approveSmartLink.rejected, (state, action) => {
                state.loading = false;

                state.error = action.payload;
            });
    },
});

export const { clearSmartLinkError, resetCreatedLink } =
    smartLinkSlice.actions;

export default smartLinkSlice.reducer;
import {
    ADSTERRA_STATS_REQUEST,
    ADSTERRA_STATS_SUCCESS,
    ADSTERRA_STATS_FAIL,
    ADSTERRA_STATS_RESET,
} from "../constants/adsterraConstants";

const initialState = {
    loading: false,
    stats: [],
    total: 0,
    success: false,
    error: null,
};

export const adsterraStatsReducer = (state = initialState, action) => {
    switch (action.type) {

        case ADSTERRA_STATS_REQUEST:
            return {
                ...state,
                loading: true,
                success: false,
                error: null,
            };

        case ADSTERRA_STATS_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                stats: action.payload?.data || [],
                total: action.payload?.total || 0,
                error: null,
            };

        case ADSTERRA_STATS_FAIL:
            return {
                ...state,
                loading: false,
                success: false,
                error: action.payload || "Something went wrong",
            };

        case ADSTERRA_STATS_RESET:
            return {
                ...initialState,
            };

        default:
            return state;
    }
};
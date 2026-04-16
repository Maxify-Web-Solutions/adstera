// api.js
import axios from "axios";

// const API_BASE_URL = "http://localhost:5002/api";
const API_BASE_URL = "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 👈 IMPORTANT (send cookies automatically)
});

// Response interceptor (401 handle)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If token expired (cookie invalid), but ignore profile check for guests
      const isProfileCheck = error.config?.url?.includes("/auth/profile");
      if (!isProfileCheck && window.location.pathname !== "/login" && window.location.pathname !== "/register") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

const host = "https://demo22.etsblokchain.live/";

export { api, host };
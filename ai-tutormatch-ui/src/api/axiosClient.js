import axios from "axios";

// Base URL points to frontend origin with /api
const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";

const axiosClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("tm_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("tm_token");
      localStorage.removeItem("tm_user");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    const message =
      error.response?.data?.message ||
      (typeof error.response?.data === "string" ? error.response.data : null) ||
      error.message ||
      "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  }
);

export default axiosClient;

import axiosClient from "./axiosClient";

// Matches AuthController: POST /api/auth/register, POST /api/auth/login
export const authApi = {
  register: (payload) => axiosClient.post("/auth/register", payload).then((r) => r.data),
  login: (payload) => axiosClient.post("/auth/login", payload).then((r) => r.data),
};

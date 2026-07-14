import axiosClient from './axiosClient';

// Matches AuthController: POST /api/auth/register, POST /api/auth/login
export const authApi = {
  register: payload =>
    axiosClient.post ('/api/auth/register', payload).then (r => r.data),
  login: payload =>
    axiosClient.post ('/api/auth/login', payload).then (r => r.data),
};

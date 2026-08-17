import { api } from './api';

export const authService = {
  async register(data: any) {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  async verifyOTP(data: any) {
    const response = await api.post('/auth/verify-otp', data);
    return response.data;
  },

  async resendOTP(data: any) {
    const response = await api.post('/auth/resend-otp', data);
    return response.data;
  },

  async login(data: any) {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  async googleAuth(data: any) {
    const response = await api.post('/auth/google', data);
    return response.data;
  },

  async forgotPassword(data: any) {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
  },

  async resetPassword(data: any) {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },

  async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  }
};

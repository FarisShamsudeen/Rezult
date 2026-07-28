import { api } from './api';

export interface Rezulter {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export const rezulterService = {
  getAllPaginated: async (params?: { page?: number; limit?: number; search?: string; isActive?: boolean; sortField?: string; sortOrder?: string }) => {
    const response = await api.get('/rezulters', { params });
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/rezulters', data);
    return response.data;
  },

  toggleStatus: async (id: string) => {
    const response = await api.patch(`/rezulters/${id}/toggle-status`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/rezulters/stats');
    return response.data;
  }
};

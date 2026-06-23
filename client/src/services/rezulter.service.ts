import { api } from './api';

export interface Rezulter {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export const rezulterService = {
  getAll: async () => {
    const response = await api.get('/rezulters');
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/rezulters', data);
    return response.data;
  },

  toggleStatus: async (id: string) => {
    const response = await api.patch(`/rezulters/${id}/toggle-status`);
    return response.data;
  }
};

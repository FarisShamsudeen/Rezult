import { api } from './api';

export interface Candidate {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export const candidateService = {
  getAll: async (params?: { page?: number; limit?: number; search?: string; isActive?: boolean; sortField?: string; sortOrder?: string }) => {
    const response = await api.get('/candidates', { params });
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/candidates', data);
    return response.data;
  },

  toggleStatus: async (id: string) => {
    const response = await api.patch(`/candidates/${id}/toggle-status`);
    return response.data;
  },
  
  getStats: async () => {
    const response = await api.get('/candidates/stats');
    return response.data;
  }
};

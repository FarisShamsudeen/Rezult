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
  getAll: async () => {
    const response = await api.get('/candidates');
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/candidates', data);
    return response.data;
  },

  toggleStatus: async (id: string) => {
    const response = await api.patch(`/candidates/${id}/toggle-status`);
    return response.data;
  }
};

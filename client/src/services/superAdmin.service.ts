import { api } from './api';

export interface DashboardStats {
  totalRezulters: number;
  totalCandidates: number;
  totalAssessments: number;
  liveAssessments: Array<{
    id: string;
    name: string;
    rezulterName: string;
    activeUsers: number;
    status: string;
  }>;
}

export const superAdminService = {
  getDashboardStats: async () => {
    const response = await api.get('/super-admin/dashboard');
    return response.data;
  },
};

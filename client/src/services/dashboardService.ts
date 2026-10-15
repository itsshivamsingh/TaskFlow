import { api } from './api';
import { DashboardData, WeeklyProductivityDay } from '../types';

export const dashboardService = {
  async getStats(): Promise<{ success: boolean; data: DashboardData }> {
    const res = await api.get<{ success: boolean; data: DashboardData }>('/dashboard/stats');
    return res.data;
  },

  async getProductivity(): Promise<{ success: boolean; data: WeeklyProductivityDay[] }> {
    const res = await api.get<{ success: boolean; data: WeeklyProductivityDay[] }>('/dashboard/productivity');
    return res.data;
  },
};

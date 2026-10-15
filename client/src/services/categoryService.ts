import { api } from './api';
import { Category } from '../types';

export const categoryService = {
  async getCategories(): Promise<{ success: boolean; data: Category[] }> {
    const res = await api.get<{ success: boolean; data: Category[] }>('/categories');
    return res.data;
  },

  async createCategory(data: { name: string; color?: string }): Promise<{ success: boolean; data: Category }> {
    const res = await api.post<{ success: boolean; data: Category }>('/categories', data);
    return res.data;
  },

  async deleteCategory(id: string): Promise<{ success: boolean; message: string }> {
    const res = await api.delete<{ success: boolean; message: string }>(`/categories/${id}`);
    return res.data;
  },
};

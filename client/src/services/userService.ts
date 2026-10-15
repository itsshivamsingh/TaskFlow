import { api } from './api';
import { User } from '../types';

export const userService = {
  async getProfile(): Promise<{ success: boolean; user: User }> {
    const res = await api.get<{ success: boolean; user: User }>('/users/me');
    return res.data;
  },

  async updateProfile(data: { name?: string; preferences?: { theme?: 'light' | 'dark' | 'system' } }): Promise<{ success: boolean; message: string; user: User }> {
    const res = await api.patch<{ success: boolean; message: string; user: User }>('/users/me', data);
    return res.data;
  },

  async updatePassword(data: { currentPassword: string; newPassword: string; confirmNewPassword: string }): Promise<{ success: boolean; message: string }> {
    const res = await api.patch<{ success: boolean; message: string }>('/users/me/password', data);
    return res.data;
  },

  async deleteAccount(): Promise<{ success: boolean; message: string }> {
    const res = await api.delete<{ success: boolean; message: string }>('/users/me');
    return res.data;
  },
};

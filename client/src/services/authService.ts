import { api } from './api';
import { User } from '../types';

export interface AuthResponse {
  success: boolean;
  message: string;
  user: User;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  developmentToken?: string;
  resetUrl?: string;
  note?: string;
}

export const authService = {
  async register(data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/register', data);
    return res.data;
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/login', data);
    return res.data;
  },

  async logout(): Promise<{ success: boolean; message: string }> {
    const res = await api.post<{ success: boolean; message: string }>('/auth/logout');
    return res.data;
  },

  async getMe(): Promise<{ success: boolean; user: User }> {
    const res = await api.get<{ success: boolean; user: User }>('/auth/me');
    return res.data;
  },

  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    const res = await api.post<ForgotPasswordResponse>('/auth/forgot-password', { email });
    return res.data;
  },

  async resetPassword(data: {
    token: string;
    password: string;
    confirmPassword: string;
  }): Promise<{ success: boolean; message: string }> {
    const res = await api.post<{ success: boolean; message: string }>('/auth/reset-password', data);
    return res.data;
  },
};

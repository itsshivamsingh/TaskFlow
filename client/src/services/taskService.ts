import { api } from './api';
import { Task, TaskQueryParams, PaginationMeta } from '../types';

export interface TasksResponse {
  success: boolean;
  data: Task[];
  pagination: PaginationMeta;
}

export interface TaskResponse {
  success: boolean;
  message?: string;
  data: Task;
}

export const taskService = {
  async getTasks(params?: TaskQueryParams): Promise<TasksResponse> {
    const res = await api.get<TasksResponse>('/tasks', { params });
    return res.data;
  },

  async getTaskById(id: string): Promise<TaskResponse> {
    const res = await api.get<TaskResponse>(`/tasks/${id}`);
    return res.data;
  },

  async createTask(data: Partial<Task>): Promise<TaskResponse> {
    const res = await api.post<TaskResponse>('/tasks', data);
    return res.data;
  },

  async updateTask(id: string, data: Partial<Task>): Promise<TaskResponse> {
    const res = await api.patch<TaskResponse>(`/tasks/${id}`, data);
    return res.data;
  },

  async updateTaskStatus(id: string, status: string): Promise<TaskResponse> {
    const res = await api.patch<TaskResponse>(`/tasks/${id}/status`, { status });
    return res.data;
  },

  async deleteTask(id: string): Promise<{ success: boolean; message: string }> {
    const res = await api.delete<{ success: boolean; message: string }>(`/tasks/${id}`);
    return res.data;
  },
};

export type TaskStatus = 'todo' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
}

export interface User {
  id: string;
  name: string;
  email: string;
  preferences: UserPreferences;
  createdAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  startDate?: string;
  category: string;
  tags: string[];
  owner: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  color: string;
  owner: string;
  createdAt: string;
}

export interface DashboardSummary {
  total: number;
  completed: number;
  todo: number;
  inProgress: number;
  overdue: number;
  dueToday: number;
  completionRate: number;
}

export interface StatusDistributionItem {
  name: string;
  value: number;
  key: TaskStatus;
  color: string;
}

export interface DashboardData {
  summary: DashboardSummary;
  statusDistribution: StatusDistributionItem[];
  upcomingDeadlines: Task[];
  recentTasks: Task[];
  dueTodayTasks: Task[];
}

export interface WeeklyProductivityDay {
  dateStr: string;
  label: string;
  count: number;
  createdCount: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TaskQueryParams {
  search?: string;
  status?: string;
  priority?: string;
  category?: string;
  tag?: string;
  dueDateFilter?: string;
  sortBy?: 'createdAt' | 'dueDate' | 'priority' | 'title';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

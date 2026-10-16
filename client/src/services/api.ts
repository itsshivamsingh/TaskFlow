import axios, { AxiosError } from 'axios';

export const TOKEN_STORAGE_KEY = 'taskflow_auth_token';

// Normalize API base URL to ensure '/api' prefix is included exactly once with no trailing slash
const getBaseUrl = (): string => {
  const rawUrl = (import.meta.env.VITE_API_URL || '/api').trim();
  const withoutTrailingSlash = rawUrl.replace(/\/+$/, '');
  if (!withoutTrailingSlash.endsWith('/api')) {
    return `${withoutTrailingSlash}/api`;
  }
  return withoutTrailingSlash;
};

export const API_BASE_URL = getBaseUrl();

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000, // 10s timeout prevents indefinite hangs on cold-start hosting
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach Authorization: Bearer <token> fallback
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor for normalizing error messages and handling session expiration
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; errors?: Record<string, string> }>) => {
    // If request failed with 401 Unauthorized (and wasn't a standard login attempt)
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login')) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred. Please try again.';

    // Attach custom cleaned message to error object
    const enhancedError = new Error(message) as Error & {
      status?: number;
      errors?: Record<string, string>;
    };
    enhancedError.status = error.response?.status;
    enhancedError.errors = error.response?.data?.errors;

    return Promise.reject(enhancedError);
  }
);

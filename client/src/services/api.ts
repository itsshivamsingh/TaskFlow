import axios, { AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 6000, // 6s timeout prevents indefinite hangs
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for normalizing error messages
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; errors?: Record<string, string> }>) => {
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

/**
 * Pam App — Axios API client
 * Centralized HTTP instance with interceptors for auth token injection
 * and automatic token refresh on 401.
 */
import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { API_TIMEOUT_MS } from '@constants/index';
import { STORAGE_KEYS } from '@constants/index';

// ─── Base URL ───────────────────────────────────────────────────────────────
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.pam.app/v1';

// ─── Axios instance ──────────────────────────────────────────────────────────
export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: API_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── Request interceptor — inject access token ───────────────────────────────
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // Lazy import to avoid circular dependency with store
      const { getItem } = await import('./storage');
      const token = await getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Non-blocking — proceed without token
    }
    return config;
  },
  error => Promise.reject(error)
);

// ─── Response interceptor — handle 401 / shape errors ────────────────────────
apiClient.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // TODO: Implement token refresh logic here
      // e.g. call authService.refresh() and retry original request
    }
    return Promise.reject(error);
  }
);

export default apiClient;

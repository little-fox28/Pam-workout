/**
 * Pam App — Auth Service
 * All auth-related API calls live here.
 */
import type { ApiResponse, AuthTokens, LoginCredentials, RegisterCredentials, User } from '@types/index';

import apiClient from './api';

export const authService = {
  /**
   * Login with email + password
   */
  login: async (credentials: LoginCredentials): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> => {
    const { data } = await apiClient.post('/auth/login', credentials);
    return data;
  },

  /**
   * Register a new user
   */
  register: async (
    credentials: RegisterCredentials
  ): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> => {
    const { data } = await apiClient.post('/auth/register', credentials);
    return data;
  },

  /**
   * Get current authenticated user
   */
  me: async (): Promise<ApiResponse<User>> => {
    const { data } = await apiClient.get('/auth/me');
    return data;
  },

  /**
   * Logout — invalidate server-side session
   */
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  /**
   * Refresh access token
   */
  refresh: async (refreshToken: string): Promise<ApiResponse<AuthTokens>> => {
    const { data } = await apiClient.post('/auth/refresh', { refreshToken });
    return data;
  },
};

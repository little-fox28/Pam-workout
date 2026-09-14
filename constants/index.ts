/**
 * Pam App — App-wide constants
 */

export const APP_NAME = 'Pam';
export const APP_VERSION = '1.0.0';

// API
export const API_TIMEOUT_MS = 15_000;
export const API_RETRY_COUNT = 2;

// Storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN:  '@pam/access_token',
  REFRESH_TOKEN: '@pam/refresh_token',
  USER:          '@pam/user',
  THEME:         '@pam/theme',
  ONBOARDING:    '@pam/onboarding_complete',
} as const;

// Query keys (TanStack Query)
export const QUERY_KEYS = {
  AUTH: {
    ME: ['auth', 'me'] as const,
  },
  PROFILE: {
    DETAIL: (id: string) => ['profile', id] as const,
  },
} as const;

// Navigation route names
export const ROUTES = {
  AUTH: {
    LOGIN:    '/(auth)/login',
    REGISTER: '/(auth)/register',
  },
  TABS: {
    HOME:    '/(tabs)/',
    PROFILE: '/(tabs)/profile',
  },
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE:  1,
  DEFAULT_LIMIT: 20,
} as const;

/**
 * Pam App — Auth Store (Zustand)
 * Manages authentication state: user, tokens, loading, and auth actions.
 */
import { create } from 'zustand';

import { STORAGE_KEYS } from '@constants/index';
import { authService } from '@services/authService';
import { clearAll, getItem, removeItem, setItem } from '@services/storage';
import type { AuthTokens, LoginCredentials, RegisterCredentials, User } from '@types/index';

interface AuthStore {
  // ─── State ──────────────────────────────────────────────────────────────
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // ─── Actions ────────────────────────────────────────────────────────────
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  loadSession: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set, _get) => ({
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // ─── Load persisted session on app launch ────────────────────────────────
  loadSession: async () => {
    set({ isLoading: true });
    try {
      const [tokenRaw, userRaw] = await Promise.all([
        getItem(STORAGE_KEYS.ACCESS_TOKEN),
        getItem(STORAGE_KEYS.USER),
      ]);
      if (tokenRaw && userRaw) {
        const user: User = JSON.parse(userRaw);
        set({ user, isAuthenticated: true });
      }
    } catch {
      // Silent — not logged in
    } finally {
      set({ isLoading: false });
    }
  },

  // ─── Login ───────────────────────────────────────────────────────────────
  login: async credentials => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(credentials);
      const { user, tokens } = response.data;

      await Promise.all([
        setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken),
        setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken),
        setItem(STORAGE_KEYS.USER, JSON.stringify(user)),
      ]);

      set({ user, tokens, isAuthenticated: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      set({ error: message });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  // ─── Register ────────────────────────────────────────────────────────────
  register: async credentials => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(credentials);
      const { user, tokens } = response.data;

      await Promise.all([
        setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken),
        setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken),
        setItem(STORAGE_KEYS.USER, JSON.stringify(user)),
      ]);

      set({ user, tokens, isAuthenticated: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      set({ error: message });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  // ─── Logout ──────────────────────────────────────────────────────────────
  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout().catch(() => {
        // Best-effort — clear local state regardless
      });
    } finally {
      await Promise.all([
        removeItem(STORAGE_KEYS.ACCESS_TOKEN),
        removeItem(STORAGE_KEYS.REFRESH_TOKEN),
        removeItem(STORAGE_KEYS.USER),
      ]);
      set({ user: null, tokens: null, isAuthenticated: false, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));

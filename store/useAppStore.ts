/**
 * Pam App — App Store (Zustand)
 * Global UI/UX state: theme, network status, toasts, loading overlays.
 */
import { create } from 'zustand';

export type ThemeMode = 'dark' | 'light' | 'system';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface AppStore {
  // ─── State ──────────────────────────────────────────────────────────────
  themeMode: ThemeMode;
  isOnline: boolean;
  isAppReady: boolean;
  toasts: Toast[];
  globalLoading: boolean;

  // ─── Actions ────────────────────────────────────────────────────────────
  setThemeMode: (mode: ThemeMode) => void;
  setOnline: (online: boolean) => void;
  setAppReady: (ready: boolean) => void;
  setGlobalLoading: (loading: boolean) => void;
  showToast: (toast: Omit<Toast, 'id'>) => void;
  dismissToast: (id: string) => void;
  clearToasts: () => void;
}

export const useAppStore = create<AppStore>(set => ({
  themeMode: 'dark',
  isOnline: true,
  isAppReady: false,
  toasts: [],
  globalLoading: false,

  setThemeMode: mode => set({ themeMode: mode }),
  setOnline: online => set({ isOnline: online }),
  setAppReady: ready => set({ isAppReady: ready }),
  setGlobalLoading: loading => set({ globalLoading: loading }),

  showToast: toast =>
    set(state => ({
      toasts: [
        ...state.toasts,
        { ...toast, id: `${Date.now()}-${Math.random().toString(36).slice(2)}` },
      ],
    })),

  dismissToast: id =>
    set(state => ({ toasts: state.toasts.filter(t => t.id !== id) })),

  clearToasts: () => set({ toasts: [] }),
}));

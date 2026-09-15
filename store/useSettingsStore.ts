/**
 * Pam App — Settings Store (Zustand + MMKV)
 *
 * Owns theme mode and language selection. Persisted synchronously via MMKV
 * through the `persist` middleware so state is fully rehydrated before the
 * first render frame — no flicker on launch.
 *
 * On first launch, `themeMode` defaults to 'system'. The rendering
 *         layer (app/_layout.tsx) resolves 'system' to the actual OS scheme
 *         using React Native's `useColorScheme()` hook.
 */
import i18n, { type SupportedLanguage } from '@lib/i18n';
import { mmkvStorage } from '@lib/storage/mmkv';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'system';

interface SettingsState {
  // ─── State ────────────────────────────────────────────────────────────────
  themeMode: ThemeMode;
  language: SupportedLanguage;

  // ─── Actions ──────────────────────────────────────────────────────────────

  /**
   * Switch theme. Persisted to MMKV synchronously.
   */
  setThemeMode: (mode: ThemeMode) => void;

  /**
   * Switch language. Triggers i18next re-render + persists to MMKV.
   */
  setLanguage: (lang: SupportedLanguage) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      themeMode: 'system',
      language: 'en',

      setThemeMode: (mode) => {
        set({ themeMode: mode });
      },

      setLanguage: (lang) => {
        i18n.changeLanguage(lang);
        set({ language: lang });
      },
    }),
    {
      name: '@pam/settings',
      storage: createJSONStorage(() => mmkvStorage),
      // Only persist these two fields; runtime-only state stays ephemeral.
      partialize: (state) => ({
        themeMode: state.themeMode,
        language: state.language,
      }),
    }
  )
);

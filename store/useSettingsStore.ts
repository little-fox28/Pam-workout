/**
 * Pam App — Settings Store (Zustand + MMKV)
 *
 * Owns theme mode and language selection. Persisted synchronously via MMKV
 * through the `persist` middleware so state is fully rehydrated before the
 * first render frame — satisfying NFN-S1 (no flicker on launch).
 *
 * NFN-S3: On first launch, `themeMode` defaults to 'system'. The rendering
 *         layer (app/_layout.tsx) resolves 'system' to the actual OS scheme
 *         using React Native's `useColorScheme()` hook.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import i18n, { type SupportedLanguage } from '@lib/i18n';
import { mmkvStorage } from '@lib/storage/mmkv';

export type ThemeMode = 'light' | 'dark' | 'system';

interface SettingsState {
  // ─── State ────────────────────────────────────────────────────────────────
  themeMode: ThemeMode;
  language: SupportedLanguage;

  // ─── Actions ──────────────────────────────────────────────────────────────

  /**
   * FN-S1: Switch theme. Persisted to MMKV synchronously.
   */
  setThemeMode: (mode: ThemeMode) => void;

  /**
   * FN-S2: Switch language. Triggers i18next re-render + persists to MMKV.
   */
  setLanguage: (lang: SupportedLanguage) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // ── NFN-S3: Default to system so OS scheme is honoured on first launch
      themeMode: 'system',
      language: 'en',

      setThemeMode: (mode) => set({ themeMode: mode }),

      setLanguage: (lang) => {
        // Synchronously update i18next — triggers useTranslation re-renders.
        i18n.changeLanguage(lang);
        set({ language: lang });
      },
    }),
    {
      name: '@pam/settings',
      // NFN-S1: Use MMKV instead of AsyncStorage — fully synchronous.
      storage: createJSONStorage(() => mmkvStorage),
      // Only persist these two fields; runtime-only state stays ephemeral.
      partialize: (state) => ({
        themeMode: state.themeMode,
        language: state.language,
      }),
    }
  )
);

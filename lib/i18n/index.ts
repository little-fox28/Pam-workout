/**
 * Pam App — i18n Configuration
 *
 * Integrates i18next with MMKV for zero-async language persistence.
 *
 * NFN-S1: Language reads from MMKV on module load — synchronous, no
 *         await needed — preventing the flash of wrong-language content.
 * NFN-S2: Calling `i18n.changeLanguage()` re-renders all components
 *         subscribed via `useTranslation()` in real time.
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { storage } from '@lib/storage/mmkv';

import en from './locales/en.json';
import vi from './locales/vi.json';

const LANGUAGE_KEY = '@pam/language';

// ─── Custom MMKV language detector ────────────────────────────────────────────
// i18next expects a plugin-shaped object with type 'languageDetector'.
// The `async: false` flag forces synchronous detection — critical for NFN-S1.
const MmkvLanguageDetector = {
  type: 'languageDetector' as const,
  async: false,

  // Called once at init. Returns the stored language or falls back to 'en'.
  detect(): string {
    return storage.getString(LANGUAGE_KEY) ?? 'en';
  },

  // No-op: detection is done in `detect()`.
  init(): void {},

  // Called by i18next after `i18n.changeLanguage()` — persist immediately.
  cacheUserLanguage(language: string): void {
    storage.set(LANGUAGE_KEY, language);
  },
};

// ─── Supported locales ────────────────────────────────────────────────────────
export type SupportedLanguage = 'en' | 'vi';

export const SUPPORTED_LANGUAGES: { code: SupportedLanguage; label: string; nativeLabel: string }[] = [
  { code: 'en', label: 'English',    nativeLabel: 'English' },
  { code: 'vi', label: 'Vietnamese', nativeLabel: 'Tiếng Việt' },
];

// ─── i18next initialization ───────────────────────────────────────────────────
i18n
  .use(MmkvLanguageDetector)
  .use(initReactI18next)
  .init({
    // Resources are bundled locally — no network request required.
    resources: {
      en: { translation: en },
      vi: { translation: vi },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'vi'],
    // Disable interpolation escaping — React handles XSS.
    interpolation: { escapeValue: false },
    // Prevent i18next from logging warnings in production.
    compatibilityJSON: 'v4',
  });

export default i18n;

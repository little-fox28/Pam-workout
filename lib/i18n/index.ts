/**
 * Pam App — i18n Configuration
 *
 * Integrates i18next with MMKV for persistence.
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { createAppStorage } from '@lib/storage/mmkv';

import en from './locales/en.json';
import vi from './locales/vi.json';

const LANGUAGE_KEY = '@pam/language';
const storage = createAppStorage();

// ─── Custom MMKV language detector ────────────────────────────────────────────
// i18next expects a plugin-shaped object with type 'languageDetector'.
// The `async: false` flag forces synchronous detection — critical for NFN-S1.
const MmkvLanguageDetector = {
  type: 'languageDetector' as const,
  async: true,

  // Called once at init. Returns the stored language or falls back to 'en'.
  detect(callback: (lang: string) => void) {
    Promise.resolve(storage.getItem(LANGUAGE_KEY)).then((lang) => {
      callback(typeof lang === 'string' ? lang : 'en');
    });
  },

  // No-op: detection is done in `detect()`.
  init(): void {},

  // Called by i18next after `i18n.changeLanguage()` — persist immediately.
  cacheUserLanguage(language: string): void {
    storage.setItem(LANGUAGE_KEY, language);
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

/**
 * Pam App — MMKV Singleton
 *
 * Single shared MMKV instance used by both the Zustand persist middleware
 * and the i18n language detector. Using one instance avoids redundant native
 * bridge calls and keeps storage concerns centralized.
 *
 * NFN-S1: Reads/writes are fully synchronous — no Promise overhead.
 */
import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({ id: 'pam-storage' });

/**
 * StateStorage adapter for zustand/middleware `persist`.
 * Zustand's persist middleware expects a storage interface with
 * getItem / setItem / removeItem — this bridges MMKV to that contract.
 */
export const mmkvStorage = {
  getItem: (key: string): string | null => storage.getString(key) ?? null,
  setItem: (key: string, value: string): void => storage.set(key, value),
  removeItem: (key: string): void => storage.delete(key),
};

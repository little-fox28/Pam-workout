/**
 * Pam App — useResolvedTheme hook
 *
 * Resolves the effective color scheme from the store's `themeMode`.
 * - 'light' / 'dark'  → returned directly
 * - 'system'          → defers to the OS via RN's useColorScheme()
 *
 * NFN-S3: Guarantees that `system` always reflects the current OS preference
 *         without requiring a store update.
 * NFN-S2: Because this hook composes two reactive sources (Zustand + RN),
 *         any change in either propagates instantly to all consumers.
 */
import { useColorScheme } from 'react-native';

import { useSettingsStore } from '@store/useSettingsStore';

export type ResolvedTheme = 'light' | 'dark';

export const useResolvedTheme = (): ResolvedTheme => {
  const themeMode = useSettingsStore((s) => s.themeMode);
  const systemScheme = useColorScheme(); // 'light' | 'dark' | null | undefined

  if (themeMode === 'system') {
    return systemScheme === 'dark' ? 'dark' : 'light';
  }

  return themeMode;
};

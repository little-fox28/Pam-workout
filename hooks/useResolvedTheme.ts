/**
 * Pam App — useResolvedTheme hook
 *
 * Resolves the effective color scheme from the store's `themeMode`.
 * - 'light' / 'dark'  → returned directly
 * - 'system'          → defers to the OS via RN's useColorScheme()
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

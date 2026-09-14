/**
 * Pam App — useTheme hook
 * Returns resolved theme tokens based on current theme mode.
 * Future-proofs for system dark/light mode detection.
 */
import { useColorScheme } from 'react-native';

import { useAppStore } from '@store/useAppStore';
import { BorderRadius, Colors, Spacing, Typography } from '@theme/index';

export const useTheme = () => {
  const systemColorScheme = useColorScheme();
  const { themeMode, setThemeMode } = useAppStore();

  const isDark =
    themeMode === 'dark' || (themeMode === 'system' && systemColorScheme === 'dark');

  return {
    isDark,
    themeMode,
    setThemeMode,
    colors: Colors,
    typography: Typography,
    spacing: Spacing,
    borderRadius: BorderRadius,
    // Semantic shortcuts
    bg: isDark ? Colors.surface.DEFAULT : '#ffffff',
    cardBg: isDark ? Colors.surface.card : '#f9fafb',
    textPrimary: isDark ? Colors.text.primary : Colors.text.inverse,
    textSecondary: Colors.text.secondary,
    border: isDark ? Colors.surface.border : '#e5e7eb',
  };
};

/**
 * Pam App — Design Token: Colors
 * Single source of truth for all color values.
 * Use these in NativeWind className (via tailwind.config.js) or in StyleSheet.
 */
export const Colors = {
  // Brand
  primary: {
    50:  '#eef4ff',
    100: '#dae6fe',
    200: '#bcd3fd',
    300: '#90b7fb',
    400: '#5d90f7',
    500: '#3a6ef2', // ← main
    600: '#2350e6',
    700: '#1c3fd2',
    800: '#1d35ab',
    900: '#1d3187',
    950: '#152055',
  },
  accent: {
    400: '#fb923c',
    500: '#f97316', // ← main
    600: '#ea6c0c',
  },
  // Surfaces (dark mode first)
  surface: {
    DEFAULT: '#0f1117',
    card:    '#1a1d27',
    border:  '#2a2d3e',
  },
  // Text
  text: {
    primary:   '#f9fafb',
    secondary: '#9ca3af',
    muted:     '#6b7280',
    inverse:   '#111827',
  },
  // Semantic
  success: '#22c55e',
  warning: '#f59e0b',
  error:   '#ef4444',
  info:    '#3b82f6',

  // Transparent
  transparent: 'transparent',
} as const;

export type ColorKey = keyof typeof Colors;

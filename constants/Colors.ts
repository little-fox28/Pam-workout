/**
 * Pam App — Centralized Color Constants
 * 
 * Used for providing semantic colors to JS APIs that do not support Tailwind classes
 * (like React Navigation's screenOptions, TabBar configuration, etc).
 */



type ThemeColors = {
  background: string;
  foreground: string;
  card: string;
  border: string;
  primary: string;
  muted: string;
  mutedForeground: string;
};

export const Colors: Record<'light' | 'dark', ThemeColors> = {
  light: {
    background: '#f9fafb',
    foreground: '#111827',
    card: '#ffffff',
    border: '#e5e7eb',
    primary: '#3a6ef2',
    muted: '#6b7280',
    mutedForeground: '#9ca3af',
  },
  dark: {
    background: '#0f1117',
    foreground: '#ffffff',
    card: '#1a1d27',
    border: '#2a2d3e',
    primary: '#5d90f7',
    muted: '#9ca3af',
    mutedForeground: '#6b7280',
  },
} as const;

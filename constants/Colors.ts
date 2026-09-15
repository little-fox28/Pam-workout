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
    background: '#f2f2f7',
    foreground: '#000000',
    card: '#ffffff',
    border: '#c6c6c8',
    primary: '#007aff',
    muted: '#8e8e93',
    mutedForeground: '#3c3c4399',
  },
  dark: {
    background: '#000000',
    foreground: '#ffffff',
    card: '#1c1c1e',
    border: '#38383a',
    primary: '#0a84ff',
    muted: '#8e8e93',
    mutedForeground: '#ebebf599',
  },
} as const;

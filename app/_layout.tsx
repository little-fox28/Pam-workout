import '../global.css';
import '../lib/i18n';

import { useEffect } from 'react';


import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { I18nextProvider } from 'react-i18next';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import i18n from '../lib/i18n';

import { cssInterop, vars } from 'nativewind';
import { useResolvedTheme } from '@hooks/useResolvedTheme';
import { useAuthStore } from '@store/useAuthStore';

cssInterop(GestureHandlerRootView, { className: 'style' });

SplashScreen.preventAutoHideAsync();

const themes = {
  light: vars({
    '--background': '#f9fafb',
    '--foreground': '#111827',
    '--card': '#ffffff',
    '--border': '#e5e7eb',
    '--primary': '#3a6ef2',
    '--primary-foreground': '#ffffff',
    '--muted': '#6b7280',
    '--muted-foreground': '#9ca3af',
  }),
  dark: vars({
    '--background': '#0f1117',
    '--foreground': '#ffffff',
    '--card': '#1a1d27',
    '--border': '#2a2d3e',
    '--primary': '#5d90f7',
    '--primary-foreground': '#ffffff',
    '--muted': '#9ca3af',
    '--muted-foreground': '#6b7280',
  }),
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export default function RootLayout() {
  const loadSession = useAuthStore(s => s.loadSession);
  const resolved = useResolvedTheme();

  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView
      style={[{ flex: 1 }, themes[resolved]]}
      className={`flex-1 bg-background ${resolved === 'dark' ? 'dark' : ''}`}
    >
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={queryClient}>
          <SafeAreaProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
            </Stack>
            <StatusBar style={resolved === 'dark' ? 'light' : 'dark'} />
          </SafeAreaProvider>
        </QueryClientProvider>
      </I18nextProvider>
    </GestureHandlerRootView>
  );
}

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
    '--system-background': '#ffffff',
    '--secondary-system-background': '#f2f2f7',
    '--tertiary-system-background': '#ffffff',
    '--system-grouped-background': '#f2f2f7',
    '--secondary-system-grouped-background': '#ffffff',
    '--tertiary-system-grouped-background': '#f2f2f7',
    '--label': '#000000',
    '--secondary-label': '#3c3c4399',
    '--tertiary-label': '#3c3c434d',
    '--quaternary-label': '#3c3c432d',
    '--system-fill': '#78788033',
    '--secondary-system-fill': '#78788028',
    '--separator': '#3c3c4349',
    '--opaque-separator': '#c6c6c8',
    '--system-blue': '#007aff',
    '--system-green': '#34c759',
    '--system-red': '#ff3b30',
    '--system-orange': '#ff9500',
    '--system-yellow': '#ffcc00',
    '--system-purple': '#af52de',
    '--system-gray': '#8e8e93',
    '--system-gray2': '#aeaeb2',
    '--system-gray3': '#c7c7cc',
    '--system-gray4': '#d1d1d6',
    '--system-gray5': '#e5e5ea',
    '--system-gray6': '#f2f2f7',
    '--background': '#f2f2f7',
    '--foreground': '#000000',
    '--card': '#ffffff',
    '--border': '#3c3c4349',
    '--primary': '#007aff',
    '--primary-foreground': '#ffffff',
    '--muted': '#8e8e93',
    '--muted-foreground': '#3c3c4399',
  }),
  dark: vars({
    '--system-background': '#000000',
    '--secondary-system-background': '#1c1c1e',
    '--tertiary-system-background': '#2c2c2e',
    '--system-grouped-background': '#000000',
    '--secondary-system-grouped-background': '#1c1c1e',
    '--tertiary-system-grouped-background': '#2c2c2e',
    '--label': '#ffffff',
    '--secondary-label': '#ebebf599',
    '--tertiary-label': '#ebebf54d',
    '--quaternary-label': '#ebebf52d',
    '--system-fill': '#7878805c',
    '--secondary-system-fill': '#78788052',
    '--separator': '#54545899',
    '--opaque-separator': '#38383a',
    '--system-blue': '#0a84ff',
    '--system-green': '#30d158',
    '--system-red': '#ff453a',
    '--system-orange': '#ff9f0a',
    '--system-yellow': '#ffd60a',
    '--system-purple': '#bf5af2',
    '--system-gray': '#8e8e93',
    '--system-gray2': '#636366',
    '--system-gray3': '#48484a',
    '--system-gray4': '#3a3a3c',
    '--system-gray5': '#2c2c2e',
    '--system-gray6': '#1c1c1e',
    '--background': '#000000',
    '--foreground': '#ffffff',
    '--card': '#1c1c1e',
    '--border': '#54545899',
    '--primary': '#0a84ff',
    '--primary-foreground': '#ffffff',
    '--muted': '#8e8e93',
    '--muted-foreground': '#ebebf599',
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
      className={`flex-1 bg-systemGroupedBackground ${resolved === 'dark' ? 'dark' : ''}`}
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

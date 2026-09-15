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
import { SplashScreen, Stack, type ErrorBoundaryProps } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SymbolView } from 'expo-symbols';
import { I18nextProvider } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
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
              <Stack.Screen name="referral" options={{ presentation: 'modal', headerShown: false }} />
            </Stack>
            <StatusBar style={resolved === 'dark' ? 'light' : 'dark'} />
          </SafeAreaProvider>
        </QueryClientProvider>
      </I18nextProvider>
    </GestureHandlerRootView>
  );
}

/**
 * Root Error Boundary for Expo Router
 * Catches any fatal JavaScript rendering errors and displays a native iOS-themed fallback UI.
 */
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <SafeAreaView className="flex-1 bg-systemGroupedBackground justify-center items-center px-6">
      <View className="w-full max-w-sm items-center">
        {/* iOS Warning Icon Badge */}
        <View className="h-16 w-16 items-center justify-center rounded-2xl bg-systemRed/10 mb-4">
          <SymbolView
            name={{ ios: 'exclamationmark.triangle.fill', android: 'warning' }}
            size={36}
            tintColor="#ff3b30"
          />
        </View>

        {/* HIG Title & Subtitle */}
        <Text className="text-ios-title2 font-bold text-label text-center mb-2">
          Đã có lỗi xảy ra
        </Text>
        <Text className="text-ios-body text-secondaryLabel text-center mb-6">
          Ứng dụng gặp phải sự cố không mong muốn. Bạn có thể thử lại để tiếp tục phiên tập luyện.
        </Text>

        {/* Developer Diagnostics (Dev-only) */}
        {__DEV__ && (
          <ScrollView className="max-h-40 w-full rounded-ios-cell bg-secondarySystemGroupedBackground p-3 mb-6">
            <Text className="text-ios-caption1 font-mono text-systemRed">
              {error.message}
            </Text>
          </ScrollView>
        )}

        {/* Recovery Action CTA */}
        <Pressable
          onPress={retry}
          className="w-full h-12 rounded-ios-card bg-systemBlue items-center justify-center active:opacity-85"
        >
          <Text className="text-ios-headline text-white font-semibold">
            Thử lại
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

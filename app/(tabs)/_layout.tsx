/**
 * Pam App — Tabs Layout
 */
import { StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';

import { Colors } from '@constants/Colors';
import { useResolvedTheme } from '@hooks/useResolvedTheme';
import { useTranslation } from 'react-i18next';

export default function TabsLayout() {
  const resolved = useResolvedTheme();
  const theme = Colors[resolved];
  const { t } = useTranslation();

  const isIOS = Platform.OS === 'ios';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          backgroundColor: theme.background,
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView
              intensity={95}
              tint={resolved === 'dark' ? 'systemChromeMaterialDark' : 'systemChromeMaterialLight'}
              style={StyleSheet.absoluteFill}
            />
          ) : undefined,
        tabBarStyle: {
          backgroundColor: isIOS ? 'transparent' : theme.card,
          borderTopColor: theme.border,
          borderTopWidth: StyleSheet.hairlineWidth,
          position: isIOS ? 'absolute' : 'relative',
          paddingBottom: isIOS ? 20 : 4,
          height: isIOS ? 84 : 60,
          elevation: 0,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.muted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: 'Inter_500Medium',
          marginBottom: isIOS ? 0 : 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("tabs.home"),
          tabBarIcon: ({ color, size }) => (
            <SymbolView
              name={{ ios: 'house.fill', android: 'home' }}
              size={size}
              tintColor={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: t("tabs.settings"),
          tabBarIcon: ({ color, size }) => (
            <SymbolView
              name={{ ios: 'gearshape.fill', android: 'settings' }}
              size={size}
              tintColor={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

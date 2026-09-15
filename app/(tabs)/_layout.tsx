/**
 * Pam App — Tabs Layout
 */
import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';

import { Colors } from '@constants/Colors';
import { useResolvedTheme } from '@hooks/useResolvedTheme';
import { useTranslation } from 'react-i18next';

export default function TabsLayout() {
  const resolved = useResolvedTheme();
  const theme = Colors[resolved];
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          backgroundColor: theme.background,
        },
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
          borderTopWidth: 1,
          paddingBottom: 4,
          height: 60,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.muted,
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Inter_500Medium',
          marginBottom: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("tabs.home"),
          tabBarIcon: ({ color, size }) => (
            <SymbolView
              name={{ ios: 'house', android: 'home' }}
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
              name={{ ios: 'gearshape', android: 'settings' }}
              size={size}
              tintColor={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

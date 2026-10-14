/**
 * Pam App — Tabs Layout
 */
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet } from 'react-native';

import { NativeIcon } from '@components/common';

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
          paddingBottom: isIOS ? 22 : 6,
          paddingTop: isIOS ? 8 : 4,
          height: isIOS ? 84 : 64,
          elevation: 0,
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarIconStyle: {
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.muted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: 'Inter_500Medium',
          marginTop: isIOS ? 3 : 2,
          marginBottom: 0,
        },
      }}
    >
      <Tabs.Screen
        name="timer"
        options={{
          title: t('tabs.timer'),
          tabBarIcon: ({ color, size }) => (
            <NativeIcon name="timer" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          title: t("tabs.home"),
          tabBarIcon: ({ color, size }) => (
            <NativeIcon name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: t("tabs.settings"),
          tabBarIcon: ({ color, size }) => (
            <NativeIcon name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

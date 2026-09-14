/**
 * Pam App — Tabs Layout
 *
 * Responsibilities:
 *  1. Dynamically applies dark/light NativeWind class to the root container
 *     so all `dark:` utility classes resolve correctly (NFN-S2).
 *  2. Passes the resolved theme to <Tabs> so the tab bar chrome adapts.
 *
 * Architecture note: This is the single point where the resolved theme is
 * injected into the navigation chrome. Child screens consume theme classes
 * directly via NativeWind — no prop-drilling required.
 */
import { Tabs } from 'expo-router';
import { View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useResolvedTheme } from '@hooks/useResolvedTheme';
import { useSettingsStore } from '@store/useSettingsStore';

// ─── Tab bar colours derived from resolved theme ───────────────────────────────
const TAB_THEME = {
  dark: {
    backgroundColor: '#0f1117',
    borderTopColor: '#2a2d3e',
    activeTintColor: '#5d90f7',
    inactiveTintColor: '#6b7280',
  },
  light: {
    backgroundColor: '#ffffff',
    borderTopColor: '#e5e7eb',
    activeTintColor: '#3a6ef2',
    inactiveTintColor: '#9ca3af',
  },
} as const;

export default function TabsLayout() {
  const resolved = useResolvedTheme();
  const tabColors = TAB_THEME[resolved];

  return (
    // NFN-S2: Adding the `dark` class to the root View activates all
    // `dark:` NativeWind utilities in the entire subtree in real time.
    <View className={`flex-1 ${resolved === 'dark' ? 'dark' : ''}`}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: tabColors.backgroundColor,
            borderTopColor: tabColors.borderTopColor,
            borderTopWidth: 1,
            paddingBottom: 4,
            height: 60,
          },
          tabBarActiveTintColor: tabColors.activeTintColor,
          tabBarInactiveTintColor: tabColors.inactiveTintColor,
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Inter_500Medium',
            marginBottom: 4,
          },
        }}
      >
        {/* FN-S3: Settings tab with gear icon ─────────────────────────────── */}
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

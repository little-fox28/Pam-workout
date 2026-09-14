/**
 * Pam App — Settings Screen
 *
 * Verification harness for FN-S1 (Theme Toggle) and FN-S2 (Language Switch).
 * This screen intentionally contains only the core toggle controls — no
 * decorative UI — so the developer can validate state wiring in isolation
 * before composing richer UI.
 *
 * NFN-S2: Both the Zustand store subscription and `useTranslation()` re-render
 *         this component synchronously on any change — no reload required.
 */
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '@lib/i18n';
import { type ThemeMode, useSettingsStore } from '@store/useSettingsStore';
import { useResolvedTheme } from '@hooks/useResolvedTheme';

// ─── Theme option config ──────────────────────────────────────────────────────
const THEME_OPTIONS: { value: ThemeMode; icon: keyof typeof Ionicons.glyphMap }[] = [
  { value: 'light',  icon: 'sunny-outline' },
  { value: 'dark',   icon: 'moon-outline' },
  { value: 'system', icon: 'phone-portrait-outline' },
];

export default function SettingsScreen() {
  const { t } = useTranslation();
  const resolved = useResolvedTheme();
  const { themeMode, language, setThemeMode, setLanguage } = useSettingsStore();
  const isDark = resolved === 'dark';

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-surface' : 'bg-gray-50'}`}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        className="flex-1"
      >
        {/* Header */}
        <View className="px-5 py-6">
          <Text className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t('settings.theme')} & {t('settings.language')}
          </Text>
          <Text className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            FN-S1 · FN-S2 verification
          </Text>
        </View>

        {/* FN-S1: Theme Toggle */}
        <SectionCard isDark={isDark} title={t('settings.themeTitle')} subtitle={t('settings.themeSubtitle')}>
          <View className="mt-3 flex-row gap-2">
            {THEME_OPTIONS.map(({ value, icon }) => {
              const isActive = themeMode === value;
              const label = value === 'system'
                ? t('settings.themeSystem')
                : value === 'light'
                ? t('settings.themeLight')
                : t('settings.themeDark');
              return (
                <TouchableOpacity
                  key={value}
                  onPress={() => setThemeMode(value)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isActive }}
                  accessibilityLabel={label}
                  className={[
                    'flex-1 items-center justify-center rounded-xl py-3 gap-1 border',
                    isActive
                      ? 'border-primary-500 bg-primary-500/10'
                      : isDark
                      ? 'border-surface-border bg-surface-card'
                      : 'border-gray-200 bg-white',
                  ].join(' ')}
                >
                  <Ionicons
                    name={icon}
                    size={22}
                    color={isActive ? '#3a6ef2' : isDark ? '#9ca3af' : '#6b7280'}
                  />
                  <Text
                    className={`text-xs font-medium capitalize ${
                      isActive ? 'text-primary-400' : isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </SectionCard>

        {/* FN-S2: Language Switch */}
        <SectionCard isDark={isDark} title={t('settings.languageTitle')} subtitle={t('settings.languageSubtitle')}>
          <View className="mt-3 gap-2">
            {SUPPORTED_LANGUAGES.map(({ code, nativeLabel }) => {
              const isActive = language === code;
              return (
                <TouchableOpacity
                  key={code}
                  onPress={() => setLanguage(code as SupportedLanguage)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isActive }}
                  className={[
                    'flex-row items-center justify-between rounded-xl px-4 py-3 border',
                    isActive
                      ? 'border-primary-500 bg-primary-500/10'
                      : isDark
                      ? 'border-surface-border bg-surface-card'
                      : 'border-gray-200 bg-white',
                  ].join(' ')}
                >
                  <Text
                    className={`text-base font-medium ${
                      isActive ? 'text-primary-400' : isDark ? 'text-white' : 'text-gray-800'
                    }`}
                  >
                    {nativeLabel}
                  </Text>
                  {isActive && (
                    <Ionicons name="checkmark-circle" size={20} color="#3a6ef2" />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </SectionCard>

        {/* Debug badge — remove before production */}
        <View className="mx-5 mt-6 rounded-xl bg-yellow-500/10 border border-yellow-500/30 px-4 py-3">
          <Text className="text-xs font-mono text-yellow-600">
            Resolved: <Text className="font-bold">{resolved}</Text>
            {'  ·  '}Lang: <Text className="font-bold">{language}</Text>
            {'  ·  '}i18n: <Text className="font-bold">{t('common.appName')}</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Section card ─────────────────────────────────────────────────────────────
function SectionCard({
  children,
  title,
  subtitle,
  isDark,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  isDark: boolean;
}) {
  return (
    <View
      className={[
        'mx-5 mb-4 rounded-2xl border p-4',
        isDark ? 'bg-surface-card border-surface-border' : 'bg-white border-gray-200',
      ].join(' ')}
    >
      <Text className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </Text>
      <Text className={`mt-0.5 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        {subtitle}
      </Text>
      {children}
    </View>
  );
}

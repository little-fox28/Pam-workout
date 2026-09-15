/**
 * Pam App — Settings Screen
 *
 * This screen intentionally contains only the core toggle controls — no
 * decorative UI — so the developer can validate state wiring in isolation
 * before composing richer UI.
 */
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SymbolView, type SFSymbol, type AndroidSymbol } from 'expo-symbols';
import { useTranslation } from 'react-i18next';

import { Colors } from '@constants/Colors';
import { useResolvedTheme } from '@hooks/useResolvedTheme';
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '@lib/i18n';
import { type ThemeMode, useSettingsStore } from '@store/useSettingsStore';

type ThemeSymbol = {
  ios: SFSymbol;
  android: AndroidSymbol;
};

// ─── Theme option config ──────────────────────────────────────────────────────
const THEME_OPTIONS: { value: ThemeMode; icon: ThemeSymbol }[] = [
  { value: 'light', icon: { ios: 'sun.max', android: 'light_mode' } },
  { value: 'dark', icon: { ios: 'moon', android: 'dark_mode' } },
  { value: 'system', icon: { ios: 'iphone', android: 'smartphone' } },
];

export default function SettingsScreen() {
  const { t } = useTranslation();
  const resolved = useResolvedTheme();
  const theme = Colors[resolved];
  const { themeMode, language, setThemeMode, setLanguage } = useSettingsStore();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        className="flex-1"
      >
        {/* Header */}
        <View className="px-5 py-6">
          <Text className="text-3xl font-bold text-foreground">
            {t('settings.settingsTitle')}
          </Text>
        </View>

        {/* Theme Toggle */}
        <SectionCard title={t('settings.themeTitle')} subtitle={t('settings.themeSubtitle')}>
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
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-card',
                  ].join(' ')}
                >
                  <SymbolView
                    name={icon}
                    size={22}
                    tintColor={isActive ? theme.primary : theme.muted}
                  />
                  <Text
                    className={`text-xs font-medium capitalize ${isActive ? 'text-primary' : 'text-muted-foreground'
                      }`}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </SectionCard>

        {/* Language Switch */}
        <SectionCard title={t('settings.languageTitle')} subtitle={t('settings.languageSubtitle')}>
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
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-card',
                  ].join(' ')}
                >
                  <Text
                    className={`text-base font-medium ${isActive ? 'text-primary' : 'text-foreground'
                      }`}
                  >
                    {nativeLabel}
                  </Text>
                  {isActive && (
                    <SymbolView
                      name={{ ios: 'checkmark.circle.fill', android: 'check_circle' }}
                      size={20}
                      tintColor={theme.primary}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </SectionCard>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Section card ─────────────────────────────────────────────────────────────
function SectionCard({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <View className="mx-5 mb-4 rounded-2xl border p-4 bg-card border-border">
      <Text className="text-base font-semibold text-foreground">
        {title}
      </Text>
      <Text className="mt-0.5 text-xs text-muted-foreground">
        {subtitle}
      </Text>
      {children}
    </View>
  );
}

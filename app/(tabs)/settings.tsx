/**
 * Pam App — iOS-First Settings Screen
 * Built according to Apple Human Interface Guidelines (Inset Grouped Form)
 */
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ListGroup, ListRow } from '@components/ios';
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '@lib/i18n';
import { useSettingsStore } from '@store/useSettingsStore';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { themeMode, language, setThemeMode, setLanguage } = useSettingsStore();

  return (
    <SafeAreaView className="flex-1 bg-systemGroupedBackground" edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        {/* iOS Large Title */}
        <View className="px-4 pt-3 pb-4">
          <Text className="text-ios-largeTitle font-bold text-label">
            {t('settings.settingsTitle')}
          </Text>
        </View>

        {/* Appearance Group */}
        <ListGroup
          header={t('settings.themeTitle')}
          footer={t('settings.themeSubtitle')}
        >
          <ListRow
            title={t('settings.themeLight')}
            icon={{
              ios: 'sun.max.fill',
              android: 'light_mode',
              backgroundColor: '#ff9500',
            }}
            type="checkmark"
            checked={themeMode === 'light'}
            onPress={() => setThemeMode('light')}
          />
          <ListRow
            title={t('settings.themeDark')}
            icon={{
              ios: 'moon.fill',
              android: 'dark_mode',
              backgroundColor: '#5856d6',
            }}
            type="checkmark"
            checked={themeMode === 'dark'}
            onPress={() => setThemeMode('dark')}
          />
          <ListRow
            title={t('settings.themeSystem')}
            icon={{
              ios: 'iphone',
              android: 'smartphone',
              backgroundColor: '#8e8e93',
            }}
            type="checkmark"
            checked={themeMode === 'system'}
            onPress={() => setThemeMode('system')}
          />
        </ListGroup>

        {/* Language Group */}
        <ListGroup
          header={t('settings.languageTitle')}
          footer={t('settings.languageSubtitle')}
        >
          {SUPPORTED_LANGUAGES.map(({ code, nativeLabel }) => (
            <ListRow
              key={code}
              title={nativeLabel}
              icon={{
                ios: 'globe',
                android: 'language',
                backgroundColor: '#007aff',
              }}
              type="checkmark"
              checked={language === code}
              onPress={() => setLanguage(code as SupportedLanguage)}
            />
          ))}
        </ListGroup>
      </ScrollView>
    </SafeAreaView>
  );
}

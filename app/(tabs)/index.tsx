import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

export default function HomeScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView className="flex-1 bg-systemGroupedBackground" edges={['top', 'left', 'right']}>
      <View className="px-4 pt-3 pb-4">
        <Text className="text-ios-largeTitle font-bold text-label">
          {t('tabs.home')}
        </Text>
      </View>

      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-ios-title2 font-bold text-label">Welcome to Pam</Text>
        <Text className="mt-2 text-center text-ios-body text-secondaryLabel">
          Your iOS-first workout tracking companion
        </Text>
      </View>
    </SafeAreaView>
  );
}

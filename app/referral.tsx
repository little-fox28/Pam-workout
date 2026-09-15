/**
 * Pam App — Gym Referral Screen (Deep Link Target)
 * 
 * Handles deep links such as:
 * - pam://referral?code=GYM2026
 * - https://pam.app/referral?code=GYM2026
 */
import { router, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ListGroup, ListRow } from '@components/ios';
import { useAppPermissions } from '@hooks/useAppPermissions';

export default function ReferralScreen() {
  const { code: initialCode } = useLocalSearchParams<{ code?: string }>();
  const [referralCode, setReferralCode] = useState(initialCode ?? '');
  const [applied, setApplied] = useState(false);
  const { requestCameraPermission } = useAppPermissions();

  const handleApplyCode = () => {
    if (!referralCode.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập hoặc quét mã giới thiệu phòng tập.');
      return;
    }
    setApplied(true);
    Alert.alert(
      'Áp dụng thành công!',
      `Mã giới thiệu ${referralCode.toUpperCase()} đã được kích hoạt. Bạn nhận được ưu đãi 30 ngày tập luyện cao cấp!`,
      [{ text: 'Tiếp tục', onPress: () => router.back() }]
    );
  };

  const handleScanQR = async () => {
    const granted = await requestCameraPermission();
    if (granted) {
      Alert.alert(
        'Quét mã QR',
        'Sẵn sàng quét mã QR tại quầy tiếp tân của phòng gym đối tác.'
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-systemGroupedBackground" edges={['top', 'bottom']}>
      {/* iOS Modal Navigation Bar */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <Text className="text-ios-headline font-semibold text-label">
          Mã giới thiệu phòng tập
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="h-8 w-8 items-center justify-center rounded-full bg-systemFill active:opacity-70"
        >
          <SymbolView
            name={{ ios: 'xmark', android: 'close' }}
            size={14}
            tintColor="#8e8e93"
          />
        </Pressable>
      </View>

      <View className="flex-1 px-4 pt-4">
        {/* Banner Card */}
        <View className="items-center rounded-ios-card bg-secondarySystemGroupedBackground p-6 mb-6">
          <View className="h-16 w-16 items-center justify-center rounded-2xl bg-systemBlue/10 mb-3">
            <SymbolView
              name={{ ios: 'gift.fill', android: 'card_giftcard' }}
              size={32}
              tintColor="#007aff"
            />
          </View>
          <Text className="text-ios-title3 font-bold text-label text-center">
            Ưu đãi từ Đối tác Gym
          </Text>
          <Text className="mt-1 text-ios-subhead text-secondaryLabel text-center">
            Nhận ngay đặc quyền tập luyện và giáo án cá nhân hoá khi kích hoạt mã giới thiệu.
          </Text>

          {/* Referral Code Badge */}
          <View className="mt-4 rounded-ios-cell border border-separator bg-systemGroupedBackground px-6 py-3">
            <Text className="text-ios-title2 font-mono font-bold tracking-widest text-systemBlue">
              {referralCode || 'CHƯA CÓ MÃ'}
            </Text>
          </View>
        </View>

        {/* Action Options */}
        <ListGroup header="Phương thức nhập mã">
          <ListRow
            title="Quét mã QR tại phòng tập"
            subtitle="Dùng camera quét nhanh mã QR tại quầy"
            icon={{
              ios: 'qrcode.viewfinder',
              android: 'qr_code_scanner',
              backgroundColor: '#34c759',
            }}
            type="navigation"
            onPress={handleScanQR}
          />
        </ListGroup>

        {/* Apply CTA Button */}
        <View className="mt-auto pb-4">
          <Pressable
            disabled={applied}
            onPress={handleApplyCode}
            className={`h-12 w-full items-center justify-center rounded-ios-card ${
              applied ? 'bg-systemGray4' : 'bg-systemBlue active:opacity-85'
            }`}
          >
            <Text className="text-ios-headline font-semibold text-white">
              {applied ? 'Đã kích hoạt ưu đãi' : 'Kích hoạt mã ưu đãi'}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

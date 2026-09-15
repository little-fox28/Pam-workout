/**
 * Pam App — Centralized Permissions Manager
 * 
 * Provides a unified API for managing system permissions (Camera & Notifications).
 * Handles checking, requesting, graceful denial interception, and prompting redirect
 * to native OS Settings according to Apple Human Interface Guidelines.
 */
import { useCallback, useState } from 'react';
import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';

export type PermissionType = 'camera' | 'notifications';
export type PermissionStatus = 'undetermined' | 'granted' | 'denied' | 'blocked';

export interface PermissionState {
  camera: PermissionStatus;
  notifications: PermissionStatus;
}

export function useAppPermissions() {
  const [permissions, setPermissions] = useState<PermissionState>({
    camera: 'undetermined',
    notifications: 'undetermined',
  });

  /**
   * Opens native OS App Settings page via Linking
   */
  const openSystemSettings = useCallback(async () => {
    try {
      await Linking.openSettings();
    } catch {
      // Fallback
    }
  }, []);

  /**
   * Prompts native alert directing user to settings when permission is permanently denied/blocked
   */
  const promptSettingsRedirect = useCallback(
    (title: string, message: string) => {
      Alert.alert(title, message, [
        { text: 'Huỷ', style: 'cancel' },
        { text: 'Mở Cài đặt', onPress: openSystemSettings },
      ]);
    },
    [openSystemSettings]
  );

  /**
   * Camera permission handler (used by Gym Referral QR code scanner)
   */
  const requestCameraPermission = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Quyền truy cập Camera',
            message: 'Pam cần quyền camera để quét mã QR giới thiệu phòng tập của bạn.',
            buttonNeutral: 'Hỏi lại sau',
            buttonNegative: 'Huỷ',
            buttonPositive: 'Đồng ý',
          }
        );
        const isGranted = granted === PermissionsAndroid.RESULTS.GRANTED;
        setPermissions(prev => ({
          ...prev,
          camera: isGranted ? 'granted' : 'denied',
        }));
        if (!isGranted && granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          promptSettingsRedirect(
            'Quyền truy cập Camera bị từ chối',
            'Vui lòng bật quyền truy cập camera trong Cài đặt để quét mã QR phòng tập.'
          );
        }
        return isGranted;
      } catch {
        return false;
      }
    }

    // iOS flow
    if (permissions.camera === 'denied' || permissions.camera === 'blocked') {
      promptSettingsRedirect(
        'Quyền truy cập Camera',
        'Vui lòng cho phép Pam truy cập Camera trong Cài đặt để quét mã QR giới thiệu phòng tập.'
      );
      return false;
    }

    setPermissions(prev => ({ ...prev, camera: 'granted' }));
    return true;
  }, [permissions.camera, promptSettingsRedirect]);

  /**
   * Notifications permission handler (used by 3-2-1 timer background alerts)
   */
  const requestNotificationPermission = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      try {
        const granted = await PermissionsAndroid.request(
          'android.permission.POST_NOTIFICATIONS' as any,
          {
            title: 'Quyền thông báo',
            message: 'Pam cần quyền gửi thông báo để đếm ngược 3-2-1 khi nghỉ ngơi.',
            buttonNeutral: 'Hỏi lại sau',
            buttonNegative: 'Huỷ',
            buttonPositive: 'Đồng ý',
          }
        );
        const isGranted = granted === PermissionsAndroid.RESULTS.GRANTED;
        setPermissions(prev => ({
          ...prev,
          notifications: isGranted ? 'granted' : 'denied',
        }));
        if (!isGranted && granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          promptSettingsRedirect(
            'Quyền thông báo bị tắt',
            'Vui lòng bật thông báo trong Cài đặt để nhận cảnh báo đếm ngược khi nghỉ.'
          );
        }
        return isGranted;
      } catch {
        return false;
      }
    }

    if (permissions.notifications === 'denied' || permissions.notifications === 'blocked') {
      promptSettingsRedirect(
        'Quyền thông báo',
        'Vui lòng cho phép Pam gửi thông báo trong Cài đặt để nhận cảnh báo đếm ngược nghỉ ngơi.'
      );
      return false;
    }

    setPermissions(prev => ({ ...prev, notifications: 'granted' }));
    return true;
  }, [permissions.notifications, promptSettingsRedirect]);

  return {
    permissions,
    requestCameraPermission,
    requestNotificationPermission,
    openSystemSettings,
    promptSettingsRedirect,
  };
}

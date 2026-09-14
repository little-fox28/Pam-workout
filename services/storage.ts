/**
 * Pam App — Secure Storage helper (wraps expo-secure-store / AsyncStorage)
 * Abstracted so the underlying storage engine can be swapped.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

export const setItem = async (key: string, value: string): Promise<void> => {
  await AsyncStorage.setItem(key, value);
};

export const getItem = async (key: string): Promise<string | null> => {
  return AsyncStorage.getItem(key);
};

export const removeItem = async (key: string): Promise<void> => {
  await AsyncStorage.removeItem(key);
};

export const clearAll = async (): Promise<void> => {
  await AsyncStorage.clear();
};

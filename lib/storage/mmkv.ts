import { StateStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Interface chuẩn cho Storage Adapter
export interface IAppStorage {
  getItem: (name: string) => string | null | Promise<string | null>;
  setItem: (name: string, value: string) => void | Promise<void>;
  removeItem: (name: string) => void | Promise<void>;
}

export const createAppStorage = (): StateStorage => {
  return {
    getItem: (name: string) => AsyncStorage.getItem(name),
    setItem: (name: string, value: string) => AsyncStorage.setItem(name, value),
    removeItem: (name: string) => AsyncStorage.removeItem(name),
  };
};

export const mmkvStorage = createAppStorage();

import { create } from 'zustand';
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware';

export type TimerMode = 'SETS' | 'WORK' | 'REST';

export interface TimerState {
  mode: TimerMode;
  currentReps: number;
  completedSets: number;
  restDuration: number;
  repHistory: number[];
}

export interface TimerActions {
  setMode: (mode: TimerMode) => void;
  incrementRep: () => void;
  decrementRep: () => void;
  resetReps: () => void;
  completeSet: () => void;
  setRestDuration: (duration: number) => void;
}

export type TimerStore = TimerState & TimerActions;

/**
 * MMKV Storage Engine with Memory Fallback for Jest & Non-JSI environments.
 */
const createMMKVStorage = (): StateStorage => {
  try {
    const { MMKV } = require('react-native-mmkv');
    const mmkv = new MMKV({ id: 'pam-timer-storage' });
    return {
      getItem: (name: string) => mmkv.getString(name) ?? null,
      setItem: (name: string, value: string) => mmkv.set(name, value),
      removeItem: (name: string) => mmkv.delete(name),
    };
  } catch {
    const memoryStorage = new Map<string, string>();
    return {
      getItem: (name: string) => memoryStorage.get(name) ?? null,
      setItem: (name: string, value: string) => {
        memoryStorage.set(name, value);
      },
      removeItem: (name: string) => {
        memoryStorage.delete(name);
      },
    };
  }
};

export const useTimerStore = create<TimerStore>()(
  persist(
    (set) => ({
      mode: 'SETS',
      currentReps: 0,
      completedSets: 0,
      restDuration: 90,
      repHistory: [],

      setMode: (mode: TimerMode) => set({ mode }),

      incrementRep: () =>
        set((state) => ({
          currentReps: state.currentReps + 1,
        })),

      decrementRep: () =>
        set((state) => ({
          currentReps: Math.max(0, state.currentReps - 1),
        })),

      resetReps: () => set({ currentReps: 0 }),

      completeSet: () =>
        set((state) => ({
          repHistory: [...state.repHistory, state.currentReps],
          completedSets: state.completedSets + 1,
          currentReps: 0,
          mode: 'REST',
        })),

      setRestDuration: (duration: number) => set({ restDuration: duration }),
    }),
    {
      name: 'pam-timer-store',
      storage: createJSONStorage(() => createMMKVStorage()),
    }
  )
);

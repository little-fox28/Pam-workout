import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TimerStore } from '@/types/timer';

export const useTimerStore = create<TimerStore>()(
  persist(
    (set, get) => ({
      // Initial State
      activeMode: 'sets',
      repCount: 0,
      targetReps: 10,
      currentSetSessions: [],

      // Actions
      setActiveMode: (mode) => set({ activeMode: mode }),

      incrementRep: () =>
        set((state) => ({
          repCount: state.repCount + 1,
        })),

      decrementRep: () =>
        set((state) => ({
          repCount: Math.max(0, state.repCount - 1),
        })),

      resetReps: () => set({ repCount: 0 }),

      completeSet: () => {
        const { repCount, targetReps, currentSetSessions } = get();
        set({
          currentSetSessions: [
            ...currentSetSessions,
            {
              repCount,
              targetReps,
              completedAt: Date.now(),
            },
          ],
          repCount: 0,
        });
      },

      setTargetReps: (reps) => set({ targetReps: reps }),
    }),
    {
      name: 'pam-timer-store',
    }
  )
);
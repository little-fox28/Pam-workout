/**
 * Timer feature store (Zustand) — RED PHASE SKELETON.
 *
 * Contract + initial state only. Actions throw until implemented.
 */
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStorage } from '../../../../lib/storage/mmkv';

export type TimerMode = 'SETS' | 'WORK' | 'REST';

export const REST_PRESETS = [30, 60, 90, 120, 180] as const;
export type RestPreset = (typeof REST_PRESETS)[number];

export const DEFAULT_REST_DURATION: RestPreset = 60;

export interface TimerState {
  mode: TimerMode;
  reps: number;
  completedSets: number;
  /** Rep count of each completed set, in completion order. */
  sessionHistory: number[];
  /** Rest duration in seconds; persists across sets and app launches. */
  restDuration: RestPreset;
}

export interface TimerActions {
  setMode: (mode: TimerMode) => void;
  incrementRep: () => void;
  /** Must never go below 0. */
  decrementRep: () => void;
  resetReps: () => void;
  /** Save reps to history, bump completedSets, zero reps, switch to 'REST'. */
  completeSet: () => void;
  /** Accepts only REST_PRESETS values; ignores anything else. */
  setRestDuration: (seconds: RestPreset) => void;
  /** Clears the session; keeps the rest-duration preference. */
  reset: () => void;
}

export type TimerStore = TimerState & TimerActions;

const notImplemented = (): never => {
  throw new Error('Not implemented');
};

export const useTimerStore = create<TimerStore>()(
  persist(
    () => ({
      mode: 'SETS',
      reps: 0,
      completedSets: 0,
      sessionHistory: [],
      restDuration: DEFAULT_REST_DURATION,

      setMode: () => notImplemented(), // TODO: Implement to pass test
      incrementRep: () => notImplemented(), // TODO: Implement to pass test
      decrementRep: () => notImplemented(), // TODO: Implement to pass test
      resetReps: () => notImplemented(), // TODO: Implement to pass test
      completeSet: () => notImplemented(), // TODO: Implement to pass test
      setRestDuration: () => notImplemented(), // TODO: Implement to pass test
      reset: () => notImplemented(), // TODO: Implement to pass test
    }),
    {
      name: '@pam/timer',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({ restDuration: state.restDuration }),
    }
  )
);

import { create } from 'zustand';

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

export const useTimerStore = create<TimerStore>(() => ({
  // Initial State
  mode: 'SETS',
  currentReps: 0,
  completedSets: 0,
  restDuration: 90,
  repHistory: [],

  // Actions
  setMode: (_mode: TimerMode) => {
    // TODO: Implement
  },
  incrementRep: () => {
    // TODO: Implement
  },
  decrementRep: () => {
    // TODO: Implement
  },
  resetReps: () => {
    // TODO: Implement
  },
  completeSet: () => {
    // TODO: Implement
  },
  setRestDuration: (_duration: number) => {
    // TODO: Implement
  },
}));

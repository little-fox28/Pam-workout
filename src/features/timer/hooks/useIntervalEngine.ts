export type EnginePhase = 'IDLE' | 'BUFFER' | 'WORK' | 'REST';

export interface UseIntervalEngineOptions {
  workDuration?: number;
  restDuration?: number;
  bufferDuration?: number;
}

export interface IntervalEngineReturn {
  phase: EnginePhase;
  bufferRemaining: number;
  workRemaining: number;
  restRemaining: number;
  startWorkout: () => void;
  pauseWorkout: () => void;
  resetWorkout: () => void;
}

export const useIntervalEngine = (
  _options: UseIntervalEngineOptions = {}
): IntervalEngineReturn => {
  // TODO: Implement

  return {
    phase: 'IDLE',
    bufferRemaining: 0,
    workRemaining: _options.workDuration ?? 60,
    restRemaining: _options.restDuration ?? 90,
    startWorkout: () => {
      // TODO: Implement
    },
    pauseWorkout: () => {
      // TODO: Implement
    },
    resetWorkout: () => {
      // TODO: Implement
    },
  };
};

import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

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
  options: UseIntervalEngineOptions = {}
): IntervalEngineReturn => {
  const {
    workDuration = 60,
    restDuration = 90,
    bufferDuration = 3,
  } = options;

  const [phase, setPhase] = useState<EnginePhase>('IDLE');
  const [bufferRemaining, setBufferRemaining] = useState(0);
  const [workRemaining, setWorkRemaining] = useState(workDuration);
  const [restRemaining, setRestRemaining] = useState(restDuration);
  const [isRunning, setIsRunning] = useState(false);

  // Synchronous state ref for tick operations and background delta-time calculation
  const stateRef = useRef({
    phase: 'IDLE' as EnginePhase,
    bufferRemaining: 0,
    workRemaining: workDuration,
    restRemaining: restDuration,
    isRunning: false,
    workDuration,
    restDuration,
    bufferDuration,
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const backgroundTimestampRef = useRef<number | null>(null);

  // Keep options in sync with ref and initial state
  useEffect(() => {
    stateRef.current.workDuration = workDuration;
    stateRef.current.restDuration = restDuration;
    stateRef.current.bufferDuration = bufferDuration;

    if (stateRef.current.phase === 'IDLE') {
      stateRef.current.workRemaining = workDuration;
      stateRef.current.restRemaining = restDuration;
      setWorkRemaining(workDuration);
      setRestRemaining(restDuration);
    }
  }, [workDuration, restDuration, bufferDuration]);

  // Synchronize state between ref (immediate) and React state (render)
  const syncState = useCallback(
    (
      newPhase: EnginePhase,
      newBuffer: number,
      newWork: number,
      newRest: number,
      running?: boolean
    ) => {
      stateRef.current.phase = newPhase;
      stateRef.current.bufferRemaining = newBuffer;
      stateRef.current.workRemaining = newWork;
      stateRef.current.restRemaining = newRest;
      if (running !== undefined) {
        stateRef.current.isRunning = running;
        setIsRunning(running);
      }
      setPhase(newPhase);
      setBufferRemaining(newBuffer);
      setWorkRemaining(newWork);
      setRestRemaining(newRest);
    },
    []
  );

  // ─── 1-Second Tick Handler ───────────────────────────────────────────
  const tick = useCallback(() => {
    const cur = stateRef.current;
    if (!cur.isRunning) return;

    if (cur.phase === 'BUFFER') {
      if (cur.bufferRemaining > 1) {
        syncState('BUFFER', cur.bufferRemaining - 1, cur.workRemaining, cur.restRemaining);
      } else {
        // Buffer completes (3s) -> Enter WORK
        syncState('WORK', 0, cur.workDuration, cur.restRemaining);
      }
    } else if (cur.phase === 'WORK') {
      if (cur.workRemaining > 1) {
        syncState('WORK', 0, cur.workRemaining - 1, cur.restRemaining);
      } else {
        // Work completes -> Enter REST
        syncState('REST', 0, cur.workDuration, cur.restDuration);
      }
    } else if (cur.phase === 'REST') {
      if (cur.restRemaining > 1) {
        syncState('REST', 0, cur.workRemaining, cur.restRemaining - 1);
      } else {
        // Rest completes -> Enter BUFFER before next set
        syncState('BUFFER', cur.bufferDuration, cur.workDuration, cur.restDuration);
      }
    }
  }, [syncState]);

  // Synchronous timer starter to support immediate advanceTimersByTime in tests
  const startInterval = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(tick, 1000);
  }, [tick]);

  const stopInterval = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Cleanup on unmount 
  useEffect(() => {
    return () => {
      stopInterval();
    };
  }, [stopInterval]);

  // ─── Background Delta-Time Compensation  ─────────────────
  const compensateBackgroundTime = useCallback(
    (elapsedSeconds: number) => {
      const cur = stateRef.current;
      let remaining = elapsedSeconds;
      let nextPhase = cur.phase;
      let nextBuffer = cur.bufferRemaining;
      let nextWork = cur.workRemaining;
      let nextRest = cur.restRemaining;

      while (remaining > 0 && cur.isRunning) {
        if (nextPhase === 'BUFFER') {
          if (remaining < nextBuffer) {
            nextBuffer -= remaining;
            remaining = 0;
          } else {
            remaining -= nextBuffer;
            nextPhase = 'WORK';
            nextBuffer = 0;
            nextWork = cur.workDuration;
          }
        } else if (nextPhase === 'WORK') {
          if (remaining < nextWork) {
            nextWork -= remaining;
            remaining = 0;
          } else {
            remaining -= nextWork;
            nextPhase = 'REST';
            nextWork = cur.workDuration;
            nextRest = cur.restDuration;
          }
        } else if (nextPhase === 'REST') {
          if (remaining < nextRest) {
            nextRest -= remaining;
            remaining = 0;
          } else {
            remaining -= nextRest;
            nextPhase = 'BUFFER';
            nextBuffer = cur.bufferDuration;
            nextRest = cur.restDuration;
          }
        } else {
          break;
        }
      }

      syncState(nextPhase, nextBuffer, nextWork, nextRest);
    },
    [syncState]
  );

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        if (nextAppState === 'background') {
          if (stateRef.current.isRunning && stateRef.current.phase !== 'IDLE') {
            backgroundTimestampRef.current = Date.now();
          }
        } else if (nextAppState === 'active') {
          if (backgroundTimestampRef.current !== null && stateRef.current.isRunning) {
            const elapsedMs = Date.now() - backgroundTimestampRef.current;
            backgroundTimestampRef.current = null;
            const elapsedSeconds = Math.floor(elapsedMs / 1000);

            if (elapsedSeconds > 0) {
              compensateBackgroundTime(elapsedSeconds);
            }
          }
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, [compensateBackgroundTime]);

  // ─── Controls ──────────────────────────────────────────────
  const startWorkout = useCallback(() => {
    const cur = stateRef.current;
    if (cur.phase === 'IDLE') {
      syncState('BUFFER', cur.bufferDuration, cur.workDuration, cur.restDuration, true);
    } else {
      stateRef.current.isRunning = true;
      setIsRunning(true);
    }
    startInterval();
  }, [syncState, startInterval]);

  const pauseWorkout = useCallback(() => {
    stateRef.current.isRunning = false;
    setIsRunning(false);
    stopInterval();
  }, [stopInterval]);

  const resetWorkout = useCallback(() => {
    const cur = stateRef.current;
    stopInterval();
    backgroundTimestampRef.current = null;
    syncState('IDLE', 0, cur.workDuration, cur.restDuration, false);
  }, [syncState, stopInterval]);

  return {
    phase,
    bufferRemaining,
    workRemaining,
    restRemaining,
    startWorkout,
    pauseWorkout,
    resetWorkout,
  };
};

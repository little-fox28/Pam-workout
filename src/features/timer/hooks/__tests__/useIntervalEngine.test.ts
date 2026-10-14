import { act } from 'react';
import { renderHook } from '@testing-library/react-native';
import { AppState, type AppStateStatus } from 'react-native';

import { useIntervalEngine } from '../useIntervalEngine';

describe('useIntervalEngine (Phase 2)', () => {
  let appStateListener: ((state: AppStateStatus) => void) | undefined;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
    appStateListener = undefined;

    jest.spyOn(AppState, 'addEventListener').mockImplementation((event: string, listener: any) => {
      if (event === 'change') {
        appStateListener = listener;
      }
      return {
        remove: jest.fn(),
      } as any;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  describe('Initial State', () => {
    it('initializes in IDLE phase with configured duration values', async () => {
      const { result } = await renderHook(() =>
        useIntervalEngine({ workDuration: 45, restDuration: 60 })
      );

      expect(result.current.phase).toBe('IDLE');
      expect(result.current.workRemaining).toBe(45);
      expect(result.current.restRemaining).toBe(60);
    });
  });

  describe('3-2-1 Buffer State Machine', () => {
    it('calling startWorkout() from IDLE transitions phase to BUFFER (not WORK) with bufferRemaining: 3', async () => {
      const { result } = await renderHook(() =>
        useIntervalEngine({ workDuration: 60, restDuration: 90 })
      );

      act(() => {
        result.current.startWorkout();
      });

      expect(result.current.phase).toBe('BUFFER');
      expect(result.current.bufferRemaining).toBe(3);
    });

    it('advancing timers by 1000ms ticks bufferRemaining down: 3 -> 2 -> 1', async () => {
      const { result } = await renderHook(() =>
        useIntervalEngine({ workDuration: 60, restDuration: 90 })
      );

      act(() => {
        result.current.startWorkout();
      });

      expect(result.current.bufferRemaining).toBe(3);

      act(() => {
        jest.advanceTimersByTime(1000);
      });
      expect(result.current.phase).toBe('BUFFER');
      expect(result.current.bufferRemaining).toBe(2);

      act(() => {
        jest.advanceTimersByTime(1000);
      });
      expect(result.current.phase).toBe('BUFFER');
      expect(result.current.bufferRemaining).toBe(1);
    });

    it('at the end of 3000ms buffer, automatically transitions to WORK and starts counting down workRemaining', async () => {
      const { result } = await renderHook(() =>
        useIntervalEngine({ workDuration: 60, restDuration: 90 })
      );

      act(() => {
        result.current.startWorkout();
      });

      // Complete the 3s buffer (3000ms)
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      expect(result.current.phase).toBe('WORK');
      expect(result.current.workRemaining).toBe(60);

      // Verify work countdown ticks
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      expect(result.current.phase).toBe('WORK');
      expect(result.current.workRemaining).toBe(59);
    });
  });

  describe('Work to Rest Transition', () => {
    it('when workRemaining reaches 0, phase transitions to REST and counts down restRemaining', async () => {
      const { result } = await renderHook(() =>
        useIntervalEngine({ workDuration: 45, restDuration: 60 })
      );

      act(() => {
        result.current.startWorkout();
        jest.advanceTimersByTime(3000); // Finish 3s buffer -> enters WORK
      });

      expect(result.current.phase).toBe('WORK');

      // Advance through all 45s of work
      act(() => {
        jest.advanceTimersByTime(45000);
      });

      expect(result.current.phase).toBe('REST');
      expect(result.current.restRemaining).toBe(60);

      // Verify rest countdown ticks
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      expect(result.current.phase).toBe('REST');
      expect(result.current.restRemaining).toBe(59);
    });

    it('when restRemaining reaches 0, it transitions back to BUFFER (3s prep) before WORK', async () => {
      const { result } = await renderHook(() =>
        useIntervalEngine({ workDuration: 30, restDuration: 30 })
      );

      act(() => {
        result.current.startWorkout();
        jest.advanceTimersByTime(3000); // Buffer 1 -> WORK
        jest.advanceTimersByTime(30000); // WORK -> REST
      });

      expect(result.current.phase).toBe('REST');

      // Complete 30s of rest
      act(() => {
        jest.advanceTimersByTime(30000);
      });

      // Must transition to BUFFER for 3s preparation before the next work set
      expect(result.current.phase).toBe('BUFFER');
      expect(result.current.bufferRemaining).toBe(3);

      // Completing the 3s buffer transitions to the next WORK set
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      expect(result.current.phase).toBe('WORK');
      expect(result.current.workRemaining).toBe(30);
    });
  });

  describe('Background Delta-Time Compensation', () => {
    it('recalculates remaining work time using timestamps when app transitions back to active', async () => {
      const { result } = await renderHook(() =>
        useIntervalEngine({ workDuration: 60, restDuration: 90 })
      );

      act(() => {
        result.current.startWorkout();
        jest.advanceTimersByTime(3000); // 3s buffer -> enters WORK
        jest.advanceTimersByTime(10000); // 10s into WORK -> 50s remaining
      });

      expect(result.current.workRemaining).toBe(50);

      // App transitions to background
      act(() => {
        appStateListener?.('background');
      });

      // In background, OS may throttle or pause intervals. Advance system clock by 15 seconds.
      act(() => {
        jest.setSystemTime(Date.now() + 15000);
        // App transitions back to active
        appStateListener?.('active');
      });

      // Hook must compensate using expectedEndTime - Date.now() (50s - 15s = 35s remaining)
      expect(result.current.phase).toBe('WORK');
      expect(result.current.workRemaining).toBe(35);
    });

    it('compensates across phase boundaries if background duration exceeds remaining work time', async () => {
      const { result } = await renderHook(() =>
        useIntervalEngine({ workDuration: 20, restDuration: 60 })
      );

      act(() => {
        result.current.startWorkout();
        jest.advanceTimersByTime(3000); // Enter WORK (20s)
        jest.advanceTimersByTime(15000); // 5s remaining in WORK
      });

      expect(result.current.workRemaining).toBe(5);

      // Background transition for 15s (5s remaining in WORK + 10s into REST)
      act(() => {
        appStateListener?.('background');
        jest.setSystemTime(Date.now() + 15000);
        appStateListener?.('active');
      });

      // Must have transitioned to REST with 10s consumed (60s - 10s = 50s remaining)
      expect(result.current.phase).toBe('REST');
      expect(result.current.restRemaining).toBe(50);
    });
  });
});

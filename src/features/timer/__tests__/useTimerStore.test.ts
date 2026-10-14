import { act } from 'react';

import { REST_PRESETS, useTimerStore } from '../store/useTimerStore';

// In-memory storage so persist middleware never touches native modules.
jest.mock('../../../../lib/storage/mmkv', () => {
  const data = new Map<string, string>();
  return {
    mmkvStorage: {
      getItem: (k: string) => data.get(k) ?? null,
      setItem: (k: string, v: string) => void data.set(k, v),
      removeItem: (k: string) => void data.delete(k),
    },
  };
});

const store = () => useTimerStore.getState();
const run = (fn: () => void) => act(fn);

describe('useTimerStore', () => {
  beforeEach(() => {
    run(() => {
      store().reset();
      store().setRestDuration(60);
    });
  });

  describe('initial state', () => {
    it('starts in SETS mode with zeroed counters and a 60s rest', () => {
      expect(store().mode).toBe('SETS');
      expect(store().reps).toBe(0);
      expect(store().completedSets).toBe(0);
      expect(store().sessionHistory).toEqual([]);
      expect(store().restDuration).toBe(60);
    });
  });

  describe('mode switching', () => {
    it.each(['WORK', 'REST', 'SETS'] as const)('switches to %s', (mode) => {
      run(() => store().setMode(mode));
      expect(store().mode).toBe(mode);
    });

    it('does not alter reps when switching modes', () => {
      run(() => store().incrementRep());
      run(() => store().setMode('WORK'));
      expect(store().reps).toBe(1);
    });
  });

  describe('rep counter (UC-T1)', () => {
    it('increments reps', () => {
      run(() => {
        store().incrementRep();
        store().incrementRep();
      });
      expect(store().reps).toBe(2);
    });

    it('decrements reps', () => {
      run(() => {
        store().incrementRep();
        store().incrementRep();
        store().decrementRep();
      });
      expect(store().reps).toBe(1);
    });

    it('never decrements below 0', () => {
      run(() => {
        store().decrementRep();
        store().decrementRep();
      });
      expect(store().reps).toBe(0);
    });

    it('resets reps to 0', () => {
      run(() => {
        store().incrementRep();
        store().incrementRep();
        store().resetReps();
      });
      expect(store().reps).toBe(0);
    });

    it('resetReps does not touch history or completed sets', () => {
      run(() => {
        store().incrementRep();
        store().completeSet();
        store().incrementRep();
        store().resetReps();
      });
      expect(store().completedSets).toBe(1);
      expect(store().sessionHistory).toHaveLength(1);
    });
  });

  describe('completeSet', () => {
    it('saves current reps to session history', () => {
      run(() => {
        for (let i = 0; i < 8; i++) store().incrementRep();
        store().completeSet();
      });
      expect(store().sessionHistory).toEqual([8]);
    });

    it('increments the completed sets counter', () => {
      run(() => {
        store().incrementRep();
        store().completeSet();
      });
      expect(store().completedSets).toBe(1);
    });

    it('switches mode to REST', () => {
      run(() => {
        store().incrementRep();
        store().completeSet();
      });
      expect(store().mode).toBe('REST');
    });

    it('resets the rep counter for the next set', () => {
      run(() => {
        store().incrementRep();
        store().completeSet();
      });
      expect(store().reps).toBe(0);
    });

    it('accumulates history across multiple sets in order', () => {
      run(() => {
        store().incrementRep();
        store().incrementRep();
        store().completeSet();
        store().setMode('SETS');
        store().incrementRep();
        store().completeSet();
      });
      expect(store().sessionHistory).toEqual([2, 1]);
      expect(store().completedSets).toBe(2);
    });

    it('does not mutate a previously captured history array', () => {
      run(() => {
        store().incrementRep();
        store().completeSet();
      });
      const before = store().sessionHistory;
      run(() => {
        store().incrementRep();
        store().completeSet();
      });
      expect(before).toEqual([1]);
      expect(store().sessionHistory).not.toBe(before);
    });
  });

  describe('rest quick-config (UC-T3)', () => {
    it.each(REST_PRESETS)('accepts preset %is', (seconds) => {
      run(() => store().setRestDuration(seconds));
      expect(store().restDuration).toBe(seconds);
    });

    it('exposes the 30/60/90/120/180 presets', () => {
      expect([...REST_PRESETS]).toEqual([30, 60, 90, 120, 180]);
    });

    it('persists the chosen duration for subsequent sets', () => {
      run(() => {
        store().setRestDuration(120);
        store().incrementRep();
        store().completeSet();
        store().setMode('SETS');
        store().incrementRep();
        store().completeSet();
      });
      expect(store().restDuration).toBe(120);
    });

    it.each([0, -30, NaN, Infinity, 61, 300])('ignores invalid value %p', (value) => {
      run(() => store().setRestDuration(value as never));
      expect(store().restDuration).toBe(60);
    });

    it('keeps the previous valid duration after an invalid attempt', () => {
      run(() => store().setRestDuration(90));
      run(() => store().setRestDuration(45 as never));
      expect(store().restDuration).toBe(90);
    });
  });

  describe('edge cases', () => {
    it('completeSet with 0 reps records a 0 entry', () => {
      run(() => store().completeSet());
      expect(store().sessionHistory).toEqual([0]);
      expect(store().completedSets).toBe(1);
      expect(store().mode).toBe('REST');
    });

    it('completeSet from WORK mode still switches to REST', () => {
      run(() => {
        store().setMode('WORK');
        store().incrementRep();
        store().completeSet();
      });
      expect(store().mode).toBe('REST');
    });

    it('keeps sessionHistory length equal to completedSets', () => {
      run(() => {
        for (let i = 0; i < 5; i++) {
          store().incrementRep();
          store().completeSet();
        }
      });
      expect(store().sessionHistory).toHaveLength(store().completedSets);
    });

    it('decrement at 0 followed by increment yields 1', () => {
      run(() => {
        store().decrementRep();
        store().incrementRep();
      });
      expect(store().reps).toBe(1);
    });

    it('handles a large number of increments', () => {
      run(() => {
        for (let i = 0; i < 1000; i++) store().incrementRep();
      });
      expect(store().reps).toBe(1000);
    });

    it('setMode to the current mode is a no-op', () => {
      run(() => store().setMode('SETS'));
      expect(store().mode).toBe('SETS');
    });

    it('only persists restDuration', () => {
      run(() => {
        store().setRestDuration(180);
        store().incrementRep();
      });
      const raw = JSON.parse(
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('../../../../lib/storage/mmkv').mmkvStorage.getItem('@pam/timer')
      );
      expect(raw.state).toEqual({ restDuration: 180 });
    });
  });

  describe('reset', () => {
    it('restores initial state but keeps the rest duration preference', () => {
      run(() => {
        store().setRestDuration(90);
        store().incrementRep();
        store().completeSet();
        store().reset();
      });
      expect(store().mode).toBe('SETS');
      expect(store().completedSets).toBe(0);
      expect(store().sessionHistory).toEqual([]);
      expect(store().restDuration).toBe(90);
    });
  });
});

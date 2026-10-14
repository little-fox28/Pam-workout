import { act } from 'react';
import { useTimerStore, TimerMode } from '../useTimerStore';

describe('useTimerStore (Phase 1)', () => {
  beforeEach(() => {
    // Reset Zustand store state before each test
    act(() => {
      useTimerStore.setState({
        mode: 'SETS',
        currentReps: 0,
        completedSets: 0,
        restDuration: 90,
        repHistory: [],
      });
    });
  });

  describe('Initial State', () => {
    it('initializes with default values according to specifications', () => {
      const state = useTimerStore.getState();

      expect(state.mode).toBe('SETS');
      expect(state.currentReps).toBe(0);
      expect(state.completedSets).toBe(0);
      expect(state.restDuration).toBe(90);
      expect(state.repHistory).toEqual([]);
    });
  });

  describe('Mode Switching (setMode)', () => {
    it('switches mode to WORK', () => {
      act(() => {
        useTimerStore.getState().setMode('WORK');
      });

      expect(useTimerStore.getState().mode).toBe('WORK');
    });

    it('switches mode to REST', () => {
      act(() => {
        useTimerStore.getState().setMode('REST');
      });

      expect(useTimerStore.getState().mode).toBe('REST');
    });

    it('switches mode back to SETS', () => {
      act(() => {
        useTimerStore.setState({ mode: 'REST' });
        useTimerStore.getState().setMode('SETS');
      });

      expect(useTimerStore.getState().mode).toBe('SETS');
    });

    it('preserves rep count, set count, and rest duration when switching modes', () => {
      act(() => {
        useTimerStore.setState({
          currentReps: 8,
          completedSets: 2,
          restDuration: 120,
          repHistory: [10, 10],
        });
        useTimerStore.getState().setMode('WORK');
      });

      const state = useTimerStore.getState();
      expect(state.mode).toBe('WORK');
      expect(state.currentReps).toBe(8);
      expect(state.completedSets).toBe(2);
      expect(state.restDuration).toBe(120);
      expect(state.repHistory).toEqual([10, 10]);
    });
  });

  describe('Rep Counter Logic (incrementRep, decrementRep, resetReps)', () => {
    it('incrementRep increases currentReps by 1', () => {
      act(() => {
        useTimerStore.getState().incrementRep();
      });

      expect(useTimerStore.getState().currentReps).toBe(1);
    });

    it('incrementRep accumulates sequential calls', () => {
      act(() => {
        useTimerStore.getState().incrementRep();
        useTimerStore.getState().incrementRep();
        useTimerStore.getState().incrementRep();
      });

      expect(useTimerStore.getState().currentReps).toBe(3);
    });

    it('decrementRep decreases currentReps by 1 when currentReps > 0', () => {
      act(() => {
        useTimerStore.setState({ currentReps: 5 });
        useTimerStore.getState().decrementRep();
      });

      expect(useTimerStore.getState().currentReps).toBe(4);
    });

    it('decrementRep NEVER drops below 0 (boundary at 0)', () => {
      act(() => {
        useTimerStore.setState({ currentReps: 1 });
        useTimerStore.getState().decrementRep();
      });

      expect(useTimerStore.getState().currentReps).toBe(0);

      act(() => {
        useTimerStore.getState().decrementRep();
      });

      expect(useTimerStore.getState().currentReps).toBe(0);
    });

    it('resetReps resets currentReps back to 0', () => {
      act(() => {
        useTimerStore.setState({ currentReps: 12 });
        useTimerStore.getState().resetReps();
      });

      expect(useTimerStore.getState().currentReps).toBe(0);
    });

    it('resetReps does not alter completedSets, repHistory, or restDuration', () => {
      act(() => {
        useTimerStore.setState({
          currentReps: 10,
          completedSets: 3,
          repHistory: [10, 12, 10],
          restDuration: 60,
        });
        useTimerStore.getState().resetReps();
      });

      const state = useTimerStore.getState();
      expect(state.currentReps).toBe(0);
      expect(state.completedSets).toBe(3);
      expect(state.repHistory).toEqual([10, 12, 10]);
      expect(state.restDuration).toBe(60);
    });
  });

  describe('Set Completion (completeSet)', () => {
    it('pushes currentReps into repHistory, increments completedSets, resets currentReps, and transitions mode to REST', () => {
      act(() => {
        useTimerStore.setState({ currentReps: 12, completedSets: 0, mode: 'SETS' });
        useTimerStore.getState().completeSet();
      });

      const state = useTimerStore.getState();
      expect(state.repHistory).toEqual([12]);
      expect(state.completedSets).toBe(1);
      expect(state.currentReps).toBe(0);
      expect(state.mode).toBe('REST');
    });

    it('records a completed set when currentReps is 0', () => {
      act(() => {
        useTimerStore.setState({ currentReps: 0, completedSets: 0 });
        useTimerStore.getState().completeSet();
      });

      const state = useTimerStore.getState();
      expect(state.repHistory).toEqual([0]);
      expect(state.completedSets).toBe(1);
      expect(state.currentReps).toBe(0);
      expect(state.mode).toBe('REST');
    });

    it('accumulates multiple completed sets in sequential order across a workout', () => {
      // Set 1: 10 reps
      act(() => {
        useTimerStore.setState({ currentReps: 10, mode: 'SETS' });
        useTimerStore.getState().completeSet();
      });

      expect(useTimerStore.getState().repHistory).toEqual([10]);
      expect(useTimerStore.getState().completedSets).toBe(1);
      expect(useTimerStore.getState().mode).toBe('REST');

      // Set 2: switch back to SETS, do 8 reps, complete
      act(() => {
        useTimerStore.getState().setMode('SETS');
        useTimerStore.setState({ currentReps: 8 });
        useTimerStore.getState().completeSet();
      });

      expect(useTimerStore.getState().repHistory).toEqual([10, 8]);
      expect(useTimerStore.getState().completedSets).toBe(2);
      expect(useTimerStore.getState().currentReps).toBe(0);
      expect(useTimerStore.getState().mode).toBe('REST');
    });
  });

  describe('Rest Quick-Config (setRestDuration)', () => {
    const presets = [30, 60, 90, 120, 180];

    it.each(presets)('updates restDuration to preset value %is', (duration) => {
      act(() => {
        useTimerStore.setState({ restDuration: 0 });
        useTimerStore.getState().setRestDuration(duration);
      });

      expect(useTimerStore.getState().restDuration).toBe(duration);
    });

    it('retains updated restDuration across set completions', () => {
      act(() => {
        useTimerStore.getState().setRestDuration(120);
        useTimerStore.setState({ currentReps: 10 });
        useTimerStore.getState().completeSet();
      });

      const state = useTimerStore.getState();
      expect(state.restDuration).toBe(120);
      expect(state.mode).toBe('REST');
      expect(state.completedSets).toBe(1);
    });

    it('retains updated restDuration across mode switches', () => {
      act(() => {
        useTimerStore.getState().setRestDuration(180);
        useTimerStore.getState().setMode('WORK');
        useTimerStore.getState().setMode('REST');
        useTimerStore.getState().setMode('SETS');
      });

      expect(useTimerStore.getState().restDuration).toBe(180);
    });
  });
});

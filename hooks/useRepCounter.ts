// hooks/useRepCounter.ts
import { useTimerStore } from '@store/useTimerStore';
import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';

interface UseRepCounterReturn {
    repCount: number;
    targetReps: number;
    increment: () => void;   // NFN-T2: < 50ms haptic
    decrement: () => void;
    reset: () => void;
    completeSet: () => void;
}

export const useRepCounter = (): UseRepCounterReturn => {
    const repCount = useTimerStore((s) => s.repCount);
    const targetReps = useTimerStore((s) => s.targetReps);
    const incrementRep = useTimerStore((s) => s.incrementRep);
    const decrementRep = useTimerStore((s) => s.decrementRep);
    const resetReps = useTimerStore((s) => s.resetReps);
    const completeSet = useTimerStore((s) => s.completeSet);

    const increment = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        incrementRep();
    }, [incrementRep]);

    const decrement = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        decrementRep();
    }, [decrementRep]);

    const reset = useCallback(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        resetReps();
    }, [resetReps]);

    return {
        repCount,
        targetReps,
        increment,
        decrement,
        reset,
        completeSet,
    };
};

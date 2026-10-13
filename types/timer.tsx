export type TimerMode = 'sets' | 'works ' | 'rest'

export interface SetSession {
    repCount: number;
    targetReps: number;
    completedAt?: number
}

export interface RepCounterState {
    activeMode: TimerMode;
    repCount: number;
    targetReps: number;
    currentSetSession: SetSession[];
}

export interface RepCounterActions {
    setActiveMode: (mode: TimerMode) => void;
    incrementRep: () => void;
    decrementrRep: () => void;
    resetReps: () => void;
    completedSet: () => void;
    setTargetReps: (reps: number) => void;
}

export type TimeStore = RepCounterState & RepCounterActions;
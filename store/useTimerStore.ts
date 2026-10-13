import type { TimeStore } from "@/types/timer";
import { create } from "zustand";
import { persist } from "zustand/middleware";


export const useTimerStore = create<TimeStore>()(
    persist(
        (set, get) => ({
            //  Initial State
            activeMode: "sets",
            repCount: 0,
            targetReps: 10,
            currentSetSession: [],

            // Actions
            setActiveMode: () => { },
            incrementRep: () => { },
            decrementrRep: () => { },
            resetReps: () => { },
            completedSet: () => { },
            setTargetReps: () => { },
        }),
        {
            name: 'pam-timer-store',
        }
    )
)
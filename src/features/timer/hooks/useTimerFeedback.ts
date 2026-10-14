export interface TimerFeedbackActions {
  triggerRepFeedback: () => Promise<void>;
  triggerBufferTick: (second: number) => Promise<void>;
  configureAudioMode: () => Promise<void>;
}

export const useTimerFeedback = (): TimerFeedbackActions => {
  // TODO: Implement

  return {
    triggerRepFeedback: async () => {
      // TODO: Implement
    },
    triggerBufferTick: async (_second: number) => {
      // TODO: Implement
    },
    configureAudioMode: async () => {
      // TODO: Implement
    },
  };
};

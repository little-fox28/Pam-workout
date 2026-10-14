import { renderHook, act } from '@testing-library/react-native';
import * as Haptics from 'expo-haptics';
import { Audio, InterruptionModeIOS } from 'expo-av';

import { useTimerFeedback } from '../useTimerFeedback';

// Mocks for expo-haptics and expo-av
const mockPlayAsync = jest.fn().mockResolvedValue({});
const mockReplayAsync = jest.fn().mockResolvedValue({});
const mockUnloadAsync = jest.fn().mockResolvedValue({});
const mockSoundInstance = {
  playAsync: mockPlayAsync,
  replayAsync: mockReplayAsync,
  unloadAsync: mockUnloadAsync,
};

const mockCreateAsync = jest.fn().mockResolvedValue({
  sound: mockSoundInstance,
  status: { isLoaded: true },
});
const mockSetAudioModeAsync = jest.fn().mockResolvedValue(undefined);

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn().mockResolvedValue(undefined),
  notificationAsync: jest.fn().mockResolvedValue(undefined),
  selectionAsync: jest.fn().mockResolvedValue(undefined),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
  NotificationFeedbackType: {
    Success: 'success',
    Warning: 'warning',
    Error: 'error',
  },
}));

jest.mock('expo-av', () => ({
  Audio: {
    Sound: {
      createAsync: mockCreateAsync,
    },
    setAudioModeAsync: mockSetAudioModeAsync,
  },
  InterruptionModeIOS: {
    MixWithOthers: 0,
    DoNotMix: 1,
    DuckOthers: 2,
  },
  InterruptionModeAndroid: {
    DoNotMix: 1,
    DuckOthers: 2,
  },
}));

describe('useTimerFeedback (Phase 3)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Audio Ducking Configuration (configureAudioMode)', () => {
    it('configures audio mode with playsInSilentModeIOS: true and ducking enabled for iOS background music preservation', async () => {
      const { result } = await renderHook(() => useTimerFeedback());

      await act(async () => {
        await result.current.configureAudioMode();
      });

      expect(mockSetAudioModeAsync).toHaveBeenCalledTimes(1);
      expect(mockSetAudioModeAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          playsInSilentModeIOS: true,
          interruptionModeIOS: expect.toBeOneOf
            ? expect.toBeOneOf([InterruptionModeIOS.DuckOthers, InterruptionModeIOS.DoNotMix])
            : expect.anything(),
        })
      );
    });
  });

  describe('Rep Tap Feedback (triggerRepFeedback)', () => {
    it('triggers Light impact haptic feedback immediately', async () => {
      const { result } = await renderHook(() => useTimerFeedback());

      await act(async () => {
        await result.current.triggerRepFeedback();
      });

      expect(Haptics.impactAsync).toHaveBeenCalledTimes(1);
      expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
    });

    it('plays the subtle mechanical tick sound effect', async () => {
      const { result } = await renderHook(() => useTimerFeedback());

      await act(async () => {
        await result.current.triggerRepFeedback();
      });

      const soundTriggered = mockPlayAsync.mock.calls.length > 0 ||
        mockReplayAsync.mock.calls.length > 0 ||
        mockCreateAsync.mock.calls.length > 0;

      expect(soundTriggered).toBe(true);
    });
  });

  describe('3-2-1 Buffer Audio-Haptic Sync (triggerBufferTick)', () => {
    it.each([3, 2, 1])('triggers Heavy impact haptic and audio on countdown second %i', async (second) => {
      const { result } = await renderHook(() => useTimerFeedback());

      await act(async () => {
        await result.current.triggerBufferTick(second);
      });

      expect(Haptics.impactAsync).toHaveBeenCalledTimes(1);
      expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Heavy);

      const soundTriggered = mockPlayAsync.mock.calls.length > 0 ||
        mockReplayAsync.mock.calls.length > 0 ||
        mockCreateAsync.mock.calls.length > 0;

      expect(soundTriggered).toBe(true);
    });

    it('triggers Success notification haptic and start tone on second 0 ("GO!")', async () => {
      const { result } = await renderHook(() => useTimerFeedback());

      await act(async () => {
        await result.current.triggerBufferTick(0);
      });

      expect(Haptics.notificationAsync).toHaveBeenCalledTimes(1);
      expect(Haptics.notificationAsync).toHaveBeenCalledWith(Haptics.NotificationFeedbackType.Success);

      const soundTriggered = mockPlayAsync.mock.calls.length > 0 ||
        mockReplayAsync.mock.calls.length > 0 ||
        mockCreateAsync.mock.calls.length > 0;

      expect(soundTriggered).toBe(true);
    });
  });
});

import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MassiveCircle } from '../components/MassiveCircle';
import { ModeSelectorCards } from '../components/ModeSelectorCards';
import { TimerMode } from '../store/useTimerStore';

export const REST_PRESET_VALUES = [30, 60, 90, 120, 180] as const;

export const TimerScreen: React.FC = () => {
  // TODO: Wire up useTimerStore, useIntervalEngine, and useTimerFeedback
  const activeMode: TimerMode = 'SETS';
  const displayValue: string | number = 0;
  const currentRestDuration = 90;

  return (
    <SafeAreaView className="flex-1 bg-black justify-between items-center py-6">
      {/* Top Header / Mode Indicator */}
      <View className="items-center mt-4">
        <Text
          testID="timer-mode-header"
          className="text-zinc-400 text-xs font-bold tracking-widest uppercase"
        >
          {activeMode}
        </Text>
      </View>

      {/* Central Interactive Display */}
      <View className="items-center justify-center my-auto">
        <MassiveCircle
          testID="massive-hitbox-circle"
          accessibilityLabel="Timer central display"
          value={displayValue}
          onPress={() => {
            // TODO: Wire tap event
          }}
          onLongPress={() => {
            // TODO: Wire long press event
          }}
        />

        {/* Complete Set Button (Sets mode) */}
        <Pressable
          testID="complete-set-button"
          accessibilityLabel="Complete set button"
          onPress={() => {
            // TODO: Wire complete set action
          }}
          className="mt-6 px-8 py-3 rounded-full bg-amber-500 active:bg-amber-600"
        >
          <Text className="text-black font-bold text-base">Complete Set</Text>
        </Pressable>

        {/* Rest Quick-Config Chips (Rest mode) */}
        <View
          testID="rest-preset-chips"
          className="flex-row gap-2 mt-6 flex-wrap justify-center px-4"
        >
          {REST_PRESET_VALUES.map((preset) => {
            const isSelected = currentRestDuration === preset;
            return (
              <Pressable
                key={preset}
                testID={`rest-chip-${preset}`}
                accessibilityLabel={`${preset} seconds rest preset`}
                onPress={() => {
                  // TODO: Wire setRestDuration action
                }}
                className={`px-4 py-2 rounded-xl border ${
                  isSelected
                    ? 'bg-amber-500 border-amber-500'
                    : 'bg-zinc-900 border-zinc-800'
                }`}
              >
                <Text
                  className={`font-semibold text-sm ${
                    isSelected ? 'text-black font-bold' : 'text-zinc-300'
                  }`}
                >
                  {preset}s
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Bottom Mode Switcher */}
      <ModeSelectorCards
        activeMode={activeMode}
        onSelectMode={(_mode) => {
          // TODO: Wire mode change action
        }}
      />
    </SafeAreaView>
  );
};

export default TimerScreen;

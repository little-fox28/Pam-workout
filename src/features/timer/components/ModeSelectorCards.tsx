import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { TimerMode } from '../store/useTimerStore';

export interface ModeSelectorCardsProps {
  activeMode: TimerMode;
  onSelectMode?: (mode: TimerMode) => void;
}

export const ModeSelectorCards: React.FC<ModeSelectorCardsProps> = ({
  activeMode,
  onSelectMode,
}) => {
  const modes: { id: TimerMode; label: string; testID: string }[] = [
    { id: 'SETS', label: 'Sets', testID: 'mode-card-sets' },
    { id: 'WORK', label: 'Work', testID: 'mode-card-work' },
    { id: 'REST', label: 'Rest', testID: 'mode-card-rest' },
  ];

  return (
    <View
      testID="mode-selector-cards"
      className="flex-row justify-around w-full px-4 py-2 gap-3"
    >
      {modes.map((mode) => {
        const isActive = activeMode === mode.id;
        return (
          <Pressable
            key={mode.id}
            testID={mode.testID}
            accessibilityLabel={`${mode.label} mode card`}
            onPress={() => {
              // TODO: Handle mode selection
            }}
            className={`flex-1 py-4 px-3 rounded-2xl items-center justify-center border ${
              isActive
                ? 'bg-amber-500/20 border-amber-500'
                : 'bg-zinc-900/60 border-zinc-800'
            }`}
          >
            <Text
              className={`font-bold text-base ${
                isActive ? 'text-amber-400' : 'text-zinc-400'
              }`}
            >
              {mode.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

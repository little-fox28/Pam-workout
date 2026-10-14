import React from 'react';
import { Pressable, Text, View } from 'react-native';

export interface MassiveCircleProps {
  label?: string;
  value: string | number;
  subValue?: string;
  onPress?: () => void;
  onLongPress?: () => void;
  testID?: string;
  accessibilityLabel?: string;
}

export const MassiveCircle: React.FC<MassiveCircleProps> = ({
  label,
  value,
  subValue,
  onPress,
  onLongPress,
  testID = 'massive-hitbox-circle',
  accessibilityLabel = 'Timer circle display',
}) => {
  return (
    <Pressable
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      onPress={() => {
        // TODO: Handle tap
      }}
      onLongPress={() => {
        // TODO: Handle long press
      }}
      className="w-72 h-72 rounded-full items-center justify-center bg-zinc-900 border-4 border-amber-500 active:opacity-80"
    >
      {label ? (
        <Text className="text-zinc-400 text-sm font-semibold tracking-wider uppercase mb-1">
          {label}
        </Text>
      ) : null}
      <Text
        testID="massive-circle-value"
        className="text-white text-6xl font-black tracking-tight"
      >
        {value}
      </Text>
      {subValue ? (
        <Text className="text-zinc-400 text-xs mt-2 font-medium">
          {subValue}
        </Text>
      ) : null}
    </Pressable>
  );
};

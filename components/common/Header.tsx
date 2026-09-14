/**
 * Pam App — Header component (common)
 */
import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface HeaderProps {
  title: string;
  subtitle?: string;
  leftAction?: { icon: React.ReactNode; onPress: () => void; accessibilityLabel?: string };
  rightAction?: { icon: React.ReactNode; onPress: () => void; accessibilityLabel?: string };
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, leftAction, rightAction }) => {
  return (
    <View className="flex-row items-center justify-between px-4 py-3">
      {/* Left */}
      <View className="w-10 items-start">
        {leftAction ? (
          <Pressable
            onPress={leftAction.onPress}
            className="rounded-full p-2 active:bg-surface-card"
            accessibilityLabel={leftAction.accessibilityLabel ?? 'Back'}
            accessibilityRole="button"
          >
            {leftAction.icon}
          </Pressable>
        ) : null}
      </View>

      {/* Center */}
      <View className="flex-1 items-center">
        <Text className="text-lg font-semibold text-white" numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text className="text-xs text-gray-400" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {/* Right */}
      <View className="w-10 items-end">
        {rightAction ? (
          <Pressable
            onPress={rightAction.onPress}
            className="rounded-full p-2 active:bg-surface-card"
            accessibilityLabel={rightAction.accessibilityLabel ?? 'Action'}
            accessibilityRole="button"
          >
            {rightAction.icon}
          </Pressable>
        ) : null}
      </View>
    </View>
  );
};

export default Header;

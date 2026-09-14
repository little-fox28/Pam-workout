/**
 * Pam App — Card component
 * Surface container with optional press interaction.
 */
import React from 'react';
import { Pressable, type PressableProps, View, type ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  onPress?: PressableProps['onPress'];
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingClasses = {
  none: '',
  sm:   'p-3',
  md:   'p-4',
  lg:   'p-6',
} as const;

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  className = '',
  padding = 'md',
  ...rest
}) => {
  const base = [
    'rounded-2xl bg-surface-card border border-surface-border',
    paddingClasses[padding],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (onPress) {
    return (
      <Pressable className={`${base} active:opacity-80`} onPress={onPress} {...(rest as object)}>
        {children}
      </Pressable>
    );
  }

  return (
    <View className={base} {...rest}>
      {children}
    </View>
  );
};

export default Card;

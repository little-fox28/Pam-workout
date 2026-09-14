/**
 * Pam App — Button component
 * Polymorphic, accessible button with NativeWind variants.
 */
import React from 'react';
import { ActivityIndicator, Pressable, Text, type PressableProps } from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends PressableProps {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, { container: string; text: string }> = {
  primary: {
    container: 'bg-primary-500 active:bg-primary-600',
    text: 'text-white font-semibold',
  },
  secondary: {
    container: 'bg-surface-card border border-surface-border active:bg-surface-border',
    text: 'text-white font-medium',
  },
  ghost: {
    container: 'bg-transparent active:bg-surface-card',
    text: 'text-primary-400 font-medium',
  },
  danger: {
    container: 'bg-red-500 active:bg-red-600',
    text: 'text-white font-semibold',
  },
};

const sizeClasses: Record<ButtonSize, { container: string; text: string }> = {
  sm: { container: 'px-4 py-2 rounded-xl', text: 'text-sm' },
  md: { container: 'px-6 py-3 rounded-xl', text: 'text-base' },
  lg: { container: 'px-8 py-4 rounded-2xl', text: 'text-lg' },
};

export const Button: React.FC<ButtonProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  ...rest
}) => {
  const isDisabled = disabled || isLoading;
  const { container, text } = variantClasses[variant];
  const { container: sizeContainer, text: sizeText } = sizeClasses[size];

  return (
    <Pressable
      className={[
        'flex-row items-center justify-center gap-2',
        container,
        sizeContainer,
        fullWidth ? 'w-full' : 'self-start',
        isDisabled ? 'opacity-50' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#ffffff" />
      ) : (
        <>
          {leftIcon}
          <Text className={[text, sizeText].join(' ')}>{label}</Text>
          {rightIcon}
        </>
      )}
    </Pressable>
  );
};

export default Button;

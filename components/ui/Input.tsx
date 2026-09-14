/**
 * Pam App — Input component
 * Controlled text input with NativeWind styling, labels, and error states.
 */
import React, { forwardRef, useState } from 'react';
import {
  type TextInput as RNTextInput,
  Text,
  TextInput,
  type TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  rightElement?: React.ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<RNTextInput, InputProps>(
  ({ label, error, hint, rightElement, containerClassName = '', ...rest }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <View className={['w-full', containerClassName].join(' ')}>
        {/* Label */}
        {label ? (
          <Text className="mb-1.5 text-sm font-medium text-gray-300">{label}</Text>
        ) : null}

        {/* Input row */}
        <View
          className={[
            'flex-row items-center rounded-xl border bg-surface-card px-4',
            isFocused ? 'border-primary-500' : 'border-surface-border',
            error ? 'border-red-500' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <TextInput
            ref={ref}
            className="flex-1 py-3.5 text-base text-white"
            placeholderTextColor="#6b7280"
            onFocus={e => {
              setIsFocused(true);
              rest.onFocus?.(e);
            }}
            onBlur={e => {
              setIsFocused(false);
              rest.onBlur?.(e);
            }}
            {...rest}
          />
          {rightElement ? <View className="ml-2">{rightElement}</View> : null}
        </View>

        {/* Error / Hint */}
        {error ? (
          <Text className="mt-1 text-xs text-red-400">{error}</Text>
        ) : hint ? (
          <Text className="mt-1 text-xs text-gray-500">{hint}</Text>
        ) : null}
      </View>
    );
  }
);

Input.displayName = 'Input';
export default Input;

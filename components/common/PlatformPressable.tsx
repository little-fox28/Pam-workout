import React from 'react';
import {
  Platform,
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

export interface PlatformPressableProps extends PressableProps {
  rippleColor?: string;
  activeOpacity?: number;
  enforceTouchTarget?: boolean;
  style?: StyleProp<ViewStyle> | ((state: { pressed: boolean }) => StyleProp<ViewStyle>);
  className?: string;
}

export const PlatformPressable: React.FC<PlatformPressableProps> = ({
  children,
  style,
  rippleColor = 'rgba(255, 255, 255, 0.15)',
  activeOpacity = 0.7,
  enforceTouchTarget = true,
  disabled,
  ...props
}) => {
  const isIOS = Platform.OS === 'ios';

  const minDimensions: ViewStyle = enforceTouchTarget
    ? {
        minWidth: isIOS ? 44 : 48,
        minHeight: isIOS ? 44 : 48,
        justifyContent: 'center',
        alignItems: 'center',
      }
    : {};

  return (
    <Pressable
      disabled={disabled}
      android_ripple={
        !disabled
          ? {
              color: rippleColor,
              borderless: false,
            }
          : undefined
      }
      style={(state) => {
        const computedStyle = typeof style === 'function' ? style(state) : style;
        return [
          minDimensions,
          isIOS && state.pressed && !disabled ? { opacity: activeOpacity } : null,
          computedStyle,
        ];
      }}
      {...props}
    >
      {children}
    </Pressable>
  );
};

export default PlatformPressable;

import type { ColorValue, StyleProp, ViewStyle } from 'react-native';
import type { SFSymbol } from 'sf-symbols-typescript';
import type { AndroidSymbol } from 'expo-symbols';

export type AppIconName =
  | 'home'
  | 'timer'
  | 'settings'
  | 'play'
  | 'pause'
  | 'reset'
  | 'plus'
  | 'minus';

export interface IconMapping {
  ios: SFSymbol;
  android: AndroidSymbol;
}

export interface NativeIconProps {
  name: AppIconName;
  size?: number;
  color?: ColorValue | string;
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  style?: StyleProp<ViewStyle>;
}

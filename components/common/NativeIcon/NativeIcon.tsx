import React from 'react';
import { Platform } from 'react-native';
import { SymbolView, type SymbolWeight } from 'expo-symbols';
import type { AppIconName, IconMapping, NativeIconProps } from './types';

export const ICON_MAP: Record<AppIconName, IconMapping> = {
  home: {
    ios: 'house.fill',
    android: 'home',
  },
  timer: {
    ios: 'timer',
    android: 'timer',
  },
  settings: {
    ios: 'gearshape.fill',
    android: 'settings',
  },
  play: {
    ios: 'play.fill',
    android: 'play_arrow',
  },
  pause: {
    ios: 'pause.fill',
    android: 'pause',
  },
  reset: {
    ios: 'arrow.counterclockwise',
    android: 'refresh',
  },
  plus: {
    ios: 'plus',
    android: 'add',
  },
  minus: {
    ios: 'minus',
    android: 'remove',
  },
};

export const NativeIcon: React.FC<NativeIconProps> = ({
  name,
  size = 24,
  color,
  weight = 'regular',
  style,
}) => {
  const isIOS = Platform.OS === 'ios';
  const mapping = ICON_MAP[name];

  if (!mapping) {
    return null;
  }

  // Optical compensation: SF Symbols tend to render slightly smaller than Material glyphs
  const adjustedSize = isIOS ? size + 2 : size;

  return (
    <SymbolView
      name={{
        ios: mapping.ios,
        android: mapping.android,
      }}
      size={adjustedSize}
      tintColor={color}
      weight={isIOS ? (weight as SymbolWeight) : undefined}
      style={style}
    />
  );
};

export default NativeIcon;

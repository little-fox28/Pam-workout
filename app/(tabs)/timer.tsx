import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@constants/Colors';
import { useResolvedTheme } from '@hooks/useResolvedTheme';

export default function TimerScreen() {
  const resolved = useResolvedTheme();
  const theme = Colors[resolved];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.foreground }]}>
        Timmer
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600',
  },
});

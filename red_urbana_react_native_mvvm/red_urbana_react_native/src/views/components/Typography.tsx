import React from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';
import { useTheme } from '../../viewmodels';

export function Heading({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  return <Text style={{ color: colors.text, fontSize: 22, fontWeight: '800' }}>{children}</Text>;
}

export function BodyText({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) {
  const { colors } = useTheme();
  return <Text style={[{ color: colors.text }, style]}>{children}</Text>;
}

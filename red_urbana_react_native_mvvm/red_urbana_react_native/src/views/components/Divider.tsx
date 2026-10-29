import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../viewmodels';

export function Divider({ margin = 4 }: { margin?: number }) {
  const { colors } = useTheme();
  return <View style={{ height: 1, backgroundColor: colors.border, marginVertical: margin }} />;
}

import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../viewmodels';

export function Card({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={{ backgroundColor: colors.card, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 16, gap: 8 }}>
      {children}
    </View>
  );
}

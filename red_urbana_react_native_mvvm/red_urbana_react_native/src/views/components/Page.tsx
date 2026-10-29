import React from 'react';
import { ScrollView, View } from 'react-native';
import { useTheme } from '../../viewmodels';

export function Page({ children, scroll = true }: { children: React.ReactNode; scroll?: boolean }) {
  const { colors } = useTheme();
  return scroll ? (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: 20, gap: 14 }}>
      {children}
    </ScrollView>
  ) : (
    <View style={{ flex: 1, padding: 20, backgroundColor: colors.background }}>{children}</View>
  );
}

import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../viewmodels';

type ButtonProps = { title: string; onPress: () => void };

export function PrimaryButton({ title, onPress }: ButtonProps) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity onPress={onPress} style={{ backgroundColor: colors.primary, borderRadius: 12, padding: 15, alignItems: 'center' }}>
      <Text style={{ color: '#FFFFFF', fontWeight: '800' }}>{title}</Text>
    </TouchableOpacity>
  );
}

export function SecondaryButton({ title, onPress }: ButtonProps) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity onPress={onPress} style={{ borderColor: colors.primary, borderWidth: 1, borderRadius: 12, padding: 14, alignItems: 'center' }}>
      <Text style={{ color: colors.primary, fontWeight: '700' }}>{title}</Text>
    </TouchableOpacity>
  );
}

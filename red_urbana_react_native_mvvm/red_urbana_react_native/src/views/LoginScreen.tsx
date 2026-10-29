import React from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useLoginViewModel, useTheme } from '../viewmodels';
import { BodyText, Field, Heading, PrimaryButton, SecondaryButton } from './components';

export function LoginScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Login'>) {
  const { colors, toggleDark, dark } = useTheme();
  const vm = useLoginViewModel();

  const handleLogin = async () => {
    const result = await vm.submit();
    if (!result.ok) Alert.alert(result.title, result.message);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24, gap: 16 }}>
        <TouchableOpacity onPress={toggleDark} style={{ alignSelf: 'flex-end', padding: 8 }}>
          <BodyText>{dark ? '☀️ Modo claro' : '🌙 Modo oscuro'}</BodyText>
        </TouchableOpacity>
        <Text style={{ fontSize: 56, textAlign: 'center' }}>🚌</Text>
        <Text style={{ color: colors.primary, fontSize: 30, fontWeight: '900', textAlign: 'center', letterSpacing: 2 }}>RED URBANA</Text>
        <BodyText style={{ textAlign: 'center' }}>Transporte inteligente</BodyText>
        <Heading>Bienvenido</Heading>
        <Field label="Correo electrónico" value={vm.email} onChangeText={vm.setEmail} keyboardType="email-address" />
        <Field label="Contraseña" value={vm.password} onChangeText={vm.setPassword} secureTextEntry />
        <PrimaryButton title="INICIAR SESIÓN" onPress={handleLogin} />
        <SecondaryButton title="Crear una cuenta" onPress={() => navigation.navigate('Register')} />
        <BodyText style={{ textAlign: 'center', color: colors.muted, fontSize: 12 }}>Proyecto académico · Versión de demostración</BodyText>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

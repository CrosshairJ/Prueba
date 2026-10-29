import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PROFILES } from '../models';
import { RootStackParamList } from '../navigation/types';
import { useRegisterViewModel, useTheme } from '../viewmodels';
import { BodyText, Field, Heading, Page, PrimaryButton } from './components';

export function RegisterScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Register'>) {
  const { colors } = useTheme();
  const vm = useRegisterViewModel();

  const handleRegister = async () => {
    const result = await vm.submit();
    if (result.ok) {
      Alert.alert(result.title, result.message, [{ text: 'Aceptar', onPress: () => navigation.goBack() }]);
    } else {
      Alert.alert(result.title, result.message);
    }
  };

  return (
    <Page>
      <Text style={{ fontSize: 42, textAlign: 'center' }}>👤</Text>
      <Heading>Crear cuenta</Heading>
      <Field label="Nombre completo" value={vm.name} onChangeText={vm.setName} />
      <Field label="Correo electrónico" value={vm.email} onChangeText={vm.setEmail} keyboardType="email-address" />
      <BodyText>Tipo de usuario</BodyText>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {PROFILES.map(p => (
          <TouchableOpacity
            key={p}
            onPress={() => vm.setProfile(p)}
            style={{
              flex: 1,
              padding: 14,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: vm.profile === p ? colors.primary : colors.border,
              backgroundColor: vm.profile === p ? colors.soft : colors.card,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: colors.text, fontWeight: '700' }}>{p}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Field label="Contraseña (mínimo 6 caracteres)" value={vm.password} onChangeText={vm.setPassword} secureTextEntry={!vm.showPass} />
      <Field label="Confirmar contraseña" value={vm.confirm} onChangeText={vm.setConfirm} secureTextEntry={!vm.showPass} />
      <TouchableOpacity onPress={vm.togglePasswordVisibility}>
        <BodyText>{vm.showPass ? 'Ocultar contraseñas' : 'Mostrar contraseñas'}</BodyText>
      </TouchableOpacity>
      <PrimaryButton title="CREAR CUENTA" onPress={handleRegister} />
    </Page>
  );
}

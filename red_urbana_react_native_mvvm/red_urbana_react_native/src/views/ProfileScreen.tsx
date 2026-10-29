import React from 'react';
import { Alert, Switch, Text, View } from 'react-native';
import { useProfileViewModel, useTheme } from '../viewmodels';
import { BodyText, Card, Divider, Field, Heading, Page, PrimaryButton } from './components';

export function ProfileScreen() {
  const { colors } = useTheme();
  const vm = useProfileViewModel();
  const { user } = vm;

  if (!user) return null;

  const handleChangePassword = async () => {
    const result = await vm.submitPasswordChange();
    Alert.alert(result.title, result.message);
  };

  return (
    <Page>
      <View style={{ alignItems: 'center', gap: 8, paddingVertical: 12 }}>
        <View style={{ width: 88, height: 88, borderRadius: 44, backgroundColor: colors.soft, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 42 }}>{user.profile === 'Conductor' ? '🚍' : '👤'}</Text>
        </View>
        <Heading>{user.name}</Heading>
        <Text style={{ color: colors.primary, fontWeight: '800' }}>{user.profile}</Text>
      </View>

      <Card>
        <BodyText style={{ color: colors.muted }}>Nombre completo</BodyText>
        <BodyText style={{ fontWeight: '700' }}>{user.name}</BodyText>
        <Divider />
        <BodyText style={{ color: colors.muted }}>Correo electrónico</BodyText>
        <BodyText style={{ fontWeight: '700' }}>{user.email}</BodyText>
        <Divider />
        <BodyText style={{ color: colors.muted }}>Tipo de cuenta</BodyText>
        <BodyText style={{ fontWeight: '700' }}>{user.profile}</BodyText>
      </Card>

      <Heading>Apariencia</Heading>
      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flex: 1, gap: 4 }}>
            <BodyText style={{ fontWeight: '800' }}>{vm.dark ? 'Modo oscuro' : 'Modo claro'}</BodyText>
            <BodyText style={{ color: colors.muted }}>Cambiar apariencia de la aplicación</BodyText>
          </View>
          <Switch value={vm.dark} onValueChange={vm.toggleDark} trackColor={{ true: colors.primary }} />
        </View>
      </Card>

      <Heading>Seguridad</Heading>
      <Card>
        <Field label="Contraseña actual" value={vm.oldPass} onChangeText={vm.setOldPass} secureTextEntry />
        <Field label="Nueva contraseña (mínimo 6 caracteres)" value={vm.newPass} onChangeText={vm.setNewPass} secureTextEntry />
        <Field label="Confirmar nueva contraseña" value={vm.confirm} onChangeText={vm.setConfirm} secureTextEntry />
        <PrimaryButton title="Cambiar contraseña" onPress={handleChangePassword} />
      </Card>

      <PrimaryButton title="Cerrar sesión" onPress={vm.logout} />
      <BodyText style={{ color: colors.muted, textAlign: 'center', fontSize: 12 }}>Versión de demostración académica</BodyText>
    </Page>
  );
}

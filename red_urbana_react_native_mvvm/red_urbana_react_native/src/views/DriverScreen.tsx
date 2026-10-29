import React from 'react';
import { Alert, Switch, Text, View } from 'react-native';
import { useDriverViewModel, useTheme } from '../viewmodels';
import { BodyText, Card, Field, Heading, Page, PrimaryButton } from './components';

export function DriverScreen() {
  const { colors } = useTheme();
  const vm = useDriverViewModel();

  const handleSubmitIncident = () => {
    const result = vm.submitIncident();
    Alert.alert(result.title, result.message);
  };

  return (
    <Page>
      <View style={{ backgroundColor: colors.primary, padding: 22, borderRadius: 18, gap: 8 }}>
        <Text style={{ color: '#FFFFFF', fontSize: 25, fontWeight: '900' }}>Panel del conductor</Text>
        <Text style={{ color: '#FFFFFF' }}>Servicio asignado · Línea 1</Text>
      </View>
      <Card>
        <BodyText style={{ color: colors.muted }}>Próxima parada</BodyText>
        <Heading>Plaza de Armas</Heading>
        <BodyText>Destino: Centro</BodyText>
        <BodyText>Horario y ubicación de demostración</BodyText>
      </Card>
      <Card>
        <BodyText style={{ fontWeight: '800', fontSize: 18 }}>Parada asistida</BodyText>
        <BodyText>Activa esta opción si un pasajero necesita asistencia para subir o bajar.</BodyText>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <BodyText>{vm.assisted ? 'Solicitud activada' : 'Sin solicitud activa'}</BodyText>
          <Switch value={vm.assisted} onValueChange={vm.setAssisted} trackColor={{ true: colors.primary }} />
        </View>
      </Card>
      <Card>
        <BodyText style={{ fontWeight: '800', fontSize: 18 }}>Reportar incidente</BodyText>
        <Field label="Describe el incidente" value={vm.incident} onChangeText={vm.setIncident} />
        <PrimaryButton title="Enviar reporte" onPress={handleSubmitIncident} />
        {vm.incidents.map((x, i) => (
          <BodyText key={`${x}-${i}`}>• {x}</BodyText>
        ))}
      </Card>
    </Page>
  );
}

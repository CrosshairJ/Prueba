import React from 'react';
import { Text, View } from 'react-native';
import { usePassengerViewModel, useTheme } from '../viewmodels';
import { BodyText, Card, Divider, Field, Heading, Page } from './components';

export function PassengerScreen() {
  const { colors } = useTheme();
  const vm = usePassengerViewModel();

  return (
    <Page>
      <View style={{ backgroundColor: colors.primary, borderRadius: 20, padding: 22, gap: 8 }}>
        <Text style={{ fontSize: 34 }}>🚌</Text>
        <Text style={{ color: '#FFFFFF', fontSize: 25, fontWeight: '900' }}>¡Bienvenido!</Text>
        <Text style={{ color: '#FFFFFF', lineHeight: 21 }}>Encuentra tu recorrido y consulta los tiempos estimados de llegada.</Text>
      </View>
      <Heading>Busca tu recorrido</Heading>
      <Field label="Bus, línea o destino..." value={vm.search} onChangeText={vm.setSearch} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Heading>Buses disponibles</Heading>
        <BodyText style={{ color: colors.primary, fontWeight: '800' }}>{vm.resultCount} resultados</BodyText>
      </View>
      {vm.resultCount === 0 ? (
        <Card><BodyText>No se encontraron recorridos. Prueba otra búsqueda.</BodyText></Card>
      ) : (
        vm.buses.map(bus => (
          <Card key={bus.id}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ width: 52, height: 52, borderRadius: 14, backgroundColor: colors.soft, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 26 }}>🚌</Text>
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <BodyText style={{ fontWeight: '800', fontSize: 17 }}>{bus.line}</BodyText>
                <BodyText style={{ color: colors.muted }}>Bus {bus.id}</BodyText>
              </View>
              <Text style={{ color: colors.success, fontWeight: '800' }}>{bus.active ? 'Activo' : 'Inactivo'}</Text>
            </View>
            <Divider margin={6} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flex: 1, gap: 4 }}>
                <BodyText style={{ color: colors.muted, fontSize: 12 }}>Destino</BodyText>
                <BodyText style={{ fontWeight: '700' }}>{bus.destination}</BodyText>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 2 }}>
                <Text style={{ color: colors.primary, fontSize: 22, fontWeight: '900' }}>{bus.minutes} min</Text>
                <BodyText style={{ color: colors.muted, fontSize: 11 }}>Llegada estimada</BodyText>
              </View>
            </View>
          </Card>
        ))
      )}
    </Page>
  );
}

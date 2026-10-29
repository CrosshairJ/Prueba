import React from 'react';
import { Text, View } from 'react-native';
import { useAlertsViewModel, useTheme } from '../viewmodels';
import { BodyText, Card, Heading, Page } from './components';

export function AlertsScreen() {
  const { colors } = useTheme();
  const { alerts } = useAlertsViewModel();

  return (
    <Page>
      <Heading>Alertas del servicio</Heading>
      {alerts.map((a, i) => (
        <Card key={i}>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Text style={{ fontSize: 24 }}>🔔</Text>
            <View style={{ flex: 1, gap: 6 }}>
              <BodyText style={{ fontWeight: '800', fontSize: 16 }}>{a.title}</BodyText>
              <BodyText>{a.description}</BodyText>
              <BodyText style={{ color: colors.muted, fontSize: 12 }}>{a.time}</BodyText>
            </View>
          </View>
        </Card>
      ))}
    </Page>
  );
}

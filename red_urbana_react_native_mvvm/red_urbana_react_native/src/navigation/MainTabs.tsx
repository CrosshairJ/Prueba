import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth, useTheme } from '../viewmodels';
import { AlertsScreen, DriverScreen, MapScreen, PassengerScreen, ProfileScreen } from '../views';

const Tabs = createBottomTabNavigator();

const icon = (glyph: string) => ({ color, size }: { color: string; size: number }) => (
  <Text style={{ color, fontSize: size }}>{glyph}</Text>
);

export function MainTabs() {
  const { user } = useAuth();
  const { colors } = useTheme();

  return (
    <Tabs.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#FFFFFF',
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
      }}
    >
      {user?.profile === 'Pasajero' ? (
        <>
          <Tabs.Screen name="Inicio" component={PassengerScreen} options={{ title: 'RED URBANA', tabBarLabel: 'Inicio', tabBarIcon: icon('⌂') }} />
          <Tabs.Screen name="Mapa" component={MapScreen} options={{ tabBarLabel: 'Mapa', tabBarIcon: icon('⌖') }} />
          <Tabs.Screen name="Alertas" component={AlertsScreen} options={{ tabBarLabel: 'Alertas', tabBarIcon: icon('♧') }} />
          <Tabs.Screen name="Perfil" component={ProfileScreen} options={{ tabBarLabel: 'Perfil', tabBarIcon: icon('●') }} />
        </>
      ) : (
        <>
          <Tabs.Screen name="Conductor" component={DriverScreen} options={{ title: 'Panel del conductor', tabBarLabel: 'Inicio', tabBarIcon: icon('▣') }} />
          <Tabs.Screen name="Perfil" component={ProfileScreen} options={{ tabBarLabel: 'Perfil', tabBarIcon: icon('●') }} />
        </>
      )}
    </Tabs.Navigator>
  );
}

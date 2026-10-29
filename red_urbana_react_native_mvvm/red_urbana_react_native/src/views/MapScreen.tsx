// src/views/MapScreen.tsx
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useMapViewModel, useTheme } from "../viewmodels";
import { PrimaryButton, SecondaryButton } from "./components";

export function MapScreen() {
  const { colors } = useTheme();
  const vm = useMapViewModel();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: 16, gap: 6 }}>
        <Text style={{ color: colors.text, fontSize: 23, fontWeight: "800" }}>Mapa de Red Urbana</Text>
        <Text style={{ color: colors.muted }}>Talca, Región del Maule</Text>
      </View>

      <MapView
        style={{ width: "100%", height: 340 }}
        region={vm.region}
        onRegionChangeComplete={vm.setRegion}
        showsUserLocation={false}
        showsCompass
        showsScale
      >
        <Polyline coordinates={vm.routeCoordinates} strokeColor={colors.primary} strokeWidth={4} />

        {vm.buses.map((bus) => (
          <Marker
            key={bus.id}
            coordinate={bus.coordinate}
            title={`${bus.line} · ${bus.id}`}
            description={`Estado: ${bus.destination}`}
            pinColor={vm.pinColorFor(bus)}
          />
        ))}
      </MapView>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 10 }}>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={{ flex: 1 }}>
            <SecondaryButton title="Solicitar Bus" onPress={vm.solicitarBus} />
          </View>
          <View style={{ flex: 1 }}>
            <PrimaryButton title="Tomar Bus" onPress={vm.tomarBus} />
          </View>
        </View>

        <Text style={{ color: colors.text, fontSize: 18, fontWeight: "800" }}>Buses en el mapa</Text>

        {vm.buses.map((bus) => (
          <TouchableOpacity
            key={bus.id}
            onPress={() => vm.focusBus(bus)}
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 14,
              padding: 14,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            }}
          >
            <Text style={{ fontSize: 28 }}>🚌</Text>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={{ color: colors.text, fontWeight: "800" }}>{bus.line} · {bus.id}</Text>
              <Text style={{ color: colors.muted }}>Estado: {bus.destination}</Text>
            </View>
            <Text style={{ color: colors.primary, fontWeight: "800" }}>{bus.minutes} min</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
import { useEffect, useState } from "react";
import { Bus } from "../models";
import { BusService } from "../services";
import { useAuth } from "./AuthViewModel";

const INITIAL_REGION = {
  latitude: -35.4272,
  longitude: -71.6465,
  latitudeDelta: 0.025,
  longitudeDelta: 0.025,
};
const FOCUS_DELTA = 0.012;

const PIN_COLORS: Record<string, string> = { "BUS-101": "blue" };

export type MapRegion = typeof INITIAL_REGION;

export function useMapViewModel() {
  const { user } = useAuth();
  const [region, setRegion] = useState<MapRegion>(INITIAL_REGION);
  const [buses, setBuses] = useState<Bus[]>(() => BusService.getBuses());
  const routeCoordinates = BusService.getRoute();

  useEffect(() => {
    return BusService.subscribe(setBuses);
  }, []);

  const pinColorFor = (bus: Bus) => PIN_COLORS[bus.id] ?? "orange";

  const focusBus = (bus: Bus) =>
    setRegion({ ...bus.coordinate, latitudeDelta: FOCUS_DELTA, longitudeDelta: FOCUS_DELTA });

  const solicitarBus = () => BusService.solicitarBus(user?.name || "Pasajero");
  const tomarBus = () => BusService.tomarBus(user?.name || "Pasajero");

  return {
    region,
    setRegion,
    buses,
    routeCoordinates,
    pinColorFor,
    focusBus,
    solicitarBus,
    tomarBus,
  };
}
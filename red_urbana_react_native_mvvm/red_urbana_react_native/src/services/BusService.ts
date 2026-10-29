
import { io } from "socket.io-client";
import { Bus, Coordinate } from "../models";


const SOCKET_URL = "http://192.168.1.88:3000";
const socket = io(SOCKET_URL);


export const RUTA_TALCA_COORDS: Coordinate[] = [
  { latitude: -35.4264, longitude: -71.6554 },
  { latitude: -35.4268, longitude: -71.6510 },
  { latitude: -35.4272, longitude: -71.6465 },
  { latitude: -35.4276, longitude: -71.6420 },
  { latitude: -35.4281, longitude: -71.6375 },
  { latitude: -35.4285, longitude: -71.6330 },
];

let busesState: Bus[] = [
  {
    id: "BUS-101",
    line: "Línea 1",
    destination: "Sin iniciar (Solicita o toma el bus)",
    minutes: 5,
    active: true,
    coordinate: RUTA_TALCA_COORDS[0],
  },
];

type Listener = (buses: Bus[]) => void;
const listeners = new Set<Listener>();

socket.on("actualizacion_bus", (payload: {
  busId: string;
  pasajero: string;
  estado: string;
  lat: number;
  lng: number;
}) => {
  if (!payload) return;

  busesState = [
    {
      id: payload.busId || "BUS-101",
      line: `Línea 1 · ${payload.pasajero}`,
      destination: payload.estado,
      minutes: payload.estado === "Viaje finalizado" ? 0 : 2,
      active: payload.estado !== "Viaje finalizado",
      coordinate: {
        latitude: payload.lat,
        longitude: payload.lng,
      },
    },
  ];

  listeners.forEach((fn) => fn(busesState));
});

export const BusService = {
  getBuses(): Bus[] {
    return busesState;
  },

  getRoute(): Coordinate[] {
    return RUTA_TALCA_COORDS;
  },

  subscribe(fn: Listener): () => void {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },

  solicitarBus(pasajero: string) {
    socket.emit("solicitar_bus", { pasajero });
  },

  tomarBus(pasajero: string) {
    socket.emit("tomar_bus", { pasajero });
  },
};
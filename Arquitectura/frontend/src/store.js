import { create } from "zustand";
import { persist } from "zustand/middleware";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
});

// Rutas
export const RUTA_TALCA = [
  [-35.4264, -71.6660],
  [-35.4264, -71.6607],
  [-35.4264, -71.6554],
  [-35.4247, -71.6554],
  [-35.4230, -71.6554],
  [-35.4230, -71.6480],
];

export const CATALOGO_RUTAS = [
  {
    id: "101",
    nombre: "Línea 101 — Troncal Centro",
    estado: "Activa (En operación)",
    color: "#38bdf8",
    activa: true,
    coordenadas: RUTA_TALCA,
  },
  {
    id: "203",
    nombre: "Línea 203 — Corredor Norte-Sur",
    estado: "Futura integración",
    color: "#a855f7",
    activa: false,
    coordenadas: [
      [-35.4205, -71.6607],
      [-35.4235, -71.6607],
      [-35.4264, -71.6607],
      [-35.4295, -71.6607],
      [-35.4315, -71.6554],
    ],
  },
  {
    id: "305",
    nombre: "Línea 305 — Variante Sur-Oriente",
    estado: "Futura integración",
    color: "#f59e0b",
    activa: false,
    coordenadas: [
      [-35.4295, -71.6660],
      [-35.4295, -71.6554],
      [-35.4264, -71.6505],
      [-35.4230, -71.6480],
    ],
  },
];

//Respaldo off
let intervaloRespaldoOffline = null;
let pasoLocal = 0;

const detenerRespaldoOffline = () => {
  if (intervaloRespaldoOffline) {
    clearInterval(intervaloRespaldoOffline);
    intervaloRespaldoOffline = null;
  }
};

const activarRespaldoOffline = (set, get) => {
  if (intervaloRespaldoOffline) return;

  intervaloRespaldoOffline = setInterval(() => {
    if (socket.connected) {
      detenerRespaldoOffline();
      return;
    }

    const busActual = get().bus;
    if (!busActual || busActual.estado === "Esperando en paradero") return;

    if (pasoLocal < RUTA_TALCA.length - 1) {
      pasoLocal += 1;
      const [lat, lng] = RUTA_TALCA[pasoLocal];
      set({
        bus: {
          ...busActual,
          estado:
            pasoLocal === RUTA_TALCA.length - 1
              ? "Viaje finalizado"
              : "En movimiento (Modo Offline / Caché)",
          lat,
          lng,
        },
      });
    } else {
      detenerRespaldoOffline();
    }
  }, 1500);
};

// ZUSTAND 
export const useTransporteStore = create(
  persist(
    (set, get) => {
      socket.on("actualizacion_bus", (datosBus) => {
        detenerRespaldoOffline();

        const indiceEncontrado = RUTA_TALCA.findIndex(
          ([lat, lng]) =>
            Math.abs(lat - datosBus.lat) < 0.0001 &&
            Math.abs(lng - datosBus.lng) < 0.0001
        );

        if (indiceEncontrado !== -1) {
          pasoLocal = indiceEncontrado;
        }

        set({ bus: datosBus });
      });

      socket.on("disconnect", () => {
        const busActual = get().bus;
        if (busActual && busActual.estado.includes("En movimiento")) {
          activarRespaldoOffline(set, get);
        }
      });

      return {
        usuario: null,
        error: null,
        bus: null,
        filtroRuta: "todas",

        setFiltroRuta: (filtroRuta) => set({ filtroRuta }),

        iniciarSesion: async (correo, clave) => {
          try {
            set({ error: null });
            const res = await fetch("http://localhost:3000/api/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ correo, clave }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Error al iniciar sesión");
            set({ usuario: data });
          } catch (err) {
            if (
              (correo === "pasajero@app.cl" || correo === "conductor@app.cl") &&
              clave === "123"
            ) {
              set({
                usuario: {
                  token: "jwt_offline_fallback",
                  nombre:
                    correo === "conductor@app.cl"
                      ? "Antonio Conductor"
                      : "Felipe Pasajero",
                  rol: correo === "conductor@app.cl" ? "Conductor" : "Pasajero",
                },
                error: null,
              });
            } else {
              set({ error: err.message });
            }
          }
        },

        cerrarSesion: () => {
          detenerRespaldoOffline();
          pasoLocal = 0;
          set({ usuario: null, error: null, bus: null });
        },

        // Posiciona el bus de prueba en el paradero inicial
        solicitarBusDesdeCelular: () => {
          const { usuario } = get();
          detenerRespaldoOffline();
          pasoLocal = 0;
          const pasajero = usuario?.nombre || "Felipe Pasajero";

          if (socket.connected) {
            socket.emit("solicitar_bus", { pasajero });
          } else {
            set({
              bus: {
                busId: "BUS-101",
                pasajero,
                estado: "Esperando en paradero",
                lat: RUTA_TALCA[0][0],
                lng: RUTA_TALCA[0][1],
              },
            });
          }
        },

        // Inicia bus
        tomarBusDesdeCelular: () => {
          const { usuario, bus } = get();
          const pasajero = bus?.pasajero || usuario?.nombre || "Felipe Pasajero";

          if (socket.connected) {
            socket.emit("tomar_bus", { pasajero });
          } else {
            pasoLocal = 0;
            set({
              bus: {
                busId: "BUS-101",
                pasajero,
                estado: "En movimiento (Modo Offline / Caché)",
                lat: RUTA_TALCA[0][0],
                lng: RUTA_TALCA[0][1],
              },
            });
            activarRespaldoOffline(set, get);
          }
        },
      };
    },
    { name: "transporte-storage" }
  )
);
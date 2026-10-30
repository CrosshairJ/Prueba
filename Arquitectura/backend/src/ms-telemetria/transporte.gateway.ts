import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { TelemetriaService, RUTA_TALCA } from './telemetria.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class TransporteGateway {
  @WebSocketServer()
  server: Server;

  private intervalo: NodeJS.Timeout | null = null;
  private pasoActual = 0;

  constructor(private readonly telemetria: TelemetriaService) {}

  private limpiarIntervalo() {
    if (this.intervalo) clearInterval(this.intervalo);
    this.pasoActual = 0;
  }

  private async emitirYSincronizar(payload: Record<string, unknown>) {
    await this.telemetria.publicarEvento(payload);
    this.server.emit('actualizacion_bus', payload);
  }

  @SubscribeMessage('solicitar_bus')
  async crearBus(@MessageBody() data: { pasajero: string }) {
    this.limpiarIntervalo();
    await this.emitirYSincronizar({
      busId: 'BUS-101',
      linea: 'Línea 101',
      pasajero: data?.pasajero || 'Pasajero',
      estado: 'Esperando en paradero',
      lat: RUTA_TALCA[0][0],
      lng: RUTA_TALCA[0][1],
    });
  }

  @SubscribeMessage('tomar_bus')
  async iniciarRecorrido(@MessageBody() data: { pasajero: string }) {
    this.limpiarIntervalo();

    this.intervalo = setInterval(async () => {
      if (this.pasoActual >= RUTA_TALCA.length) {
        this.limpiarIntervalo();
        return;
      }

      const [lat, lng] = RUTA_TALCA[this.pasoActual];
      const esUltimo = this.pasoActual === RUTA_TALCA.length - 1;

      await this.emitirYSincronizar({
        busId: 'BUS-101',
        linea: 'Línea 101',
        pasajero: data?.pasajero || 'Pasajero',
        estado: esUltimo ? 'Viaje finalizado' : 'En movimiento (Pasajero a bordo)',
        lat,
        lng,
      });

      this.pasoActual++;
    }, 1500);
  }
}
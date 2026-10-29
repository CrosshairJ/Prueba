import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import Redis from 'ioredis';
import * as mqtt from 'mqtt';
import * as amqp from 'amqplib';

const RUTA_TALCA = [
  [-35.4264, -71.6660],
  [-35.4264, -71.6607],
  [-35.4264, -71.6554],
  [-35.4247, -71.6554],
  [-35.4230, -71.6554],
  [-35.4230, -71.6480],
];

@WebSocketGateway({ cors: { origin: '*' } })
export class TransporteGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  private redis = new Redis({ host: 'localhost', port: 6379, lazyConnect: true });
  private mqttClient: mqtt.MqttClient | null = null;
  private rabbitChannel: amqp.Channel | null = null;
  private intervalo: NodeJS.Timeout | null = null;
  private pasoActual = 0;

  async afterInit() {
    this.redis.connect().catch(() => {});

    try {
      this.mqttClient = mqtt.connect('mqtt://localhost:1883', {
        reconnectPeriod: 2000,
      });
      this.mqttClient.on('connect', () => {
        this.mqttClient?.subscribe('transporte/gps/bus101');
      });
      this.mqttClient.on('error', () => {});
    } catch {}

    try {
      const conn = await amqp.connect('amqp://localhost:5672');
      this.rabbitChannel = await conn.createChannel();
      await this.rabbitChannel.assertQueue('eventos_transporte', { durable: true });
    } catch {
      this.rabbitChannel = null;
    }
  }

  private async sincronizarCapas(payload: Record<string, unknown>) {
    const mensaje = JSON.stringify(payload);

    try {
      await this.redis.set('bus:101', mensaje);
    } catch {}

    try {
      if (this.mqttClient?.connected) {
        this.mqttClient.publish('transporte/gps/bus101', mensaje);
      }
    } catch {}

    try {
      if (this.rabbitChannel) {
        this.rabbitChannel.sendToQueue('eventos_transporte', Buffer.from(mensaje));
      }
    } catch {}

    this.server.emit('actualizacion_bus', payload);
  }

  @SubscribeMessage('solicitar_bus')
  async crearBus(@MessageBody() data: { pasajero: string }) {
    if (this.intervalo) clearInterval(this.intervalo);
    this.pasoActual = 0;

    const estadoInicial = {
      busId: 'BUS-101',
      pasajero: data.pasajero,
      estado: 'Esperando en paradero',
      lat: RUTA_TALCA[0][0],
      lng: RUTA_TALCA[0][1],
    };

    await this.sincronizarCapas(estadoInicial);
  }

  @SubscribeMessage('tomar_bus')
  async iniciarRecorrido(@MessageBody() data: { pasajero: string }) {
    if (this.intervalo) clearInterval(this.intervalo);
    this.pasoActual = 0;

    this.intervalo = setInterval(async () => {
      if (this.pasoActual >= RUTA_TALCA.length) {
        if (this.intervalo) clearInterval(this.intervalo);
        return;
      }

      const [lat, lng] = RUTA_TALCA[this.pasoActual];
      const payload = {
        busId: 'BUS-101',
        pasajero: data.pasajero,
        estado:
          this.pasoActual === RUTA_TALCA.length - 1
            ? 'Viaje finalizado'
            : 'En movimiento (Pasajero a bordo)',
        lat,
        lng,
      };

      await this.sincronizarCapas(payload);
      this.pasoActual++;
    }, 1500);
  }
}
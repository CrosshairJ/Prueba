import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import * as mqtt from 'mqtt';
import * as amqp from 'amqplib';

export const RUTA_TALCA: [number, number][] = [
  [-35.4264, -71.6660],
  [-35.4264, -71.6607],
  [-35.4264, -71.6554],
  [-35.4247, -71.6554],
  [-35.4230, -71.6554],
  [-35.4230, -71.6480],
];

@Injectable()
export class TelemetriaService implements OnModuleInit {
  private redis = new Redis({ host: 'localhost', port: 6379, lazyConnect: true });
  private mqttClient: mqtt.MqttClient | null = null;
  private rabbitChannel: amqp.Channel | null = null;

  async onModuleInit() {
    this.redis.connect().catch(() => {});

    try {
      this.mqttClient = mqtt.connect('mqtt://localhost:1883', { reconnectPeriod: 2000 });
      this.mqttClient.on('connect', () => this.mqttClient?.subscribe('transporte/gps/bus101'));
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

  async publicarEvento(payload: Record<string, unknown>) {
    const mensaje = JSON.stringify(payload);
    await this.redis.set('bus:101', mensaje).catch(() => {});

    try {
      if (this.mqttClient?.connected) {
        this.mqttClient.publish('transporte/gps/bus101', mensaje);
      }
    } catch {}

    try {
      this.rabbitChannel?.sendToQueue('eventos_transporte', Buffer.from(mensaje));
    } catch {}
  }
}
import { OnGatewayInit } from '@nestjs/websockets';
import { Server } from 'socket.io';
export declare class TransporteGateway implements OnGatewayInit {
    server: Server;
    private redis;
    private mqttClient;
    private rabbitChannel;
    private intervalo;
    private pasoActual;
    afterInit(): Promise<void>;
    private sincronizarCapas;
    crearBus(data: {
        pasajero: string;
    }): Promise<void>;
    iniciarRecorrido(data: {
        pasajero: string;
    }): Promise<void>;
}

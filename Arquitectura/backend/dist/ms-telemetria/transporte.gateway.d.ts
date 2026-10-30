import { Server } from 'socket.io';
import { TelemetriaService } from './telemetria.service';
export declare class TransporteGateway {
    private readonly telemetria;
    server: Server;
    private intervalo;
    private pasoActual;
    constructor(telemetria: TelemetriaService);
    private limpiarIntervalo;
    private emitirYSincronizar;
    crearBus(data: {
        pasajero: string;
    }): Promise<void>;
    iniciarRecorrido(data: {
        pasajero: string;
    }): Promise<void>;
}

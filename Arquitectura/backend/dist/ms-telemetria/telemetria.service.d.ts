import { OnModuleInit } from '@nestjs/common';
export declare const RUTA_TALCA: [number, number][];
export declare class TelemetriaService implements OnModuleInit {
    private redis;
    private mqttClient;
    private rabbitChannel;
    onModuleInit(): Promise<void>;
    publicarEvento(payload: Record<string, unknown>): Promise<void>;
}

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelemetriaService = exports.RUTA_TALCA = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = __importDefault(require("ioredis"));
const mqtt = __importStar(require("mqtt"));
const amqp = __importStar(require("amqplib"));
exports.RUTA_TALCA = [
    [-35.4264, -71.6660],
    [-35.4264, -71.6607],
    [-35.4264, -71.6554],
    [-35.4247, -71.6554],
    [-35.4230, -71.6554],
    [-35.4230, -71.6480],
];
let TelemetriaService = class TelemetriaService {
    constructor() {
        this.redis = new ioredis_1.default({ host: 'localhost', port: 6379, lazyConnect: true });
        this.mqttClient = null;
        this.rabbitChannel = null;
    }
    async onModuleInit() {
        this.redis.connect().catch(() => { });
        try {
            this.mqttClient = mqtt.connect('mqtt://localhost:1883', { reconnectPeriod: 2000 });
            this.mqttClient.on('connect', () => this.mqttClient?.subscribe('transporte/gps/bus101'));
            this.mqttClient.on('error', () => { });
        }
        catch { }
        try {
            const conn = await amqp.connect('amqp://localhost:5672');
            this.rabbitChannel = await conn.createChannel();
            await this.rabbitChannel.assertQueue('eventos_transporte', { durable: true });
        }
        catch {
            this.rabbitChannel = null;
        }
    }
    async publicarEvento(payload) {
        const mensaje = JSON.stringify(payload);
        await this.redis.set('bus:101', mensaje).catch(() => { });
        try {
            if (this.mqttClient?.connected) {
                this.mqttClient.publish('transporte/gps/bus101', mensaje);
            }
        }
        catch { }
        try {
            this.rabbitChannel?.sendToQueue('eventos_transporte', Buffer.from(mensaje));
        }
        catch { }
    }
};
exports.TelemetriaService = TelemetriaService;
exports.TelemetriaService = TelemetriaService = __decorate([
    (0, common_1.Injectable)()
], TelemetriaService);
//# sourceMappingURL=telemetria.service.js.map
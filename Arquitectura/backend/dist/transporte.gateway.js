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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransporteGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const ioredis_1 = __importDefault(require("ioredis"));
const mqtt = __importStar(require("mqtt"));
const amqp = __importStar(require("amqplib"));
const RUTA_TALCA = [
    [-35.4264, -71.6660],
    [-35.4264, -71.6607],
    [-35.4264, -71.6554],
    [-35.4247, -71.6554],
    [-35.4230, -71.6554],
    [-35.4230, -71.6480],
];
let TransporteGateway = class TransporteGateway {
    constructor() {
        this.redis = new ioredis_1.default({ host: 'localhost', port: 6379, lazyConnect: true });
        this.mqttClient = null;
        this.rabbitChannel = null;
        this.intervalo = null;
        this.pasoActual = 0;
    }
    async afterInit() {
        this.redis.connect().catch(() => { });
        try {
            this.mqttClient = mqtt.connect('mqtt://localhost:1883', {
                reconnectPeriod: 2000,
            });
            this.mqttClient.on('connect', () => {
                this.mqttClient?.subscribe('transporte/gps/bus101');
            });
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
    async sincronizarCapas(payload) {
        const mensaje = JSON.stringify(payload);
        try {
            await this.redis.set('bus:101', mensaje);
        }
        catch { }
        try {
            if (this.mqttClient?.connected) {
                this.mqttClient.publish('transporte/gps/bus101', mensaje);
            }
        }
        catch { }
        try {
            if (this.rabbitChannel) {
                this.rabbitChannel.sendToQueue('eventos_transporte', Buffer.from(mensaje));
            }
        }
        catch { }
        this.server.emit('actualizacion_bus', payload);
    }
    async crearBus(data) {
        if (this.intervalo)
            clearInterval(this.intervalo);
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
    async iniciarRecorrido(data) {
        if (this.intervalo)
            clearInterval(this.intervalo);
        this.pasoActual = 0;
        this.intervalo = setInterval(async () => {
            if (this.pasoActual >= RUTA_TALCA.length) {
                if (this.intervalo)
                    clearInterval(this.intervalo);
                return;
            }
            const [lat, lng] = RUTA_TALCA[this.pasoActual];
            const payload = {
                busId: 'BUS-101',
                pasajero: data.pasajero,
                estado: this.pasoActual === RUTA_TALCA.length - 1
                    ? 'Viaje finalizado'
                    : 'En movimiento (Pasajero a bordo)',
                lat,
                lng,
            };
            await this.sincronizarCapas(payload);
            this.pasoActual++;
        }, 1500);
    }
};
exports.TransporteGateway = TransporteGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], TransporteGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('solicitar_bus'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransporteGateway.prototype, "crearBus", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('tomar_bus'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransporteGateway.prototype, "iniciarRecorrido", null);
exports.TransporteGateway = TransporteGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: { origin: '*' } })
], TransporteGateway);
//# sourceMappingURL=transporte.gateway.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransporteGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const telemetria_service_1 = require("./telemetria.service");
let TransporteGateway = class TransporteGateway {
    constructor(telemetria) {
        this.telemetria = telemetria;
        this.intervalo = null;
        this.pasoActual = 0;
    }
    limpiarIntervalo() {
        if (this.intervalo)
            clearInterval(this.intervalo);
        this.pasoActual = 0;
    }
    async emitirYSincronizar(payload) {
        await this.telemetria.publicarEvento(payload);
        this.server.emit('actualizacion_bus', payload);
    }
    async crearBus(data) {
        this.limpiarIntervalo();
        await this.emitirYSincronizar({
            busId: 'BUS-101',
            linea: 'Línea 101',
            pasajero: data?.pasajero || 'Pasajero',
            estado: 'Esperando en paradero',
            lat: telemetria_service_1.RUTA_TALCA[0][0],
            lng: telemetria_service_1.RUTA_TALCA[0][1],
        });
    }
    async iniciarRecorrido(data) {
        this.limpiarIntervalo();
        this.intervalo = setInterval(async () => {
            if (this.pasoActual >= telemetria_service_1.RUTA_TALCA.length) {
                this.limpiarIntervalo();
                return;
            }
            const [lat, lng] = telemetria_service_1.RUTA_TALCA[this.pasoActual];
            const esUltimo = this.pasoActual === telemetria_service_1.RUTA_TALCA.length - 1;
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
    (0, websockets_1.WebSocketGateway)({ cors: { origin: '*' } }),
    __metadata("design:paramtypes", [telemetria_service_1.TelemetriaService])
], TransporteGateway);
//# sourceMappingURL=transporte.gateway.js.map
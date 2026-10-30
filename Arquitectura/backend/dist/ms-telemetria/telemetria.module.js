"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelemetriaModule = void 0;
const common_1 = require("@nestjs/common");
const telemetria_service_1 = require("./telemetria.service");
const transporte_gateway_1 = require("./transporte.gateway");
let TelemetriaModule = class TelemetriaModule {
};
exports.TelemetriaModule = TelemetriaModule;
exports.TelemetriaModule = TelemetriaModule = __decorate([
    (0, common_1.Module)({
        providers: [telemetria_service_1.TelemetriaService, transporte_gateway_1.TransporteGateway],
        exports: [telemetria_service_1.TelemetriaService],
    })
], TelemetriaModule);
//# sourceMappingURL=telemetria.module.js.map
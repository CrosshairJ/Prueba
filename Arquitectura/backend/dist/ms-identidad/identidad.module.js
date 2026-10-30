"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentidadModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const usuario_entity_1 = require("./usuario.entity");
const identidad_service_1 = require("./identidad.service");
const identidad_controller_1 = require("./identidad.controller");
let IdentidadModule = class IdentidadModule {
};
exports.IdentidadModule = IdentidadModule;
exports.IdentidadModule = IdentidadModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([usuario_entity_1.Usuario]),
            typeorm_1.TypeOrmModule.forFeature([usuario_entity_1.Usuario], 'sqlite_local'),
            jwt_1.JwtModule.register({
                secret: 'secreto_jwt_2026',
                signOptions: { expiresIn: '2h' },
            }),
        ],
        controllers: [identidad_controller_1.IdentidadController],
        providers: [identidad_service_1.IdentidadService],
        exports: [identidad_service_1.IdentidadService],
    })
], IdentidadModule);
//# sourceMappingURL=identidad.module.js.map
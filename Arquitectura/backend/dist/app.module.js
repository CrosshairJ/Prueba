"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const usuario_entity_1 = require("./ms-identidad/usuario.entity");
const identidad_module_1 = require("./ms-identidad/identidad.module");
const telemetria_module_1 = require("./ms-telemetria/telemetria.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: 'localhost',
                port: 5432,
                username: 'admin',
                password: 'admin123',
                database: 'transporte_db',
                entities: [usuario_entity_1.Usuario],
                synchronize: true,
            }),
            typeorm_1.TypeOrmModule.forRoot({
                name: 'sqlite_local',
                type: 'better-sqlite3',
                database: 'transporte_local.sqlite',
                entities: [usuario_entity_1.Usuario],
                synchronize: true,
            }),
            identidad_module_1.IdentidadModule,
            telemetria_module_1.TelemetriaModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
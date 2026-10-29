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
const jwt_1 = require("@nestjs/jwt");
const usuario_entity_1 = require("./usuario.entity");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const transporte_gateway_1 = require("./transporte.gateway");
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
            typeorm_1.TypeOrmModule.forFeature([usuario_entity_1.Usuario]),
            typeorm_1.TypeOrmModule.forFeature([usuario_entity_1.Usuario], 'sqlite_local'),
            jwt_1.JwtModule.register({
                secret: 'secreto_jwt_2026',
                signOptions: { expiresIn: '2h' },
            }),
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, transporte_gateway_1.TransporteGateway],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
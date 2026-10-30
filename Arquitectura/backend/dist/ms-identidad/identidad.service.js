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
exports.IdentidadService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const usuario_entity_1 = require("./usuario.entity");
const USUARIOS_SEMILLA = [
    { correo: 'pasajero@app.cl', clave: '123', nombre: 'Felipe Pasajero', rol: 'Pasajero' },
    { correo: 'conductor@app.cl', clave: '123', nombre: 'Antonio Conductor', rol: 'Conductor' },
];
let IdentidadService = class IdentidadService {
    constructor(pgRepo, sqliteRepo, jwt) {
        this.pgRepo = pgRepo;
        this.sqliteRepo = sqliteRepo;
        this.jwt = jwt;
    }
    async onModuleInit() {
        for (const repo of [this.pgRepo, this.sqliteRepo]) {
            try {
                if ((await repo.count()) === 0)
                    await repo.save(USUARIOS_SEMILLA);
            }
            catch { }
        }
    }
    generarRespuestaAuth(user) {
        const token = this.jwt.sign({ sub: user.id, rol: user.rol, nombre: user.nombre });
        return { token, nombre: user.nombre, rol: user.rol };
    }
    async login(correo, clave) {
        if (!correo || !clave) {
            throw new common_1.BadRequestException('Debes ingresar correo y clave');
        }
        let user = await this.pgRepo.findOne({ where: { correo, clave } }).catch(() => null);
        if (!user) {
            user = await this.sqliteRepo.findOne({ where: { correo, clave } });
        }
        if (!user) {
            throw new common_1.UnauthorizedException('Credenciales incorrectas');
        }
        return this.generarRespuestaAuth(user);
    }
    async registrar(datos) {
        if (!datos.correo || !datos.clave || !datos.nombre) {
            throw new common_1.BadRequestException('Faltan datos obligatorios');
        }
        const existe = await this.sqliteRepo.findOne({ where: { correo: datos.correo } });
        if (existe) {
            throw new common_1.BadRequestException('El correo ya está registrado');
        }
        const payload = { ...datos, rol: datos.rol || 'Pasajero' };
        const nuevo = await this.sqliteRepo.save(payload);
        await this.pgRepo.save(payload).catch(() => null);
        return this.generarRespuestaAuth(nuevo);
    }
};
exports.IdentidadService = IdentidadService;
exports.IdentidadService = IdentidadService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(usuario_entity_1.Usuario)),
    __param(1, (0, typeorm_1.InjectRepository)(usuario_entity_1.Usuario, 'sqlite_local')),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService])
], IdentidadService);
//# sourceMappingURL=identidad.service.js.map
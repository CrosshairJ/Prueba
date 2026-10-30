import {
  Injectable,
  OnModuleInit,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Usuario } from './usuario.entity';

const USUARIOS_SEMILLA = [
  { correo: 'pasajero@app.cl', clave: '123', nombre: 'Felipe Pasajero', rol: 'Pasajero' },
  { correo: 'conductor@app.cl', clave: '123', nombre: 'Antonio Conductor', rol: 'Conductor' },
];

@Injectable()
export class IdentidadService implements OnModuleInit {
  constructor(
    @InjectRepository(Usuario) private pgRepo: Repository<Usuario>,
    @InjectRepository(Usuario, 'sqlite_local') private sqliteRepo: Repository<Usuario>,
    private jwt: JwtService,
  ) {}

  async onModuleInit() {
    for (const repo of [this.pgRepo, this.sqliteRepo]) {
      try {
        if ((await repo.count()) === 0) await repo.save(USUARIOS_SEMILLA);
      } catch {}
    }
  }

  private generarRespuestaAuth(user: Usuario) {
    const token = this.jwt.sign({ sub: user.id, rol: user.rol, nombre: user.nombre });
    return { token, nombre: user.nombre, rol: user.rol };
  }

  async login(correo: string, clave: string) {
    if (!correo || !clave) {
      throw new BadRequestException('Debes ingresar correo y clave');
    }

    let user = await this.pgRepo.findOne({ where: { correo, clave } }).catch(() => null);
    if (!user) {
      user = await this.sqliteRepo.findOne({ where: { correo, clave } });
    }
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    return this.generarRespuestaAuth(user);
  }

  async registrar(datos: { correo: string; clave: string; nombre: string; rol?: string }) {
    if (!datos.correo || !datos.clave || !datos.nombre) {
      throw new BadRequestException('Faltan datos obligatorios');
    }

    const existe = await this.sqliteRepo.findOne({ where: { correo: datos.correo } });
    if (existe) {
      throw new BadRequestException('El correo ya está registrado');
    }

    const payload = { ...datos, rol: datos.rol || 'Pasajero' };
    const nuevo = await this.sqliteRepo.save(payload);
    await this.pgRepo.save(payload).catch(() => null);

    return this.generarRespuestaAuth(nuevo);
  }
}
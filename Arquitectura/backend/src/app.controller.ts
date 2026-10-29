import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  BadRequestException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Usuario } from './usuario.entity';

@Controller('api')
export class AppController implements OnModuleInit {
  constructor(
    @InjectRepository(Usuario) private repo: Repository<Usuario>,
    @InjectRepository(Usuario, 'sqlite_local') private sqliteRepo: Repository<Usuario>,
    private jwt: JwtService,
  ) {}

  async onModuleInit() {
    const usuariosIniciales = [
      {
        correo: 'pasajero@app.cl',
        clave: '123',
        nombre: 'Felipe Pasajero',
        rol: 'Pasajero',
      },
      {
        correo: 'conductor@app.cl',
        clave: '123',
        nombre: 'Antonio Conductor',
        rol: 'Conductor',
      },
    ];

    try {
      const totalPg = await this.repo.count();
      if (totalPg === 0) {
        await this.repo.save(usuariosIniciales);
      }
    } catch {}

    try {
      const totalSqlite = await this.sqliteRepo.count();
      if (totalSqlite === 0) {
        await this.sqliteRepo.save(usuariosIniciales);
      }
    } catch {}
  }

  @Post('login')
  async login(@Body() body: { correo: string; clave: string }) {
    if (!body.correo || !body.clave) {
      throw new BadRequestException('Debes ingresar correo y clave');
    }

    let user: Usuario | null = null;

    try {
      user = await this.repo.findOne({
        where: { correo: body.correo, clave: body.clave },
      });
    } catch {
      user = await this.sqliteRepo.findOne({
        where: { correo: body.correo, clave: body.clave },
      });
    }

    if (!user) {
      user = await this.sqliteRepo.findOne({
        where: { correo: body.correo, clave: body.clave },
      });
    }

    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const token = this.jwt.sign({
      sub: user.id,
      rol: user.rol,
      nombre: user.nombre,
    });

    return {
      token,
      nombre: user.nombre,
      rol: user.rol,
    };
  }

  @Post('registro')
  async registrar(
    @Body() body: { correo: string; clave: string; nombre: string; rol: string },
  ) {
    if (!body.correo || !body.clave || !body.nombre) {
      throw new BadRequestException('Faltan datos obligatorios');
    }

    const existente = await this.sqliteRepo.findOne({ where: { correo: body.correo } });
    if (existente) {
      throw new BadRequestException('El correo ya está registrado');
    }

    const datosUsuario = {
      correo: body.correo,
      clave: body.clave,
      nombre: body.nombre,
      rol: body.rol || 'Pasajero',
    };

    const nuevoUsuario = await this.sqliteRepo.save(datosUsuario);
    try {
      await this.repo.save(datosUsuario);
    } catch {}

    const token = this.jwt.sign({
      sub: nuevoUsuario.id,
      rol: nuevoUsuario.rol,
      nombre: nuevoUsuario.nombre,
    });

    return {
      token,
      nombre: nuevoUsuario.nombre,
      rol: nuevoUsuario.rol,
    };
  }
}
import { Controller, Post, Body } from '@nestjs/common';
import { IdentidadService } from './identidad.service';

@Controller('api')
export class IdentidadController {
  constructor(private readonly identidadService: IdentidadService) {}

  @Post('login')
  login(@Body() body: { correo: string; clave: string }) {
    return this.identidadService.login(body.correo, body.clave);
  }

  @Post('registro')
  registrar(@Body() body: { correo: string; clave: string; nombre: string; rol: string }) {
    return this.identidadService.registrar(body);
  }
}
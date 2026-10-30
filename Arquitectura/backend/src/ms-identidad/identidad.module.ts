import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Usuario } from './usuario.entity';
import { IdentidadService } from './identidad.service';
import { IdentidadController } from './identidad.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    TypeOrmModule.forFeature([Usuario], 'sqlite_local'),
    JwtModule.register({
      secret: 'secreto_jwt_2026',
      signOptions: { expiresIn: '2h' },
    }),
  ],
  controllers: [IdentidadController],
  providers: [IdentidadService],
  exports: [IdentidadService],
})
export class IdentidadModule {}
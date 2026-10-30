import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './ms-identidad/usuario.entity';
import { IdentidadModule } from './ms-identidad/identidad.module';
import { TelemetriaModule } from './ms-telemetria/telemetria.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'admin123',
      database: 'transporte_db',
      entities: [Usuario],
      synchronize: true,
    }),
    TypeOrmModule.forRoot({
      name: 'sqlite_local',
      type: 'better-sqlite3',
      database: 'transporte_local.sqlite',
      entities: [Usuario],
      synchronize: true,
    }),
    IdentidadModule,
    TelemetriaModule,
  ],
})
export class AppModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Usuario } from './usuario.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransporteGateway } from './transporte.gateway';

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
    TypeOrmModule.forFeature([Usuario]),
    TypeOrmModule.forFeature([Usuario], 'sqlite_local'),
    JwtModule.register({
      secret: 'secreto_jwt_2026',
      signOptions: { expiresIn: '2h' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, TransporteGateway],
})
export class AppModule {}
import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Usuario } from './usuario.entity';
export declare class IdentidadService implements OnModuleInit {
    private pgRepo;
    private sqliteRepo;
    private jwt;
    constructor(pgRepo: Repository<Usuario>, sqliteRepo: Repository<Usuario>, jwt: JwtService);
    onModuleInit(): Promise<void>;
    private generarRespuestaAuth;
    login(correo: string, clave: string): Promise<{
        token: string;
        nombre: string;
        rol: string;
    }>;
    registrar(datos: {
        correo: string;
        clave: string;
        nombre: string;
        rol?: string;
    }): Promise<{
        token: string;
        nombre: string;
        rol: string;
    }>;
}

import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Usuario } from './usuario.entity';
export declare class AppController implements OnModuleInit {
    private repo;
    private sqliteRepo;
    private jwt;
    constructor(repo: Repository<Usuario>, sqliteRepo: Repository<Usuario>, jwt: JwtService);
    onModuleInit(): Promise<void>;
    login(body: {
        correo: string;
        clave: string;
    }): Promise<{
        token: string;
        nombre: string;
        rol: string;
    }>;
    registrar(body: {
        correo: string;
        clave: string;
        nombre: string;
        rol: string;
    }): Promise<{
        token: string;
        nombre: string;
        rol: string;
    }>;
}

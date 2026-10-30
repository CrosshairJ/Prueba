import { IdentidadService } from './identidad.service';
export declare class IdentidadController {
    private readonly identidadService;
    constructor(identidadService: IdentidadService);
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

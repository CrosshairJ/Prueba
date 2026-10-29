
import { User } from "../models";

const API_URL = "http://192.168.1.88:3000/api";

export const AuthService = {
  async register(newUser: User): Promise<boolean> {
    try {
      const res = await fetch(`${API_URL}/registro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correo: newUser.email.trim().toLowerCase(),
          clave: newUser.password,
          nombre: newUser.name.trim(),
          rol: newUser.profile,
        }),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async login(email: string, password: string): Promise<User | null> {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correo: email.trim().toLowerCase(),
          clave: password,
        }),
      });

      if (!res.ok) return null;

      // JSON que envía tu NestJS: { token, nombre, rol }
      const data = await res.json();

      return {
        name: data.nombre,
        email: email.trim().toLowerCase(),
        password: password,
        profile: data.rol === "Conductor" ? "Conductor" : "Pasajero",
      };
    } catch {
      return null;
    }
  },

  async changePassword(user: User, oldPass: string, newPass: string): Promise<User | null> {
    if (user.password !== oldPass) return null;
    return { ...user, password: newPass };
  },
};
// src/viewmodels/useLoginViewModel.ts
import { useState } from "react";
import { useAuth } from "./AuthViewModel";
import { FormResult } from "./FormResult";

export function useLoginViewModel() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (): Promise<FormResult> => {
    if (!email.trim() || !password) {
      return {
        ok: false,
        title: "Datos incompletos",
        message: "Ingresa tu correo electrónico y contraseña.",
      };
    }

    const ok = await login(email, password);
    if (!ok) {
      return {
        ok: false,
        title: "Error de acceso",
        message: "Credenciales incorrectas o servidor no disponible.",
      };
    }

    return { ok: true, title: "Bienvenido", message: "Sesión iniciada." };
  };

  return { email, setEmail, password, setPassword, submit };
}
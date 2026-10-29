import { useState } from 'react';
import { Profile } from '../models';
import { FormResult } from './FormResult';
import { useAuth } from './AuthViewModel';

export function useRegisterViewModel() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profile, setProfile] = useState<Profile>('Pasajero');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);

  const togglePasswordVisibility = () => setShowPass(prev => !prev);

  const submit = async (): Promise<FormResult> => {
    if (!name.trim() || !email.includes('@') || password.length < 6 || password !== confirm) {
      return {
        ok: false,
        title: 'Revisa los datos',
        message:
          'Completa los campos, usa un correo válido, una contraseña de al menos 6 caracteres y confirma la contraseña.',
      };
    }
    const created = await register({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      profile,
    });
    if (!created) {
      return { ok: false, title: 'Correo registrado', message: 'Ya existe una cuenta con ese correo.' };
    }
    return { ok: true, title: 'Registro exitoso', message: 'Ahora inicia sesión con tu correo y contraseña.' };
  };

  return {
    name, setName,
    email, setEmail,
    profile, setProfile,
    password, setPassword,
    confirm, setConfirm,
    showPass, togglePasswordVisibility,
    submit,
  };
}

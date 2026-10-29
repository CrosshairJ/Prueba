import { useState } from 'react';
import { FormResult } from './FormResult';
import { useAuth } from './AuthViewModel';
import { useTheme } from './ThemeViewModel';

export function useProfileViewModel() {
  const { user, changePassword, logout } = useAuth();
  const { dark, toggleDark } = useTheme();
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');

  const submitPasswordChange = async (): Promise<FormResult> => {
    if (!oldPass || newPass.length < 6 || newPass !== confirm) {
      return {
        ok: false,
        title: 'Revisa los datos',
        message: 'Ingresa la contraseña actual, una nueva de al menos 6 caracteres y su confirmación.',
      };
    }
    if (!(await changePassword(oldPass, newPass))) {
      return { ok: false, title: 'Error', message: 'La contraseña actual no es correcta.' };
    }
    setOldPass('');
    setNewPass('');
    setConfirm('');
    return { ok: true, title: 'Éxito', message: 'La contraseña fue actualizada.' };
  };

  return {
    user, dark, toggleDark, logout,
    oldPass, setOldPass,
    newPass, setNewPass,
    confirm, setConfirm,
    submitPasswordChange,
  };
}

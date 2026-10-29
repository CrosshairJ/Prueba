import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { User } from '../models';
import { AuthService } from '../services';

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (newUser: User) => Promise<boolean>;
  changePassword: (oldPass: string, newPass: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

/** Sesión del usuario: es el estado compartido por toda la app. */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    const found = await AuthService.login(email, password);
    if (found) setUser(found);
    return found !== null;
  }, []);

  const register = useCallback((newUser: User) => AuthService.register(newUser), []);

  const changePassword = useCallback(
    async (oldPass: string, newPass: string) => {
      if (!user) return false;
      const updated = await AuthService.changePassword(user, oldPass, newPass);
      if (!updated) return false;
      setUser(updated);
      return true;
    },
    [user],
  );

  const logout = useCallback(() => setUser(null), []);

  const value = useMemo(
    () => ({ user, login, register, changePassword, logout }),
    [user, login, register, changePassword, logout],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('AuthProvider no disponible');
  return value;
}

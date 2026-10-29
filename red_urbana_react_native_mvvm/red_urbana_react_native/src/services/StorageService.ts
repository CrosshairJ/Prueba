import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../models';

const KEYS = {
  users: 'redurbana.users',
  dark: 'redurbana.dark',
} as const;

/** Único punto de acceso a AsyncStorage. */
export const StorageService = {
  async getUsers(): Promise<User[]> {
    try {
      const raw = await AsyncStorage.getItem(KEYS.users);
      return raw ? (JSON.parse(raw) as User[]) : [];
    } catch {
      return [];
    }
  },

  async saveUsers(users: User[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.users, JSON.stringify(users));
  },

  async getDarkMode(): Promise<boolean> {
    try {
      return (await AsyncStorage.getItem(KEYS.dark)) === 'true';
    } catch {
      return false;
    }
  },

  async saveDarkMode(dark: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.dark, String(dark));
    } catch {
      /* preferencia no crítica */
    }
  },
};

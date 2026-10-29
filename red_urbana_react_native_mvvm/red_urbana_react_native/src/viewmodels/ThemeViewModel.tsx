import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { StorageService } from '../services';
import { DARK, LIGHT, ThemeColors } from '../theme/colors';

type ThemeContextType = {
  dark: boolean;
  colors: ThemeColors;
  toggleDark: () => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    StorageService.getDarkMode().then(stored => {
      setDark(stored);
      setReady(true);
    });
  }, []);

  const toggleDark = useCallback(() => {
    const next = !dark;
    setDark(next);
    StorageService.saveDarkMode(next);
  }, [dark]);

  const value = useMemo(() => ({ dark, colors: dark ? DARK : LIGHT, toggleDark }), [dark, toggleDark]);

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('ThemeProvider no disponible');
  return value;
}

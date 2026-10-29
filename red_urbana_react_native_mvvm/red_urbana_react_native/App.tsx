import React from 'react';
import { AppNavigator } from './src/navigation/AppNavigator';
import { AuthProvider } from './src/viewmodels/AuthViewModel';
import { ThemeProvider } from './src/viewmodels/ThemeViewModel';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
}

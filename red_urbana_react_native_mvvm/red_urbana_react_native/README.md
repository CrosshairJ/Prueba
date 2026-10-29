# Red Urbana — React Native + Expo

Migración de demostración de la app Flutter a React Native con TypeScript.

## Funciones incluidas
- Registro e inicio de sesión para Pasajero y Conductor.
- Navegación distinta según el perfil.
- Búsqueda de buses por número, línea o destino.
- Panel de conductor con reporte de incidentes y solicitud de parada asistida.
- Alertas de demostración.
- Perfil con nombre, correo y tipo de usuario.
- Cambio de contraseña.
- Tema claro/oscuro global.
- Cuentas guardadas en AsyncStorage para persistir entre reinicios.

## Arquitectura (MVVM)

```
App.tsx                  Punto de entrada: monta los providers y el navegador
src/
├── models/              Datos puros: User, Profile, Bus, ServiceAlert
├── services/            Acceso a datos, sin React ni UI
│   ├── StorageService   Único punto de contacto con AsyncStorage
│   ├── AuthService      register / login / changePassword
│   ├── BusService       Buses y coordenadas (datos de demostración)
│   └── AlertsService    Alertas del servicio
├── viewmodels/          Lógica de presentación (hooks)
│   ├── ThemeViewModel   Tema claro/oscuro global (ThemeProvider, useTheme)
│   ├── AuthViewModel    Sesión del usuario (AuthProvider, useAuth)
│   └── use*ViewModel    Estado, validaciones y acciones de cada pantalla
├── views/               Solo interfaz: leen del ViewModel y le delegan las acciones
│   ├── *Screen.tsx      Login, Register, Passenger, Map, Alerts, Driver, Profile
│   └── components/      Page, Card, Field, botones, tipografía
├── navigation/          Stack de autenticación y pestañas por perfil
└── theme/               Paletas de color
```

Flujo: `View → ViewModel → Service → Model`. Las vistas no importan servicios ni
AsyncStorage; los ViewModels no importan componentes de React Native (salvo los
providers). Cuando una acción puede fallar, el ViewModel devuelve un `FormResult`
(`ok`, `title`, `message`) y la vista decide cómo mostrarlo.

## Ejecutar

1. Instala Node.js LTS y Android Studio.
2. Abre una terminal en la carpeta del proyecto.
3. Ejecuta:
   ```bash
   npm install
   npx expo start
   ```
4. Pulsa `a` para abrir en un emulador Android con Android Studio activo.

Si prefieres crear un proyecto Expo nuevo y copiar los archivos:
```bash
npx create-expo-app@latest red-urbana
```
Luego copia `App.tsx`, `src/` y las dependencias de `package.json` a ese proyecto.

## Importante
Es una demo académica. Los buses, minutos, alertas y posiciones no vienen de GPS ni de un servidor. Las contraseñas se guardan localmente en AsyncStorage para probar el flujo; no es seguro para producción. Para una app real, usa autenticación de backend (por ejemplo, Firebase Auth o un servidor con hash seguro), control de permisos para conductores y una API de transporte.

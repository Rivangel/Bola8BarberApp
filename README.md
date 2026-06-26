# Bola 8 Barbería

App móvil (React Native + Expo) para la gestión de citas de una barbería. Tema
oscuro, en español, fiel al diseño importado desde Claude Design.

## Stack

- **Expo SDK 56** + **expo-router** (Bottom Tabs + Stack)
- **Zustand** + **AsyncStorage** — estado global persistido (citas, clientes, perfil)
- **React Hook Form** — validación del formulario _Nueva cita_
- **date-fns** (locale `es`) — formato de fechas
- **expo-image-picker** — foto de perfil
- **react-native-svg** — iconografía de línea
- **@expo-google-fonts** — Oswald (titulares) · Manrope (texto)

## Ejecutar

```bash
npm install
npx expo start
```

Pulsa `a` (Android), `i` (iOS) o escanea el QR con Expo Go.

## Estructura

```
src/
  app/
    _layout.tsx            Stack raíz + carga de fuentes + gate de sesión
    (tabs)/                Inicio · Calendario · Nueva cita · Clientes · Perfil
    cita/[id].tsx          Detalle / edición de cita
    cliente/[id].tsx       Ficha de cliente + historial
  components/              Componentes de UI reutilizables
  store/                   Stores Zustand + datos semilla
  hooks/                   Selectores derivados (citas, clientes)
  constants/               colors.ts · typography.ts (tokens del diseño)
  utils/dates.ts           Helpers de fecha/hora en español
```

## Notas de diseño

- La pantalla **Calendario** usa una rejilla horaria semanal a medida (no el
  widget de `react-native-calendars`) para reproducir fielmente el diseño:
  columnas L–S con bloques de cita posicionados por hora.
- Las tarjetas de cita aparecen con un _fade-in_ escalonado al montar la lista.
- Los datos se siembran en el primer arranque (6 clientes, 4 citas de hoy,
  perfil de Héctor Gómez) y persisten en AsyncStorage.

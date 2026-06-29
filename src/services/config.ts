import { Platform } from 'react-native';

/**
 * Configuración de acceso a la API REST de Bola 8 Barbería.
 *
 * La URL base se toma de `EXPO_PUBLIC_API_URL` (las variables `EXPO_PUBLIC_*`
 * se inyectan en el bundle por Expo). Si no se define, se usa un valor por
 * defecto según la plataforma:
 *   - Android emulador: `10.0.2.2` apunta al `localhost` de la máquina anfitriona.
 *   - iOS / web: `localhost`.
 *
 * Para un dispositivo físico debes definir `EXPO_PUBLIC_API_URL` con la IP de tu
 * equipo en la red local, p. ej. `http://192.168.1.50:3000`.
 */

const DEFAULT_PORT = 3000;

function defaultBaseUrl(): string {
  const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  return `http://${host}:${DEFAULT_PORT}`;
}

/** URL base del servidor (sin el sufijo `/api`). */
export const API_BASE_URL: string =
  process.env.EXPO_PUBLIC_API_URL?.trim() || defaultBaseUrl();

/** Prefijo común de los endpoints REST. */
export const API_PREFIX = '/api';

/** Tiempo máximo de espera por petición (ms). */
export const API_TIMEOUT_MS = 15000;

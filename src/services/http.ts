import axios, { AxiosError, type AxiosInstance } from 'axios';
import { API_BASE_URL, API_PREFIX, API_TIMEOUT_MS } from './config';

/**
 * Cliente HTTP centralizado (axios) para toda la app.
 *
 * Todos los services por módulo (citas, clientes, servicios, barberos)
 * reutilizan esta instancia, de modo que la URL base, el timeout y el manejo
 * de errores quedan definidos en un único lugar.
 */

export const http: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}${API_PREFIX}`,
  timeout: API_TIMEOUT_MS,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Define (o elimina) el token JWT que se envía en la cabecera `Authorization`
 * de todas las peticiones. El store de sesión la llama al iniciar/cerrar sesión
 * y al rehidratarse desde AsyncStorage.
 */
export function setAuthToken(token: string | null): void {
  if (token) {
    http.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete http.defaults.headers.common.Authorization;
  }
}

/** Error normalizado de la API: expone status y mensaje legible. */
export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Convierte cualquier fallo de axios en un `ApiError` uniforme, extrayendo el
// mensaje `{ error }` que devuelve la API cuando está disponible.
http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ error?: string }>) => {
    const status = error.response?.status ?? 0;

    // Sesión expirada/inválida: si teníamos token y la API responde 401,
    // cerramos sesión. Import diferido para evitar un ciclo con el store.
    if (status === 401 && http.defaults.headers.common.Authorization) {
      const { useProfileStore } = require('../store/profile') as typeof import('../store/profile');
      useProfileStore.getState().logout();
    }

    const apiMessage = error.response?.data?.error;
    const message =
      apiMessage ||
      (status === 0
        ? 'No se pudo conectar con el servidor. Revisa tu conexión y EXPO_PUBLIC_API_URL.'
        : error.message) ||
      'Error desconocido al comunicar con la API.';

    return Promise.reject(new ApiError(message, status, error.response?.data));
  },
);

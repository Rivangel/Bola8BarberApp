/**
 * Punto de entrada de la capa de services (consumo de la API REST con axios).
 *
 * Uso:
 *   import { citasService, clientesService } from '@/services';
 *   const citas = await citasService.listByDate('2026-06-28');
 */

export { http, ApiError } from './http';
export { API_BASE_URL } from './config';

export { citasService } from './citas.service';
export { clientesService } from './clientes.service';
export { serviciosService } from './servicios.service';
export { barberosService } from './barberos.service';

export * from './types';

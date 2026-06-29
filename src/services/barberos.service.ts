import { http } from './http';
import type { BarberoDTO } from './types';

/**
 * Service del módulo de barberos (catálogo). Llamadas a /api/barberos.
 */

/** GET /api/barberos — lista los barberos activos. */
async function list(): Promise<BarberoDTO[]> {
  const { data } = await http.get<BarberoDTO[]>('/barberos');
  return data;
}

export const barberosService = { list };

import { http } from './http';
import type { ServicioDTO } from './types';

/**
 * Service del módulo de servicios (catálogo). Llamadas a /api/servicios.
 */

/** GET /api/servicios — lista los servicios ofrecidos. */
async function list(): Promise<ServicioDTO[]> {
  const { data } = await http.get<ServicioDTO[]>('/servicios');
  return data;
}

/** Busca un servicio por nombre exacto (o `undefined` si no existe). */
async function findByName(nombre: string): Promise<ServicioDTO | undefined> {
  const servicios = await list();
  return servicios.find((s) => s.nombre.toLowerCase() === nombre.trim().toLowerCase());
}

export const serviciosService = { list, findByName };

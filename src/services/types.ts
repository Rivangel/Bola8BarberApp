/**
 * DTOs que devuelve la API REST (forma "cruda" del backend, en español).
 * Se mantienen separados de los tipos de dominio de la app (`@/types`); la
 * conversión entre ambos vive en `mappers.ts`.
 */

export type EstadoCitaDTO = 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA' | 'COMPLETADA';

export interface ClienteDTO {
  id: number;
  nombre: string;
  telefono: string;
  notas?: string | null;
  createdAt: string;
}

export interface BarberoDTO {
  id: number;
  nombre: string;
  activo: boolean;
}

export interface ServicioDTO {
  id: number;
  nombre: string;
  duracionMinutos: number;
  /** Prisma serializa `Decimal` como string, p. ej. "150.00". */
  precio: string;
}

export interface CitaDTO {
  id: number;
  clienteId: number;
  barberoId: number;
  servicioId: number;
  /** Fecha del día en ISO (medianoche UTC), p. ej. "2026-06-28T00:00:00.000Z". */
  fecha: string;
  horaInicio: string;
  horaFin: string;
  estado: EstadoCitaDTO;
  creadaEn: string;
  // Relaciones incluidas por la API.
  cliente?: ClienteDTO;
  barbero?: BarberoDTO;
  servicio?: ServicioDTO;
}

/** Cuerpo para crear una cita (POST /api/citas). */
export interface CrearCitaBody {
  clienteId?: number;
  telefono?: string;
  nombre?: string;
  barberoId: number;
  servicioId: number;
  fecha: string; // "DD/MM/YYYY"
  horaInicio: string; // "HH:MM"
  estado?: EstadoCitaDTO;
}

/** Cuerpo para actualizar una cita (PUT /api/citas/:id). */
export interface ActualizarCitaBody {
  fecha?: string; // "DD/MM/YYYY"
  horaInicio?: string;
  barberoId?: number;
  estado?: EstadoCitaDTO;
}

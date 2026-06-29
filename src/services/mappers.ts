import type { Appointment, AppointmentStatus, Client, ServiceName } from '@/types';
import type { CitaDTO, ClienteDTO, EstadoCitaDTO } from './types';

/**
 * Conversión entre los DTOs de la API (español, forma de Prisma) y los tipos
 * de dominio de la app. Centraliza el "anti-corruption layer" para que las
 * pantallas y stores trabajen siempre con los tipos de `@/types`.
 */

/** Iniciales a partir del nombre (misma lógica que el store de clientes). */
export function buildInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

// ── Estado de cita ↔ status de la app ─────────────────────────────────
const ESTADO_A_STATUS: Record<EstadoCitaDTO, AppointmentStatus> = {
  PENDIENTE: 'pendiente',
  CONFIRMADA: 'confirmada',
  CANCELADA: 'cancelada',
  COMPLETADA: 'confirmada', // la app no distingue "completada"
};

const STATUS_A_ESTADO: Record<AppointmentStatus, EstadoCitaDTO> = {
  pendiente: 'PENDIENTE',
  confirmada: 'CONFIRMADA',
  cancelada: 'CANCELADA',
};

export function estadoToStatus(estado: EstadoCitaDTO): AppointmentStatus {
  return ESTADO_A_STATUS[estado] ?? 'pendiente';
}

export function statusToEstado(status: AppointmentStatus): EstadoCitaDTO {
  return STATUS_A_ESTADO[status] ?? 'PENDIENTE';
}

// ── Fechas ────────────────────────────────────────────────────────────

/** ISO de la API ("...T00:00:00Z") → fecha de la app "yyyy-MM-dd". */
export function isoToAppDate(iso: string): string {
  return iso.slice(0, 10);
}

/** Fecha de la app "yyyy-MM-dd" → formato que espera la API "DD/MM/YYYY". */
export function appDateToApi(appDate: string): string {
  const [y, m, d] = appDate.split('-');
  return `${d}/${m}/${y}`;
}

/** Duración en minutos entre dos "HH:MM". */
function diffMinutes(inicio: string, fin: string): number {
  const [hi, mi] = inicio.split(':').map(Number);
  const [hf, mf] = fin.split(':').map(Number);
  return hf * 60 + mf - (hi * 60 + mi);
}

// ── DTO → tipos de la app ─────────────────────────────────────────────

export function citaToAppointment(dto: CitaDTO): Appointment {
  return {
    id: String(dto.id),
    clientId: String(dto.clienteId),
    service: (dto.servicio?.nombre ?? 'Corte') as ServiceName,
    date: isoToAppDate(dto.fecha),
    startTime: dto.horaInicio,
    durationMin: dto.servicio?.duracionMinutos ?? diffMinutes(dto.horaInicio, dto.horaFin),
    status: estadoToStatus(dto.estado),
    price: Number(dto.servicio?.precio ?? 0),
  };
}

export function clienteToClient(dto: ClienteDTO): Client {
  return {
    id: String(dto.id),
    name: dto.nombre,
    phone: dto.telefono,
    notes: dto.notas ?? undefined,
    initials: buildInitials(dto.nombre),
  };
}

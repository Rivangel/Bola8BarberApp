import type { Appointment } from '@/types';
import { http } from './http';
import { appDateToApi, citaToAppointment, statusToEstado } from './mappers';
import type { ActualizarCitaBody, CitaDTO, CrearCitaBody } from './types';

/**
 * Service del módulo de citas. Encapsula todas las llamadas HTTP a /api/citas
 * y devuelve siempre tipos de dominio de la app (`Appointment`).
 */

export interface CrearCitaInput {
  clienteId?: number;
  telefono?: string;
  nombre?: string;
  barberoId: number;
  servicioId: number;
  /** Fecha de la app en "yyyy-MM-dd". */
  date: string;
  /** Hora de inicio "HH:MM". */
  horaInicio: string;
  status?: Appointment['status'];
}

export interface ActualizarCitaInput {
  /** Nueva fecha de la app en "yyyy-MM-dd" (reagendar). */
  date?: string;
  horaInicio?: string;
  barberoId?: number;
  status?: Appointment['status'];
}

/** GET /api/citas?fecha=YYYY-MM-DD — citas de un día. */
async function listByDate(appDate: string): Promise<Appointment[]> {
  const { data } = await http.get<CitaDTO[]>('/citas', { params: { fecha: appDate } });
  return data.map(citaToAppointment);
}

/** POST /api/citas — crea una cita. */
async function create(input: CrearCitaInput): Promise<Appointment> {
  const body: CrearCitaBody = {
    clienteId: input.clienteId,
    telefono: input.telefono,
    nombre: input.nombre,
    barberoId: input.barberoId,
    servicioId: input.servicioId,
    fecha: appDateToApi(input.date),
    horaInicio: input.horaInicio,
    estado: input.status ? statusToEstado(input.status) : undefined,
  };
  const { data } = await http.post<CitaDTO>('/citas', body);
  return citaToAppointment(data);
}

/** PUT /api/citas/:id — reagenda o cambia el estado de una cita. */
async function update(id: string | number, changes: ActualizarCitaInput): Promise<Appointment> {
  const body: ActualizarCitaBody = {
    fecha: changes.date ? appDateToApi(changes.date) : undefined,
    horaInicio: changes.horaInicio,
    barberoId: changes.barberoId,
    estado: changes.status ? statusToEstado(changes.status) : undefined,
  };
  const { data } = await http.put<CitaDTO>(`/citas/${id}`, body);
  return citaToAppointment(data);
}

/** DELETE /api/citas/:id — cancela una cita (estado = CANCELADA). */
async function cancel(id: string | number): Promise<Appointment> {
  const { data } = await http.delete<{ mensaje: string; cita: CitaDTO }>(`/citas/${id}`);
  return citaToAppointment(data.cita);
}

export const citasService = { listByDate, create, update, cancel };

import type { Appointment, Client } from '@/types';
import { http } from './http';
import { citaToAppointment, clienteToClient } from './mappers';
import type { CitaDTO, ClienteDTO } from './types';

/**
 * Service del módulo de clientes. Llamadas a /api/clientes.
 *
 * Nota: la API aún no expone creación/edición de clientes de forma directa
 * (los clientes se crean automáticamente al agendar una cita con teléfono +
 * nombre). Cuando esos endpoints existan, se añaden aquí.
 */

/** GET /api/clientes — lista de clientes. */
async function list(): Promise<Client[]> {
  const { data } = await http.get<ClienteDTO[]>('/clientes');
  return data.map(clienteToClient);
}

export interface ActualizarClienteInput {
  name?: string;
  phone?: string;
  notes?: string | null;
}

/** PUT /api/clientes/:id — actualiza nombre, teléfono y/o notas. */
async function update(id: string | number, input: ActualizarClienteInput): Promise<Client> {
  const { data } = await http.put<ClienteDTO>(`/clientes/${id}`, {
    nombre: input.name,
    telefono: input.phone,
    notas: input.notes,
  });
  return clienteToClient(data);
}

/** GET /api/clientes/:telefono/historial — historial de citas de un cliente. */
async function historial(telefono: string): Promise<Appointment[]> {
  const { data } = await http.get<CitaDTO[]>(`/clientes/${encodeURIComponent(telefono)}/historial`);
  return data.map(citaToAppointment);
}

export const clientesService = { list, update, historial };

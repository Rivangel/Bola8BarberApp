import { useMemo } from 'react';
import { useAppointmentsStore } from '@/store/appointments';
import { useClientsStore } from '@/store/clients';
import type { Appointment, Client } from '@/types';

export type AppointmentWithClient = Appointment & { client?: Client };

function byStartTime(a: Appointment, b: Appointment) {
  return a.startTime.localeCompare(b.startTime);
}

/** Appointments joined with their client, plus date-scoped selectors. */
export function useAppointments() {
  const appointments = useAppointmentsStore((s) => s.appointments);
  const clients = useClientsStore((s) => s.clients);

  return useMemo(() => {
    const clientById = new Map(clients.map((c) => [c.id, c]));
    const joined: AppointmentWithClient[] = appointments
      .map((a) => ({ ...a, client: clientById.get(a.clientId) }))
      .sort(byStartTime);

    const byDate = (iso: string) => joined.filter((a) => a.date === iso);

    return { all: joined, byDate };
  }, [appointments, clients]);
}

export function useAppointment(id: string | undefined): AppointmentWithClient | undefined {
  const appointment = useAppointmentsStore((s) =>
    id ? s.appointments.find((a) => a.id === id) : undefined
  );
  const client = useClientsStore((s) =>
    appointment ? s.clients.find((c) => c.id === appointment.clientId) : undefined
  );
  if (!appointment) return undefined;
  return { ...appointment, client };
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { ApiError, barberosService, citasService, serviciosService } from '@/services';
import type { Appointment, AppointmentStatus, ServiceName } from '@/types';

/** Datos para crear una cita desde la app (la pantalla "Nueva cita"). */
export type NewAppointmentInput = {
  clientId: string;
  /** Nombre/teléfono del cliente, para que la API lo cree si aún no existe. */
  clientName?: string;
  clientPhone?: string;
  service: ServiceName;
  date: string; // "yyyy-MM-dd"
  startTime: string; // "HH:MM"
  durationMin: number;
  price: number;
  status?: AppointmentStatus;
};

type AppointmentsState = {
  appointments: Appointment[];
  loading: boolean;
  error?: string;
  /** Carga las citas de un día desde la API y las fusiona en el estado. */
  loadByDate: (appDate: string) => Promise<void>;
  /** Crea una cita en la API y la agrega al estado. */
  addAppointment: (data: NewAppointmentInput) => Promise<Appointment>;
  /** Actualiza una cita (estado / reagendado en la API; notas y servicio en local). */
  updateAppointment: (id: string, data: Partial<Appointment>) => Promise<void>;
  /** Cancela una cita en la API (estado = CANCELADA). */
  cancelAppointment: (id: string) => Promise<void>;
  removeAppointment: (id: string) => void;
  getAppointment: (id: string) => Appointment | undefined;
};

function mensajeError(e: unknown, fallback: string): string {
  return e instanceof ApiError ? e.message : fallback;
}

export const useAppointmentsStore = create<AppointmentsState>()(
  persist(
    (set, get) => ({
      appointments: [],
      loading: false,
      error: undefined,

      loadByDate: async (appDate) => {
        set({ loading: true, error: undefined });
        try {
          const delDia = await citasService.listByDate(appDate);
          // Reemplazamos las citas de ese día y conservamos las del resto.
          const otras = get().appointments.filter((a) => a.date !== appDate);
          set({ appointments: [...otras, ...delDia], loading: false });
        } catch (e) {
          set({ loading: false, error: mensajeError(e, 'No se pudieron cargar las citas.') });
        }
      },

      addAppointment: async (data) => {
        // Resolver servicio y barbero (la API trabaja con IDs).
        const servicio = await serviciosService.findByName(data.service);
        if (!servicio) {
          throw new ApiError(
            `El servicio "${data.service}" no está disponible en el servidor.`,
            400,
          );
        }
        const barberos = await barberosService.list();
        if (barberos.length === 0) {
          throw new ApiError('No hay barberos disponibles en el servidor.', 400);
        }

        const clienteIdNum = Number(data.clientId);
        const cita = await citasService.create({
          // Si el id es numérico proviene de la API; si no, dejamos que la API
          // cree/relacione al cliente por teléfono + nombre.
          clienteId: Number.isInteger(clienteIdNum) ? clienteIdNum : undefined,
          telefono: data.clientPhone,
          nombre: data.clientName,
          barberoId: barberos[0].id,
          servicioId: servicio.id,
          date: data.date,
          horaInicio: data.startTime,
          status: data.status,
        });

        set((s) => ({ appointments: [...s.appointments.filter((a) => a.id !== cita.id), cita] }));
        return cita;
      },

      updateAppointment: async (id, data) => {
        // La API permite reagendar (fecha/hora) y cambiar estado; el servicio y
        // las notas se mantienen en local (la API no los actualiza por ahora).
        const cambiosApi =
          data.date !== undefined || data.startTime !== undefined || data.status !== undefined;
        try {
          if (cambiosApi) {
            await citasService.update(id, {
              date: data.date,
              horaInicio: data.startTime,
              status: data.status,
            });
          }
          set((s) => ({
            appointments: s.appointments.map((a) => (a.id === id ? { ...a, ...data } : a)),
          }));
        } catch (e) {
          set({ error: mensajeError(e, 'No se pudo actualizar la cita.') });
          throw e;
        }
      },

      cancelAppointment: async (id) => {
        try {
          await citasService.cancel(id);
          set((s) => ({
            appointments: s.appointments.map((a) =>
              a.id === id ? { ...a, status: 'cancelada' } : a
            ),
          }));
        } catch (e) {
          set({ error: mensajeError(e, 'No se pudo cancelar la cita.') });
          throw e;
        }
      },

      removeAppointment: (id) =>
        set((s) => ({ appointments: s.appointments.filter((a) => a.id !== id) })),
      getAppointment: (id) => get().appointments.find((a) => a.id === id),
    }),
    { name: 'bola8-appointments', storage: createJSONStorage(() => AsyncStorage) }
  )
);

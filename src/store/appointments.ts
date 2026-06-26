import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Appointment, AppointmentStatus } from '@/types';
import { seedAppointments } from './seed';

export type NewAppointmentInput = Omit<Appointment, 'id' | 'status'> & {
  status?: AppointmentStatus;
};

type AppointmentsState = {
  appointments: Appointment[];
  addAppointment: (data: NewAppointmentInput) => Appointment;
  updateAppointment: (id: string, data: Partial<Appointment>) => void;
  cancelAppointment: (id: string) => void;
  removeAppointment: (id: string) => void;
  getAppointment: (id: string) => Appointment | undefined;
};

export const useAppointmentsStore = create<AppointmentsState>()(
  persist(
    (set, get) => ({
      appointments: seedAppointments,
      addAppointment: (data) => {
        const appt: Appointment = {
          id: `a_${Date.now()}`,
          status: data.status ?? 'pendiente',
          ...data,
        };
        set((s) => ({ appointments: [...s.appointments, appt] }));
        return appt;
      },
      updateAppointment: (id, data) =>
        set((s) => ({
          appointments: s.appointments.map((a) => (a.id === id ? { ...a, ...data } : a)),
        })),
      cancelAppointment: (id) =>
        set((s) => ({
          appointments: s.appointments.map((a) =>
            a.id === id ? { ...a, status: 'cancelada' } : a
          ),
        })),
      removeAppointment: (id) =>
        set((s) => ({ appointments: s.appointments.filter((a) => a.id !== id) })),
      getAppointment: (id) => get().appointments.find((a) => a.id === id),
    }),
    { name: 'bola8-appointments', storage: createJSONStorage(() => AsyncStorage) }
  )
);

import { format } from 'date-fns';
import type { Appointment, BarberProfile, Client } from '@/types';

// "Today" — the seed appointments are placed on the current day so the
// dashboard's "Hoy · N citas" section is always populated on first launch.
export const TODAY_ISO = format(new Date(), 'yyyy-MM-dd');

export const seedClients: Client[] = [
  { id: 'c1', name: 'Carlos Méndez', phone: '+34 698 112 340', initials: 'CM', lastVisit: TODAY_ISO },
  { id: 'c2', name: 'Javier Ruiz', phone: '+34 622 908 145', initials: 'JR', lastVisit: '2026-06-08' },
  { id: 'c3', name: 'Andrés Soto', phone: '+34 611 234 567', initials: 'AS', lastVisit: '2026-06-02' },
  { id: 'c4', name: 'Diego Herrera', phone: '+34 677 451 098', initials: 'DH', lastVisit: '2026-05-28' },
  { id: 'c5', name: 'Roberto Vega', phone: '+34 612 345 678', initials: 'RV', lastVisit: '2026-05-21' },
  { id: 'c6', name: 'Marcos Torres', phone: '+34 654 770 219', initials: 'MT', lastVisit: '2026-05-19' },
];

export const seedAppointments: Appointment[] = [
  {
    id: 'a1',
    clientId: 'c1',
    service: 'Corte + Barba',
    date: TODAY_ISO,
    startTime: '09:00',
    durationMin: 45,
    status: 'confirmada',
    price: 28,
    notes: 'Prefiere degradado bajo. Cliente habitual desde 2021.',
  },
  {
    id: 'a2',
    clientId: 'c2',
    service: 'Corte',
    date: TODAY_ISO,
    startTime: '10:00',
    durationMin: 30,
    status: 'confirmada',
    price: 18,
    notes: 'Corte clásico.',
  },
  {
    id: 'a3',
    clientId: 'c3',
    service: 'Afeitado clásico',
    date: TODAY_ISO,
    startTime: '11:30',
    durationMin: 30,
    status: 'pendiente',
    price: 20,
  },
  {
    id: 'a4',
    clientId: 'c4',
    service: 'Corte + Barba',
    date: TODAY_ISO,
    startTime: '13:00',
    durationMin: 45,
    status: 'confirmada',
    price: 28,
  },
];

export const seedProfile: BarberProfile = {
  name: 'Héctor Gómez',
  role: 'Barbero · Propietario',
  phone: '+34 600 778 421',
  email: 'hector@bola8.es',
  location: 'C/ Mayor 14, Madrid',
  stats: { appointments: 1200, clients: 248, rating: 4.9 },
};

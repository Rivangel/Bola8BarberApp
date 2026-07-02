export type AppointmentStatus = 'confirmada' | 'pendiente' | 'cancelada';

export type ServiceName = 'Corte' | 'Barba' | 'Corte + Barba' | 'Afeitado clásico';

export type Appointment = {
  id: string;
  clientId: string;
  service: ServiceName;
  date: string; // ISO date (yyyy-MM-dd)
  startTime: string; // 'HH:mm'
  durationMin: number;
  status: AppointmentStatus;
  price: number;
  notes?: string;
};

export type Client = {
  id: string;
  name: string;
  phone: string;
  notes?: string; // preferencias / notas del barbero
  lastVisit?: string; // ISO date
  initials: string;
  photoUri?: string;
};

export type UserRole = 'ADMIN' | 'BARBERO';

// Usuario autenticado (sesión actual). Deriva del Usuario de la API.
export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type BarberProfile = {
  name: string;
  role: string;
  phone: string;
  email: string;
  location: string;
  photoUri?: string;
  stats: { appointments: number; clients: number; rating: number };
};

// Precio por servicio en pesos mexicanos (MXN), usado al crear una cita desde el formulario.
export const SERVICE_PRICE: Record<ServiceName, number> = {
  Corte: 120,
  Barba: 90,
  'Corte + Barba': 190,
  'Afeitado clásico': 110,
};

/** Formatea un importe en pesos mexicanos, p. ej. 1200 → "$1,200". */
export function formatMXN(amount: number): string {
  return `$${Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

export const SERVICES: ServiceName[] = [
  'Corte',
  'Barba',
  'Corte + Barba',
  'Afeitado clásico',
];

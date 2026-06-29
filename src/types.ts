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

export type BarberProfile = {
  name: string;
  role: string;
  phone: string;
  email: string;
  location: string;
  photoUri?: string;
  stats: { appointments: number; clients: number; rating: number };
};

// Default price per service (€) used when creating an appointment from the form.
export const SERVICE_PRICE: Record<ServiceName, number> = {
  Corte: 18,
  Barba: 14,
  'Corte + Barba': 28,
  'Afeitado clásico': 20,
};

export const SERVICES: ServiceName[] = [
  'Corte',
  'Barba',
  'Corte + Barba',
  'Afeitado clásico',
];

import {
  addDays,
  endOfWeek,
  format,
  parseISO,
  startOfWeek,
} from 'date-fns';
import { es } from 'date-fns/locale';

const opts = { locale: es } as const;

/** 'Lun', 'Mar'… (3-letter weekday, capitalised) */
export function shortWeekday(date: Date): string {
  const s = format(date, 'EEE', opts).replace('.', '');
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** 'L', 'M', 'X', 'J', 'V', 'S', 'D' — Spanish single-letter columns */
const SINGLE = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
export function singleWeekday(date: Date): string {
  // getDay: 0=Sun..6=Sat → map to Mon-first index
  const idx = (date.getDay() + 6) % 7;
  return SINGLE[idx];
}

/** '14 Jun' */
export function dayMonth(iso: string): string {
  return format(parseISO(iso), "d MMM", opts).replace('.', '');
}

/** 'Lunes, 10 Jun' */
export function longDate(iso: string): string {
  const s = format(parseISO(iso), "EEEE, d MMM", opts).replace('.', '');
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Monday-based start of the week containing `date`. */
export function weekStart(date: Date): Date {
  return startOfWeek(date, { weekStartsOn: 1 });
}

/** 'Semana del 10 — 15 Jun' for the week containing `date`. */
export function weekRangeLabel(date: Date): string {
  const start = weekStart(date);
  const end = endOfWeek(date, { weekStartsOn: 1 });
  // Saturday is the last working column in the design; show Mon–Sat
  const sat = addDays(start, 5);
  return `Semana del ${format(start, 'd', opts)} — ${format(sat, 'd MMM', opts).replace('.', '')}`;
}

/** Array of N days starting at `start`. */
export function daysFrom(start: Date, n: number): Date[] {
  return Array.from({ length: n }, (_, i) => addDays(start, i));
}

export function toISO(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/** Add minutes to an 'HH:mm' string, returning 'HH:mm'. */
export function addMinutesToTime(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + minutes;
  const hh = Math.floor((total % (24 * 60)) / 60);
  const mm = total % 60;
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

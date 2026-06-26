// Design tokens — Bola 8 Barbería (extracted from the imported design file)
// Dark theme only. No light mode.
export const colors = {
  background: '#0c0c0d',
  surface: '#16161a',
  surfaceDim: '#101013',
  border: '#26262c',
  borderDim: '#1c1c20',
  divider: '#222228',
  gold: '#c9a24b', // primary accent
  goldDim: '#c98f4b', // amber-gold (pendiente left border)
  textPrimary: '#f5f3ee',
  textSecondary: '#9a978f',
  textMuted: '#8a8780',
  textFaint: '#6b6960',
  textDisabled: '#4a4843',
  statusGreen: '#5fb87a',
  statusAmber: '#d8a24b',
  statusRed: '#d96b6b',
  navBg: '#0f0f11',
  navBorder: '#1f1f24',
  navInactive: '#6b6960',
  avatarBg: '#231d12', // dark amber avatar background
  // translucent fills used by the calendar / badges
  goldFill: 'rgba(201,162,75,.18)',
  goldFillStrong: 'rgba(201,162,75,.4)',
  goldBorder: 'rgba(201,162,75,.4)',
  greenFill: 'rgba(95,184,122,.16)',
  greenBorder: 'rgba(95,184,122,.38)',
  greenTint: 'rgba(95,184,122,.12)',
  greenTintBorder: 'rgba(95,184,122,.35)',
  amberTint: 'rgba(216,162,75,.16)',
  amberTintBorder: 'rgba(216,162,75,.38)',
  goldTint: 'rgba(201,162,75,.12)',
  goldTintBorder: 'rgba(201,162,75,.3)',
} as const;

export type StatusColorKey = 'confirmada' | 'pendiente' | 'cancelada';

// Status badge colours: dot/label colour + pill background + pill border
export const statusColors: Record<
  StatusColorKey,
  { color: string; bg: string; border: string; label: string }
> = {
  confirmada: {
    color: colors.statusGreen,
    bg: 'rgba(95,184,122,.12)',
    border: 'rgba(95,184,122,.35)',
    label: 'Confirmada',
  },
  pendiente: {
    color: colors.statusAmber,
    bg: 'rgba(216,162,75,.12)',
    border: 'rgba(216,162,75,.35)',
    label: 'Pendiente',
  },
  cancelada: {
    color: colors.statusRed,
    bg: 'rgba(217,107,107,.12)',
    border: 'rgba(217,107,107,.35)',
    label: 'Cancelada',
  },
};

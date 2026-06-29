import { create } from 'zustand';

/**
 * Notificaciones tipo "toast" globales. Se renderizan una sola vez en el layout
 * raíz (`<Toast />`), de modo que el aviso sobrevive a la navegación entre
 * pantallas (p. ej. crear una cita y volver al inicio).
 */

export type ToastVariant = 'success' | 'error';

type ToastState = {
  visible: boolean;
  message: string;
  variant: ToastVariant;
  /** Muestra un toast; por defecto de éxito. */
  show: (message: string, variant?: ToastVariant) => void;
  hide: () => void;
};

export const useToast = create<ToastState>((set) => ({
  visible: false,
  message: '',
  variant: 'success',
  show: (message, variant = 'success') => set({ visible: true, message, variant }),
  hide: () => set({ visible: false }),
}));

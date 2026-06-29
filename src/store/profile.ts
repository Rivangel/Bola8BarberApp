import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { authService } from '@/services/auth.service';
import { setAuthToken } from '@/services/http';
import type { BarberProfile, SessionUser } from '@/types';
import { seedProfile } from './seed';

type ProfileState = {
  profile: BarberProfile;
  /** Token JWT de la sesión (null si no hay sesión). */
  token: string | null;
  /** Usuario autenticado (null si no hay sesión). */
  usuario: SessionUser | null;
  isAuthenticated: boolean;
  updateProfile: (data: Partial<BarberProfile>) => void;
  setPhoto: (uri: string) => void;
  /** Inicia sesión contra la API. Lanza ApiError si las credenciales fallan. */
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: seedProfile,
      token: null,
      usuario: null,
      isAuthenticated: false,
      updateProfile: (data) => set((s) => ({ profile: { ...s.profile, ...data } })),
      setPhoto: (uri) => set((s) => ({ profile: { ...s.profile, photoUri: uri } })),
      login: async (email, password) => {
        const { token, user } = await authService.login(email, password);
        setAuthToken(token);
        set({ token, usuario: user, isAuthenticated: true });
      },
      logout: () => {
        setAuthToken(null);
        set({ token: null, usuario: null, isAuthenticated: false });
      },
    }),
    {
      name: 'bola8-profile',
      storage: createJSONStorage(() => AsyncStorage),
      // Persistimos el perfil editable y la sesión (token + usuario).
      partialize: (s) => ({ profile: s.profile, token: s.token, usuario: s.usuario }),
      // Al rehidratar desde AsyncStorage: reaplicar el token en axios y derivar
      // `isAuthenticated` de la presencia del token.
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        setAuthToken(state.token ?? null);
        state.isAuthenticated = !!state.token;
      },
    }
  )
);

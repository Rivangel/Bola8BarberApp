import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { BarberProfile } from '@/types';
import { seedProfile } from './seed';

type ProfileState = {
  profile: BarberProfile;
  isAuthenticated: boolean;
  updateProfile: (data: Partial<BarberProfile>) => void;
  setPhoto: (uri: string) => void;
  logout: () => void;
  login: () => void;
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: seedProfile,
      isAuthenticated: true,
      updateProfile: (data) => set((s) => ({ profile: { ...s.profile, ...data } })),
      setPhoto: (uri) => set((s) => ({ profile: { ...s.profile, photoUri: uri } })),
      logout: () => set({ isAuthenticated: false }),
      login: () => set({ isAuthenticated: true }),
    }),
    {
      name: 'bola8-profile',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ profile: s.profile }),
    }
  )
);

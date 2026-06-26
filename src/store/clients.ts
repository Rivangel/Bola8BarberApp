import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Client } from '@/types';
import { seedClients } from './seed';

function buildInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

type ClientsState = {
  clients: Client[];
  addClient: (data: { name: string; phone: string }) => Client;
  updateClient: (id: string, data: Partial<Client>) => void;
  getClient: (id: string) => Client | undefined;
  setLastVisit: (id: string, isoDate: string) => void;
};

export const useClientsStore = create<ClientsState>()(
  persist(
    (set, get) => ({
      clients: seedClients,
      addClient: ({ name, phone }) => {
        const client: Client = {
          id: `c_${Date.now()}`,
          name: name.trim(),
          phone: phone.trim(),
          initials: buildInitials(name),
        };
        set((s) => ({ clients: [client, ...s.clients] }));
        return client;
      },
      updateClient: (id, data) =>
        set((s) => ({
          clients: s.clients.map((c) =>
            c.id === id
              ? { ...c, ...data, initials: data.name ? buildInitials(data.name) : c.initials }
              : c
          ),
        })),
      getClient: (id) => get().clients.find((c) => c.id === id),
      setLastVisit: (id, isoDate) =>
        set((s) => ({
          clients: s.clients.map((c) => (c.id === id ? { ...c, lastVisit: isoDate } : c)),
        })),
    }),
    { name: 'bola8-clients', storage: createJSONStorage(() => AsyncStorage) }
  )
);

export { buildInitials };

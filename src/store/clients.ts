import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { ApiError, clientesService } from '@/services';
import type { Client } from '@/types';

function buildInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

type ClientsState = {
  clients: Client[];
  loading: boolean;
  error?: string;
  /** Carga la lista de clientes desde la API (GET /api/clientes). */
  loadClients: () => Promise<void>;
  /**
   * Alta local optimista. La API aún no expone creación directa de clientes
   * (se crean al agendar una cita con teléfono + nombre), por lo que esta alta
   * vive localmente hasta que el cliente tenga su primera cita.
   */
  addClient: (data: { name: string; phone: string }) => Client;
  /** Actualiza un cliente vía API (PUT /clientes/:id). Los clientes locales
   *  aún no sincronizados (id "c_…") se actualizan solo en memoria. */
  updateClient: (id: string, data: Partial<Client>) => Promise<void>;
  getClient: (id: string) => Client | undefined;
  setLastVisit: (id: string, isoDate: string) => void;
};

export const useClientsStore = create<ClientsState>()(
  persist(
    (set, get) => ({
      clients: [],
      loading: false,
      error: undefined,
      loadClients: async () => {
        set({ loading: true, error: undefined });
        try {
          const remoto = await clientesService.list();
          // Conservamos los clientes locales aún no sincronizados (ids con prefijo "c_").
          const locales = get().clients.filter((c) => c.id.startsWith('c_'));
          set({ clients: [...remoto, ...locales], loading: false });
        } catch (e) {
          const msg = e instanceof ApiError ? e.message : 'No se pudieron cargar los clientes.';
          set({ loading: false, error: msg });
        }
      },
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
      updateClient: async (id, data) => {
        // Cliente local aún no sincronizado: solo en memoria.
        if (id.startsWith('c_')) {
          set((s) => ({
            clients: s.clients.map((c) =>
              c.id === id
                ? { ...c, ...data, initials: data.name ? buildInitials(data.name) : c.initials }
                : c
            ),
          }));
          return;
        }
        const actualizado = await clientesService.update(id, {
          name: data.name,
          phone: data.phone,
          notes: data.notes,
        });
        set((s) => ({
          clients: s.clients.map((c) => (c.id === id ? { ...c, ...actualizado } : c)),
        }));
      },
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

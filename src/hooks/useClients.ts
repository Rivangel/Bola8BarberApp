import { useMemo } from 'react';
import { useClientsStore } from '@/store/clients';

/** Clients filtered by a search query (name or phone), alphabetically. */
export function useClients(query = '') {
  const clients = useClientsStore((s) => s.clients);

  return useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? clients.filter(
          (c) => c.name.toLowerCase().includes(q) || c.phone.replace(/\s/g, '').includes(q.replace(/\s/g, ''))
        )
      : clients;
    return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  }, [clients, query]);
}

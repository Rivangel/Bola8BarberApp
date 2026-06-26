import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ClientRow } from '@/components/ClientRow';
import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { colors } from '@/constants/colors';
import { fonts, radius } from '@/constants/typography';
import { useClients } from '@/hooks/useClients';
import { useClientsStore } from '@/store/clients';

export default function ClientesScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const clients = useClients(query);
  const total = useClientsStore((s) => s.clients.length);
  const addClient = useClientsStore((s) => s.addClient);

  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const submitAdd = () => {
    if (!newName.trim()) return;
    addClient({ name: newName, phone: newPhone });
    setNewName('');
    setNewPhone('');
    setShowAdd(false);
  };

  return (
    <Screen>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Clientes</Text>
          <Text style={styles.subtitle}>{total} clientes registrados</Text>
        </View>
        <Pressable style={styles.addBtn} onPress={() => setShowAdd(true)}>
          <Icon name="plus" size={20} color={colors.background} strokeWidth={2.5} />
        </Pressable>
      </View>

      <View style={styles.search}>
        <Icon name="search" size={18} color={colors.textFaint} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar cliente…"
          placeholderTextColor={colors.textFaint}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        {clients.length === 0 ? (
          <Text style={styles.empty}>No se encontraron clientes.</Text>
        ) : (
          clients.map((c) => (
            <ClientRow key={c.id} client={c} onPress={() => router.push(`/cliente/${c.id}`)} />
          ))
        )}
      </ScrollView>

      <Modal visible={showAdd} transparent animationType="fade" onRequestClose={() => setShowAdd(false)}>
        <Pressable style={styles.backdrop} onPress={() => setShowAdd(false)}>
          <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Nuevo cliente</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Nombre completo"
              placeholderTextColor={colors.textFaint}
              value={newName}
              onChangeText={setNewName}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Teléfono"
              placeholderTextColor={colors.textFaint}
              keyboardType="phone-pad"
              value={newPhone}
              onChangeText={setNewPhone}
            />
            <Pressable style={[styles.modalCta, !newName.trim() && styles.modalCtaDisabled]} disabled={!newName.trim()} onPress={submitAdd}>
              <Text style={styles.modalCtaText}>Añadir cliente</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 14,
    paddingBottom: 16,
  },
  title: { fontFamily: fonts.oswaldSemiBold, fontSize: 24, color: colors.textPrimary, lineHeight: 24 },
  subtitle: { fontFamily: fonts.manrope, fontSize: 12, color: colors.textMuted, marginTop: 4 },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  search: {
    height: 48,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.input,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 11,
    marginBottom: 20,
  },
  searchInput: { flex: 1, fontFamily: fonts.manrope, fontSize: 14, color: colors.textPrimary },
  list: { gap: 10, paddingBottom: 24 },
  empty: { fontFamily: fonts.manrope, fontSize: 13, color: colors.textMuted, paddingVertical: 30, textAlign: 'center' },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,.6)', justifyContent: 'center', paddingHorizontal: 30 },
  modalCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.cardLg, padding: 20, gap: 12 },
  modalTitle: { fontFamily: fonts.oswaldSemiBold, fontSize: 20, color: colors.textPrimary, marginBottom: 4 },
  modalInput: {
    height: 50,
    backgroundColor: colors.surfaceDim,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.input,
    paddingHorizontal: 16,
    fontFamily: fonts.manropeSemiBold,
    fontSize: 15,
    color: colors.textPrimary,
  },
  modalCta: {
    height: 50,
    borderRadius: radius.button,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  modalCtaDisabled: { opacity: 0.5 },
  modalCtaText: { fontFamily: fonts.manropeExtraBold, fontSize: 15, color: colors.background },
});

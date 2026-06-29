import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Avatar } from '@/components/Avatar';
import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { StatusBadge } from '@/components/StatusBadge';
import { colors } from '@/constants/colors';
import { fonts, radius } from '@/constants/typography';
import { clientesService } from '@/services';
import { useClientsStore } from '@/store/clients';
import type { Appointment } from '@/types';
import { longDate } from '@/utils/dates';

export default function ClienteDetalleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const client = useClientsStore((s) => s.clients.find((c) => c.id === id));
  const updateClient = useClientsStore((s) => s.updateClient);

  // Historial de citas del cliente, obtenido de la API por teléfono.
  const [history, setHistory] = useState<Appointment[]>([]);

  // Edición de datos del cliente (nombre, teléfono, notas).
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const startEdit = () => {
    if (!client) return;
    setName(client.name);
    setPhone(client.phone);
    setNotes(client.notes ?? '');
    setEditing(true);
  };

  const save = async () => {
    if (!client || saving) return;
    if (!name.trim()) {
      Alert.alert('Nombre requerido', 'Escribe el nombre del cliente.');
      return;
    }
    setSaving(true);
    try {
      await updateClient(client.id, {
        name: name.trim(),
        phone: phone.trim(),
        notes: notes.trim(),
      });
      setEditing(false);
    } catch (e) {
      Alert.alert('No se pudo guardar', e instanceof Error ? e.message : 'Inténtalo de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (!client?.phone) return;
    let activo = true;
    clientesService
      .historial(client.phone)
      .then((citas) => {
        if (activo) setHistory(citas);
      })
      .catch(() => {
        if (activo) setHistory([]);
      });
    return () => {
      activo = false;
    };
  }, [client?.phone]);

  if (!client) {
    return (
      <Screen>
        <Text style={styles.notFound}>Cliente no encontrado.</Text>
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Icon name="chevron-left" size={16} color={colors.textPrimary} strokeWidth={2.5} />
          </Pressable>
          <Text style={styles.title}>Cliente</Text>
        </View>
        <Pressable style={styles.editToggle} onPress={editing ? save : startEdit} disabled={saving}>
          <Icon name={editing ? 'check' : 'edit'} size={15} color={colors.gold} strokeWidth={2.3} />
          <Text style={styles.editToggleText}>{editing ? 'Guardar' : 'Editar'}</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.clientSection}>
          <Avatar initials={client.initials} size={84} tone="dark" fontSize={30} photoUri={client.photoUri} />
          {editing ? (
            <>
              <TextInput
                style={styles.nameInput}
                value={name}
                onChangeText={setName}
                placeholder="Nombre del cliente"
                placeholderTextColor={colors.textFaint}
              />
              <TextInput
                style={styles.phoneInput}
                value={phone}
                onChangeText={setPhone}
                placeholder="Teléfono"
                placeholderTextColor={colors.textFaint}
                keyboardType="phone-pad"
              />
            </>
          ) : (
            <>
              <Text style={styles.clientName}>{client.name}</Text>
              <View style={styles.phoneRow}>
                <Icon name="phone" size={14} color={colors.textMuted} />
                <Text style={styles.phoneText}>{client.phone}</Text>
              </View>
            </>
          )}
        </View>

        {editing ? (
          <View style={styles.notesCard}>
            <Text style={styles.notesLabel}>Notas</Text>
            <TextInput
              style={styles.notesInput}
              value={notes}
              onChangeText={setNotes}
              multiline
              placeholder="Preferencias, alergias, lo que el barbero deba saber…"
              placeholderTextColor={colors.textFaint}
            />
          </View>
        ) : client.notes ? (
          <View style={styles.notesCard}>
            <Text style={styles.notesLabel}>Notas</Text>
            <Text style={styles.notesText}>{client.notes}</Text>
          </View>
        ) : null}

        <Text style={styles.sectionLabel}>Historial de citas · {history.length}</Text>
        <View style={{ gap: 10 }}>
          {history.length === 0 ? (
            <Text style={styles.empty}>Sin citas registradas.</Text>
          ) : (
            history.map((a) => (
              <Pressable key={a.id} style={styles.historyRow} onPress={() => router.push(`/cita/${a.id}`)}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.historyService}>{a.service}</Text>
                  <Text style={styles.historyDate}>
                    {longDate(a.date)} · {a.startTime}
                  </Text>
                </View>
                <View style={styles.historyRight}>
                  <Text style={styles.historyPrice}>{a.price} €</Text>
                  <StatusBadge status={a.status} />
                </View>
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 22, paddingTop: 14, paddingBottom: 18 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  editToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  editToggleText: { fontFamily: fonts.manropeBold, fontSize: 13, color: colors.gold },
  nameInput: {
    fontFamily: fonts.oswaldSemiBold,
    fontSize: 22,
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: 14,
    minWidth: 220,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 4,
  },
  phoneInput: {
    fontFamily: fonts.manrope,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 10,
    minWidth: 180,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 4,
  },
  notesInput: {
    fontFamily: fonts.manrope,
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
    minHeight: 70,
    textAlignVertical: 'top',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontFamily: fonts.oswaldSemiBold, fontSize: 22, color: colors.textPrimary },
  scroll: { paddingHorizontal: 22, paddingBottom: 24 },
  clientSection: { alignItems: 'center', paddingVertical: 22 },
  clientName: { fontFamily: fonts.oswaldSemiBold, fontSize: 24, color: colors.textPrimary, marginTop: 14 },
  phoneRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 6 },
  phoneText: { fontFamily: fonts.manrope, fontSize: 13, color: colors.textSecondary },
  sectionLabel: {
    fontFamily: fonts.manropeBold,
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.textMuted,
    marginBottom: 12,
  },
  notesCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: radius.card,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  notesLabel: {
    fontFamily: fonts.manropeBold,
    fontSize: 10,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.gold,
    marginBottom: 6,
  },
  notesText: { fontFamily: fonts.manrope, fontSize: 14, color: colors.textPrimary, lineHeight: 20 },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  historyService: { fontFamily: fonts.manropeBold, fontSize: 15, color: colors.textPrimary },
  historyDate: { fontFamily: fonts.manrope, fontSize: 12, color: colors.textMuted, marginTop: 3 },
  historyRight: { alignItems: 'flex-end', gap: 6 },
  historyPrice: { fontFamily: fonts.oswaldSemiBold, fontSize: 16, color: colors.gold },
  empty: { fontFamily: fonts.manrope, fontSize: 13, color: colors.textMuted, textAlign: 'center', paddingVertical: 20 },
  notFound: { fontFamily: fonts.manrope, fontSize: 14, color: colors.textMuted, textAlign: 'center', marginTop: 40 },
});

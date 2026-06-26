import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Avatar } from '@/components/Avatar';
import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { StatusBadge } from '@/components/StatusBadge';
import { colors } from '@/constants/colors';
import { fonts, radius } from '@/constants/typography';
import { useAppointmentsStore } from '@/store/appointments';
import { useClientsStore } from '@/store/clients';
import { longDate } from '@/utils/dates';

export default function ClienteDetalleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const client = useClientsStore((s) => s.clients.find((c) => c.id === id));
  const appointments = useAppointmentsStore((s) => s.appointments);

  const history = useMemo(
    () =>
      appointments
        .filter((a) => a.clientId === id)
        .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.startTime.localeCompare(a.startTime))),
    [appointments, id]
  );

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
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Icon name="chevron-left" size={16} color={colors.textPrimary} strokeWidth={2.5} />
        </Pressable>
        <Text style={styles.title}>Cliente</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.clientSection}>
          <Avatar initials={client.initials} size={84} tone="dark" fontSize={30} photoUri={client.photoUri} />
          <Text style={styles.clientName}>{client.name}</Text>
          <View style={styles.phoneRow}>
            <Icon name="phone" size={14} color={colors.textMuted} />
            <Text style={styles.phoneText}>{client.phone}</Text>
          </View>
        </View>

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
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 22, paddingTop: 14, paddingBottom: 18 },
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

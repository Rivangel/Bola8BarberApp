import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppointmentCard } from '@/components/AppointmentCard';
import { DateStrip } from '@/components/DateStrip';
import { Icon } from '@/components/Icon';
import { Logo } from '@/components/Logo';
import { Screen } from '@/components/Screen';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/typography';
import { useAppointments } from '@/hooks/useAppointments';
import { daysFrom, toISO, weekStart } from '@/utils/dates';

export default function InicioScreen() {
  const router = useRouter();
  const { byDate } = useAppointments();

  const todayISO = toISO(new Date());
  const weekDays = useMemo(() => daysFrom(weekStart(new Date()), 5), []); // Mon–Fri
  const [selected, setSelected] = useState(
    weekDays.some((d) => toISO(d) === todayISO) ? todayISO : toISO(weekDays[0])
  );

  const dayAppointments = byDate(selected).filter((a) => a.status !== 'cancelada');

  return (
    <Screen>
      <View style={styles.header}>
        <Logo />
        <Pressable style={styles.iconBtn}>
          <Icon name="bell" size={20} color={colors.gold} />
        </Pressable>
      </View>

      <DateStrip days={weekDays} selected={selected} onSelect={setSelected} />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Hoy <Text style={styles.sectionCount}>· {dayAppointments.length} citas</Text>
        </Text>
        <Pressable onPress={() => router.push('/calendario')}>
          <Text style={styles.link}>Ver todo</Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {dayAppointments.length === 0 ? (
          <Text style={styles.empty}>No hay citas para este día.</Text>
        ) : (
          dayAppointments.map((appt, i) => (
            <AppointmentCard
              key={appt.id}
              appointment={appt}
              index={i}
              onPress={() => router.push(`/cita/${appt.id}`)}
            />
          ))
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 14,
    paddingBottom: 18,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: 22,
    marginBottom: 14,
  },
  sectionTitle: { fontFamily: fonts.oswaldSemiBold, fontSize: 22, letterSpacing: 0.5, color: colors.textPrimary },
  sectionCount: { fontFamily: fonts.manropeMedium, fontSize: 14, color: colors.textMuted },
  link: { fontFamily: fonts.manropeSemiBold, fontSize: 12, color: colors.gold },
  list: { gap: 12, paddingBottom: 24 },
  empty: { fontFamily: fonts.manrope, fontSize: 13, color: colors.textMuted, paddingVertical: 30, textAlign: 'center' },
});

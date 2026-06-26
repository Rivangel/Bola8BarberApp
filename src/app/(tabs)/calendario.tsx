import { addDays } from 'date-fns';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { colors } from '@/constants/colors';
import { fonts, radius } from '@/constants/typography';
import { useAppointments } from '@/hooks/useAppointments';
import { daysFrom, singleWeekday, toISO, weekRangeLabel, weekStart } from '@/utils/dates';

const HOURS = [9, 10, 11, 12, 13, 14];
const HOUR_HEIGHT = 64;
const START_HOUR = 9;

function topFor(startTime: string): number {
  const [h, m] = startTime.split(':').map(Number);
  return (h - START_HOUR + m / 60) * HOUR_HEIGHT;
}
function heightFor(durationMin: number): number {
  return Math.max(22, (durationMin / 60) * HOUR_HEIGHT - 4);
}

export default function CalendarioScreen() {
  const router = useRouter();
  const { all } = useAppointments();
  const [anchor, setAnchor] = useState(() => weekStart(new Date()));

  const days = useMemo(() => daysFrom(anchor, 6), [anchor]); // Mon–Sat
  const todayISO = toISO(new Date());

  const byDayISO = useMemo(() => {
    const map = new Map<string, typeof all>();
    for (const d of days) map.set(toISO(d), []);
    for (const a of all) {
      if (a.status === 'cancelada') continue;
      const list = map.get(a.date);
      if (list) list.push(a);
    }
    return map;
  }, [all, days]);

  return (
    <Screen>
      {/* header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Calendario</Text>
          <Text style={styles.subtitle}>{weekRangeLabel(anchor)}</Text>
        </View>
        <View style={styles.navBtns}>
          <Pressable style={styles.navBtn} onPress={() => setAnchor(addDays(anchor, -7))}>
            <Icon name="chevron-left" size={16} color={colors.textSecondary} strokeWidth={2.5} />
          </Pressable>
          <Pressable style={styles.navBtn} onPress={() => setAnchor(addDays(anchor, 7))}>
            <Icon name="chevron-right" size={16} color={colors.textSecondary} strokeWidth={2.5} />
          </Pressable>
        </View>
      </View>

      {/* weekday header row */}
      <View style={styles.weekRow}>
        <View style={styles.gutter} />
        {days.map((d) => {
          const active = toISO(d) === todayISO;
          return (
            <View key={toISO(d)} style={styles.weekCol}>
              <Text style={[styles.weekLetter, active && styles.activeText]}>{singleWeekday(d)}</Text>
              <Text style={[styles.weekNum, active && styles.activeText]}>{d.getDate()}</Text>
            </View>
          );
        })}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        {/* time grid */}
        <View style={styles.grid}>
          {/* hours gutter */}
          <View style={styles.gutter}>
            {HOURS.map((h) => (
              <View key={h} style={{ height: HOUR_HEIGHT }}>
                <Text style={styles.hourText}>{String(h).padStart(2, '0')}</Text>
              </View>
            ))}
          </View>

          {/* day columns */}
          {days.map((d) => {
            const iso = toISO(d);
            const active = iso === todayISO;
            const appts = byDayISO.get(iso) ?? [];
            return (
              <View
                key={iso}
                style={[styles.dayColumn, active && styles.dayColumnActive, { height: HOURS.length * HOUR_HEIGHT }]}
              >
                {appts.map((a) => {
                  const confirmed = a.status === 'confirmada';
                  return (
                    <Pressable
                      key={a.id}
                      onPress={() => router.push(`/cita/${a.id}`)}
                      style={[
                        styles.block,
                        {
                          top: topFor(a.startTime) + 4,
                          height: heightFor(a.durationMin),
                          backgroundColor: confirmed ? colors.goldFill : colors.greenFill,
                          borderColor: confirmed ? colors.goldFillStrong : colors.greenBorder,
                        },
                      ]}
                    />
                  );
                })}
              </View>
            );
          })}
        </View>

        {/* legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendChip, { backgroundColor: colors.gold }]} />
            <Text style={styles.legendText}>Confirmada</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendChip, { backgroundColor: 'rgba(95,184,122,.5)' }]} />
            <Text style={styles.legendText}>Pendiente</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendChip, { backgroundColor: colors.navBorder }]} />
            <Text style={styles.legendText}>Libre</Text>
          </View>
        </View>
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
    paddingBottom: 16,
  },
  title: { fontFamily: fonts.oswaldSemiBold, fontSize: 24, color: colors.textPrimary, lineHeight: 24 },
  subtitle: { fontFamily: fonts.manrope, fontSize: 12, color: colors.textMuted, marginTop: 4 },
  navBtns: { flexDirection: 'row', gap: 8 },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekRow: { flexDirection: 'row', gap: 5, marginBottom: 6 },
  gutter: { width: 30 },
  weekCol: { flex: 1, alignItems: 'center' },
  weekLetter: { fontFamily: fonts.manropeBold, fontSize: 10, color: colors.textMuted },
  weekNum: { fontFamily: fonts.oswald, fontSize: 14, color: colors.textPrimary },
  activeText: { color: colors.gold },
  grid: { flexDirection: 'row', gap: 5 },
  hourText: { fontFamily: fonts.oswald, fontSize: 11, color: colors.textFaint, paddingTop: 4 },
  dayColumn: {
    flex: 1,
    backgroundColor: colors.surfaceDim,
    borderRadius: 10,
    position: 'relative',
  },
  dayColumnActive: { backgroundColor: colors.goldTint, borderWidth: 1, borderColor: colors.goldTintBorder },
  block: {
    position: 'absolute',
    left: 4,
    right: 4,
    borderRadius: 7,
    borderWidth: 1,
  },
  legend: {
    flexDirection: 'row',
    gap: 18,
    marginTop: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  legendChip: { width: 10, height: 10, borderRadius: 3 },
  legendText: { fontFamily: fonts.manrope, fontSize: 11, color: colors.textSecondary },
});

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/colors';
import { fonts, radius } from '@/constants/typography';
import { shortWeekday, toISO } from '@/utils/dates';

type Props = {
  days: Date[];
  selected: string; // ISO
  onSelect: (iso: string) => void;
};

export function DateStrip({ days, selected, onSelect }: Props) {
  return (
    <View style={styles.strip}>
      {days.map((d) => {
        const iso = toISO(d);
        const active = iso === selected;
        return (
          <Pressable
            key={iso}
            onPress={() => onSelect(iso)}
            style={[styles.cell, active ? styles.cellActive : styles.cellIdle]}
          >
            <Text style={[styles.weekday, active ? styles.weekdayActive : styles.weekdayIdle]}>
              {shortWeekday(d)}
            </Text>
            <Text style={[styles.day, active ? styles.dayActive : styles.dayIdle]}>
              {d.getDate()}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  strip: { flexDirection: 'row', gap: 9 },
  cell: {
    flex: 1,
    height: 64,
    borderRadius: radius.cardLg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  cellActive: { backgroundColor: colors.gold },
  cellIdle: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  weekday: {
    fontFamily: fonts.manropeBold,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  weekdayActive: { color: colors.background },
  weekdayIdle: { color: colors.textMuted },
  day: { fontFamily: fonts.oswaldSemiBold, fontSize: 21 },
  dayActive: { color: colors.background, fontFamily: fonts.oswaldBold },
  dayIdle: { color: colors.textPrimary },
});

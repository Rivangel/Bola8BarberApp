import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { statusColors } from '@/constants/colors';
import { fonts } from '@/constants/typography';
import type { AppointmentStatus } from '@/types';

type Props = {
  status: AppointmentStatus;
  /** 'pill' = bordered pill with bg tint (headers) · 'inline' = dot + label (cards) */
  variant?: 'pill' | 'inline';
};

export function StatusBadge({ status, variant = 'inline' }: Props) {
  const s = statusColors[status];

  if (variant === 'pill') {
    return (
      <View style={[styles.pill, { backgroundColor: s.bg, borderColor: s.border }]}>
        <View style={[styles.dot, { backgroundColor: s.color }]} />
        <Text style={[styles.pillLabel, { color: s.color }]}>{s.label}</Text>
      </View>
    );
  }

  return (
    <View style={styles.inline}>
      <View style={[styles.dotSm, { backgroundColor: s.color }]} />
      <Text style={[styles.inlineLabel, { color: s.color }]}>{s.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderRadius: 20,
    borderWidth: 1,
  },
  dot: { width: 7, height: 7, borderRadius: 4 },
  pillLabel: { fontFamily: fonts.manropeBold, fontSize: 12 },
  inline: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dotSm: { width: 6, height: 6, borderRadius: 3 },
  inlineLabel: { fontFamily: fonts.manropeSemiBold, fontSize: 10 },
});

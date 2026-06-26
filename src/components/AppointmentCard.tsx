import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/colors';
import { fonts, radius } from '@/constants/typography';
import type { AppointmentWithClient } from '@/hooks/useAppointments';
import { StatusBadge } from './StatusBadge';

type Props = {
  appointment: AppointmentWithClient;
  index?: number;
  onPress?: () => void;
};

const leftBorderByStatus = {
  confirmada: colors.gold,
  pendiente: colors.goldDim,
  cancelada: colors.statusRed,
} as const;

export function AppointmentCard({ appointment, index = 0, onPress }: Props) {
  // subtle fade + rise on list mount, staggered by index
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 320,
      delay: index * 70,
      useNativeDriver: true,
    }).start();
  }, [anim, index]);

  const animatedStyle = {
    opacity: anim,
    transform: [
      { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) },
    ],
  };

  return (
    <Animated.View style={[styles.row, animatedStyle]}>
      <View style={styles.timeCol}>
        <Text style={styles.time}>{appointment.startTime}</Text>
        <Text style={styles.duration}>{appointment.durationMin} min</Text>
      </View>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          { borderLeftColor: leftBorderByStatus[appointment.status] },
          pressed && styles.pressed,
        ]}
      >
        <View style={styles.cardTop}>
          <Text style={styles.name} numberOfLines={1}>
            {appointment.client?.name ?? 'Cliente'}
          </Text>
          <StatusBadge status={appointment.status} />
        </View>
        <Text style={styles.service}>{appointment.service}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12 },
  timeCol: { width: 46, alignItems: 'flex-end', paddingTop: 14 },
  time: { fontFamily: fonts.oswaldSemiBold, fontSize: 15, color: colors.textPrimary },
  duration: { fontFamily: fonts.manrope, fontSize: 10, color: colors.textFaint },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 3,
    borderRadius: radius.card,
    paddingVertical: 13,
    paddingHorizontal: 15,
  },
  pressed: { opacity: 0.7 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  name: { flex: 1, fontFamily: fonts.manropeBold, fontSize: 15, color: colors.textPrimary, marginRight: 8 },
  service: { fontFamily: fonts.manrope, fontSize: 12, color: colors.textSecondary, marginTop: 4 },
});

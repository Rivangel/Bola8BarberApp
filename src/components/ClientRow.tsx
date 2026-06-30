import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/colors';
import { fonts, radius } from '@/constants/typography';
import type { Client } from '@/types';
import { dayMonth } from '@/utils/dates';
import { Avatar } from './Avatar';

type Props = {
  client: Client;
  index?: number;
  onPress?: () => void;
};

export function ClientRow({ client, index = 0, onPress }: Props) {
  // fade + rise escalonado al montar la lista (igual que AppointmentCard)
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 320,
      delay: Math.min(index, 8) * 55,
      useNativeDriver: true,
    }).start();
  }, [anim, index]);

  const animatedStyle = {
    opacity: anim,
    transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }],
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      >
        <Avatar initials={client.initials} photoUri={client.photoUri} size={46} />
        <View style={styles.middle}>
          <Text style={styles.name} numberOfLines={1}>
            {client.name}
          </Text>
          <Text style={styles.phone}>{client.phone}</Text>
        </View>
        <View style={styles.right}>
          <Text style={styles.lastLabel}>Última visita</Text>
          <Text style={styles.lastValue}>{client.lastVisit ? dayMonth(client.lastVisit) : '—'}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
  },
  pressed: { opacity: 0.7 },
  middle: { flex: 1, minWidth: 0 },
  name: { fontFamily: fonts.manropeBold, fontSize: 15, color: colors.textPrimary },
  phone: { fontFamily: fonts.manrope, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  right: { alignItems: 'flex-end' },
  lastLabel: { fontFamily: fonts.manrope, fontSize: 10, color: colors.textFaint },
  lastValue: { fontFamily: fonts.manropeSemiBold, fontSize: 12, color: colors.textSecondary, marginTop: 2 },
});

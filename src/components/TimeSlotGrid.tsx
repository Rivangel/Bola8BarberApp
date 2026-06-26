import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/colors';
import { fonts, radius } from '@/constants/typography';

export type TimeSlot = { time: string; booked?: boolean };

type Props = {
  slots: TimeSlot[];
  value: string | null;
  onChange: (time: string) => void;
};

// 4-column grid of time-slot chips.
export function TimeSlotGrid({ slots, value, onChange }: Props) {
  return (
    <View style={styles.grid}>
      {slots.map((slot) => {
        const selected = value === slot.time;
        if (slot.booked) {
          return (
            <View key={slot.time} style={[styles.slot, styles.booked]}>
              <Text style={styles.bookedText}>{slot.time}</Text>
            </View>
          );
        }
        return (
          <Pressable
            key={slot.time}
            onPress={() => onChange(slot.time)}
            style={[styles.slot, selected ? styles.selected : styles.available]}
          >
            <Text style={selected ? styles.selectedText : styles.availableText}>{slot.time}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  slot: {
    // 4 columns with 8px gaps
    width: '22.6%',
    height: 40,
    borderRadius: radius.cardSm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  available: { backgroundColor: colors.surface, borderColor: colors.border },
  selected: { backgroundColor: colors.gold, borderColor: colors.gold },
  booked: { backgroundColor: colors.surfaceDim, borderColor: colors.borderDim },
  availableText: { fontFamily: fonts.oswald, fontSize: 14, color: colors.textSecondary },
  selectedText: { fontFamily: fonts.oswaldSemiBold, fontSize: 14, color: colors.background },
  bookedText: {
    fontFamily: fonts.oswald,
    fontSize: 14,
    color: colors.textDisabled,
    textDecorationLine: 'line-through',
  },
});

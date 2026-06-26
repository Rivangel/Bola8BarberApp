import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/colors';
import { fonts, radius } from '@/constants/typography';
import { SERVICES, type ServiceName } from '@/types';

type Props = {
  value: ServiceName | null;
  onChange: (service: ServiceName) => void;
};

export function ServiceChips({ value, onChange }: Props) {
  return (
    <View style={styles.wrap}>
      {SERVICES.map((service) => {
        const selected = value === service;
        return (
          <Pressable
            key={service}
            onPress={() => onChange(service)}
            style={[styles.chip, selected ? styles.chipSelected : styles.chipIdle]}
          >
            <Text style={selected ? styles.textSelected : styles.textIdle}>{service}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingVertical: 9,
    paddingHorizontal: 15,
    borderRadius: radius.chip,
    borderWidth: 1,
  },
  chipIdle: { backgroundColor: colors.surface, borderColor: colors.border },
  chipSelected: { backgroundColor: colors.gold, borderColor: colors.gold },
  textIdle: { fontFamily: fonts.manropeSemiBold, fontSize: 13, color: colors.textSecondary },
  textSelected: { fontFamily: fonts.manropeBold, fontSize: 13, color: colors.background },
});

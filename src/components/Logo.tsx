import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/typography';

// Bola 8 brand lockup: gold-ringed circle with an "8" + BOLA 8 / BARBERÍA.
export function Logo() {
  return (
    <View style={styles.wrap}>
      <View style={styles.circle}>
        <View style={styles.ball}>
          <Text style={styles.ballText}>8</Text>
        </View>
      </View>
      <View>
        <Text style={styles.brand}>BOLA 8</Text>
        <Text style={styles.sub}>BARBERÍA</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  circle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ball: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ballText: { fontFamily: fonts.oswaldBold, fontSize: 12, color: colors.background },
  brand: {
    fontFamily: fonts.oswaldBold,
    fontSize: 19,
    letterSpacing: 1.5,
    color: colors.textPrimary,
    lineHeight: 19,
  },
  sub: {
    fontFamily: fonts.manrope,
    fontSize: 10,
    letterSpacing: 3,
    color: colors.gold,
    marginTop: 2,
  },
});

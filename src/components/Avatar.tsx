import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/typography';

type Props = {
  initials: string;
  size?: number;
  photoUri?: string;
  /** dark-amber fill (list rows) vs. gradient-like dark fill (detail/profile) */
  tone?: 'amber' | 'dark';
  fontSize?: number;
};

export function Avatar({ initials, size = 46, photoUri, tone = 'amber', fontSize }: Props) {
  const ratio = size / 46;
  return (
    <View
      style={[
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: tone === 'amber' ? colors.avatarBg : '#1a1a1f',
          borderWidth: tone === 'amber' ? 1 : 2,
        },
      ]}
    >
      {photoUri ? (
        <Image source={{ uri: photoUri }} style={{ width: size, height: size, borderRadius: size / 2 }} />
      ) : (
        <Text style={[styles.initials, { fontSize: fontSize ?? Math.round(17 * ratio) }]}>
          {initials}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.gold,
    overflow: 'hidden',
  },
  initials: { fontFamily: fonts.oswaldSemiBold, color: colors.gold },
});

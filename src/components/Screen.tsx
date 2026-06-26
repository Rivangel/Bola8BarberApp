import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
  /** horizontal screen padding (design uses 22) */
  padded?: boolean;
};

export function Screen({ children, style, padded = true }: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={[styles.inner, padded && styles.padded, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  inner: { flex: 1 },
  padded: { paddingHorizontal: 22 },
});

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { fonts, radius } from '@/constants/typography';
import { useProfileStore } from '@/store/profile';
import { Logo } from './Logo';

// Minimal sign-in gate shown after "Cerrar sesión".
export function Login() {
  const login = useProfileStore((s) => s.login);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>
        <Logo />
        <Text style={styles.tagline}>Gestión de citas</Text>
      </View>
      <View style={styles.bottom}>
        <Pressable style={styles.cta} onPress={login}>
          <Text style={styles.ctaText}>Iniciar sesión</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 22 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  tagline: { fontFamily: fonts.manrope, fontSize: 14, color: colors.textMuted, letterSpacing: 1 },
  bottom: { paddingBottom: 24 },
  cta: {
    height: 54,
    borderRadius: radius.button,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: { fontFamily: fonts.manropeExtraBold, fontSize: 16, color: colors.background },
});

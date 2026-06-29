import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Modal, Platform, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/typography';

/**
 * Loader de marca Bola 8: la bola 8 "rueda" de lado a lado sobre una sombra,
 * como sobre el paño de billar. Overlay a pantalla completa (fondo oscuro,
 * acento dorado). Se usa al iniciar y cerrar sesión.
 */

const TRAVEL = 64; // desplazamiento horizontal a cada lado del centro (px)
const USE_NATIVE = Platform.OS !== 'web';

export function BrandLoader({ visible, label }: { visible: boolean; label?: string }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;
    progress.setValue(0);
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1,
          duration: 850,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: USE_NATIVE,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: 850,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: USE_NATIVE,
        }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [visible, progress]);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-TRAVEL, TRAVEL],
  });
  // La rotación va ligada a la posición → al ir y volver, rueda en ambos sentidos.
  const rotate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '540deg'],
  });
  // La sombra se ensancha en el centro y se encoge en los extremos.
  const shadowScale = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.7, 1, 0.7],
  });

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.backdrop}>
        <View style={styles.track}>
          <Animated.View
            style={[styles.shadow, { transform: [{ translateX }, { scaleX: shadowScale }] }]}
          />
          <Animated.View style={[styles.ball, { transform: [{ translateX }, { rotate }] }]}>
            <View style={styles.ballInner}>
              <Text style={styles.ballText}>8</Text>
            </View>
          </Animated.View>
        </View>
        {label ? <Text style={styles.label}>{label}</Text> : null}
      </View>
    </Modal>
  );
}

const BALL = 46;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(12,12,13,.86)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  track: {
    width: TRAVEL * 2 + BALL + 20,
    height: BALL + 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    position: 'absolute',
    bottom: 2,
    width: BALL * 0.8,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(201,162,75,.22)', // reflejo dorado tipo "paño"
  },
  ball: {
    width: BALL,
    height: BALL,
    borderRadius: BALL / 2,
    backgroundColor: '#0c0c0d',
    borderWidth: 1.5,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ballInner: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ballText: { fontFamily: fonts.oswaldBold, fontSize: 13, color: colors.background },
  label: {
    marginTop: 22,
    fontFamily: fonts.manropeBold,
    fontSize: 13,
    letterSpacing: 1,
    color: colors.gold,
  },
});

import { useFocusEffect } from 'expo-router';
import React from 'react';
import { Animated, Easing, StyleSheet, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { getNavDirection } from '@/utils/navAnim';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
  /** horizontal screen padding (design uses 22) */
  padded?: boolean;
};

export function Screen({ children, style, padded = true }: Props) {
  // Revelado al ganar foco: fade + deslizamiento direccional (según el orden
  // de los tabs). Se reproduce cada vez que la pantalla vuelve a foco.
  // progress 0 -> 1 controla fade, deslizamiento y un leve escalado de entrada.
  const progress = React.useRef(new Animated.Value(0)).current;
  const [dir, setDir] = React.useState(1);

  useFocusEffect(
    React.useCallback(() => {
      setDir(getNavDirection());
      progress.setValue(0);
      const anim = Animated.timing(progress, {
        toValue: 1,
        duration: 380,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      });
      anim.start();
      return () => anim.stop();
    }, [progress])
  );

  const opacity = progress.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [dir * 70, 0],
  });
  const scale = progress.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Animated.View
        style={[
          styles.inner,
          padded && styles.padded,
          { opacity, transform: [{ translateX }, { scale }] },
          style,
        ]}
      >
        {children}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  inner: { flex: 1 },
  padded: { paddingHorizontal: 22 },
});

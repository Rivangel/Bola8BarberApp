import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { fonts, radius } from '@/constants/typography';
import { useToast } from '@/store/toast';
import { Icon } from './Icon';

const VISIBLE_MS = 2600;

/**
 * Banner de notificación que baja desde arriba, se mantiene unos segundos y se
 * oculta solo. También se puede cerrar tocándolo. Verde = éxito · rojo = error.
 */
export function Toast() {
  const { visible, message, variant, hide } = useToast();
  const insets = useSafeAreaInsets();
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;
    anim.setValue(0);
    Animated.spring(anim, { toValue: 1, useNativeDriver: true, friction: 8, tension: 70 }).start();
    const t = setTimeout(() => {
      Animated.timing(anim, { toValue: 0, duration: 220, useNativeDriver: true }).start(hide);
    }, VISIBLE_MS);
    return () => clearTimeout(t);
  }, [visible, message, variant, anim, hide]);

  if (!visible) return null;

  const isSuccess = variant === 'success';
  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [-24, 0] });

  const dismiss = () =>
    Animated.timing(anim, { toValue: 0, duration: 180, useNativeDriver: true }).start(hide);

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.wrap, { top: insets.top + 10, opacity: anim, transform: [{ translateY }] }]}
    >
      <Pressable onPress={dismiss} style={[styles.toast, isSuccess ? styles.success : styles.error]}>
        <View
          style={[
            styles.iconWrap,
            { backgroundColor: isSuccess ? colors.statusGreen : colors.statusRed },
          ]}
        >
          <Icon name={isSuccess ? 'check' : 'close'} size={14} color={colors.background} strokeWidth={3} />
        </View>
        <Text style={styles.text}>{message}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    alignItems: 'center',
    zIndex: 1000,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    width: '100%',
    maxWidth: 460,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderRadius: radius.card,
    paddingVertical: 12,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  success: { borderColor: colors.greenTintBorder },
  error: { borderColor: 'rgba(217,107,107,.4)' },
  iconWrap: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1, fontFamily: fonts.manropeSemiBold, fontSize: 14, color: colors.textPrimary },
});

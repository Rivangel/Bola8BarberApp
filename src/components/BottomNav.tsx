import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/typography';
import { setNavDirection } from '@/utils/navAnim';
import { Icon, type IconName } from './Icon';

const TABS: { name: string; label: string; icon: IconName; center?: boolean }[] = [
  { name: 'index', label: 'Inicio', icon: 'home' },
  { name: 'calendario', label: 'Calendario', icon: 'calendar' },
  { name: 'nueva-cita', label: 'Nueva', icon: 'plus', center: true },
  { name: 'clientes', label: 'Clientes', icon: 'clients' },
  { name: 'perfil', label: 'Perfil', icon: 'user' },
];

const INDICATOR_WIDTH = 26;

// Custom bottom tab bar matching the imported design (height 88, gold accents).
export function BottomNav({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const [barWidth, setBarWidth] = React.useState(0);

  // Posición de la barra activa (índice del tab enfocado entre las pestañas).
  const activeIndex = TABS.findIndex(
    (t) => state.routes.findIndex((r) => r.name === t.name) === state.index
  );
  const indicator = React.useRef(new Animated.Value(activeIndex)).current;

  React.useEffect(() => {
    Animated.spring(indicator, {
      toValue: activeIndex,
      damping: 16,
      stiffness: 180,
      mass: 0.7,
      useNativeDriver: true,
    }).start();
  }, [activeIndex, indicator]);

  const itemWidth = barWidth / TABS.length;
  const indicatorTranslate = indicator.interpolate({
    inputRange: [0, TABS.length - 1],
    outputRange: [
      itemWidth / 2 - INDICATOR_WIDTH / 2,
      itemWidth * (TABS.length - 1) + itemWidth / 2 - INDICATOR_WIDTH / 2,
    ],
  });

  return (
    <View
      style={[styles.bar, { height: 88 + insets.bottom, paddingBottom: insets.bottom }]}
      onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
    >
      {barWidth > 0 && (
        <Animated.View
          style={[
            styles.indicator,
            { width: INDICATOR_WIDTH, transform: [{ translateX: indicatorTranslate }] },
          ]}
        />
      )}

      {TABS.map((tab) => {
        const routeIndex = state.routes.findIndex((r) => r.name === tab.name);
        const focused = state.index === routeIndex;

        const onPress = () => {
          if (Platform.OS !== 'web') Haptics.selectionAsync().catch(() => {});
          const event = navigation.emit({
            type: 'tabPress',
            target: state.routes[routeIndex]?.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            setNavDirection(routeIndex > state.index ? 1 : -1);
            navigation.navigate(tab.name);
          }
        };

        return <TabItem key={tab.name} tab={tab} focused={focused} onPress={onPress} />;
      })}
    </View>
  );
}

function TabItem({
  tab,
  focused,
  onPress,
}: {
  tab: { name: string; label: string; icon: IconName; center?: boolean };
  focused: boolean;
  onPress: () => void;
}) {
  const tint = focused ? colors.gold : colors.navInactive;
  // Escala de presión (toque) y de selección (icono activo crece ligeramente).
  const press = React.useRef(new Animated.Value(1)).current;
  const select = React.useRef(new Animated.Value(focused ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.spring(select, {
      toValue: focused ? 1 : 0,
      damping: 12,
      stiffness: 200,
      mass: 0.6,
      useNativeDriver: true,
    }).start();
  }, [focused, select]);

  const onPressIn = () =>
    Animated.spring(press, {
      toValue: 0.86,
      damping: 15,
      stiffness: 400,
      useNativeDriver: true,
    }).start();
  const onPressOut = () =>
    Animated.spring(press, {
      toValue: 1,
      damping: 12,
      stiffness: 300,
      useNativeDriver: true,
    }).start();

  // El icono activo crece un 12 %; el botón central hace un "pop" mayor.
  const selectScale = select.interpolate({
    inputRange: [0, 1],
    outputRange: [1, tab.center ? 1.08 : 1.12],
  });
  const iconScale = Animated.multiply(press, selectScale);

  return (
    <Pressable
      style={styles.item}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Animated.View style={{ transform: [{ scale: iconScale }] }}>
        {tab.center ? (
          <View style={styles.centerIcon}>
            <Icon name="plus" size={20} color={colors.background} strokeWidth={2.5} />
          </View>
        ) : (
          <Icon name={tab.icon} size={22} color={tint} />
        )}
      </Animated.View>
      <Text
        style={[
          styles.label,
          { color: tint, fontFamily: focused ? fonts.manropeBold : fonts.manropeSemiBold },
        ]}
      >
        {tab.label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.navBg,
    borderTopWidth: 1,
    borderTopColor: colors.navBorder,
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    paddingTop: 14,
  },
  indicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 3,
    borderRadius: 3,
    backgroundColor: colors.gold,
  },
  item: { alignItems: 'center', gap: 5, flex: 1 },
  centerIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 10 },
});

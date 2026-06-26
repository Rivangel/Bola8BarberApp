import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/typography';
import { Icon, type IconName } from './Icon';

const TABS: { name: string; label: string; icon: IconName; center?: boolean }[] = [
  { name: 'index', label: 'Inicio', icon: 'home' },
  { name: 'calendario', label: 'Calendario', icon: 'calendar' },
  { name: 'nueva-cita', label: 'Nueva', icon: 'plus', center: true },
  { name: 'clientes', label: 'Clientes', icon: 'clients' },
  { name: 'perfil', label: 'Perfil', icon: 'user' },
];

// Custom bottom tab bar matching the imported design (height 88, gold accents).
export function BottomNav({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { height: 88 + insets.bottom, paddingBottom: insets.bottom }]}>
      {TABS.map((tab) => {
        const routeIndex = state.routes.findIndex((r) => r.name === tab.name);
        const focused = state.index === routeIndex;
        const tint = focused ? colors.gold : colors.navInactive;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: state.routes[routeIndex]?.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(tab.name);
          }
        };

        return (
          <Pressable key={tab.name} style={styles.item} onPress={onPress}>
            {tab.center ? (
              <View style={styles.centerIcon}>
                <Icon name="plus" size={20} color={colors.background} strokeWidth={2.5} />
              </View>
            ) : (
              <Icon name={tab.icon} size={22} color={tint} />
            )}
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
      })}
    </View>
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

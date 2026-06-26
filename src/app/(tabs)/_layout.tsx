import { Tabs } from 'expo-router';
import React from 'react';
import { BottomNav } from '@/components/BottomNav';
import { colors } from '@/constants/colors';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <BottomNav {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Inicio' }} />
      <Tabs.Screen name="calendario" options={{ title: 'Calendario' }} />
      <Tabs.Screen name="nueva-cita" options={{ title: 'Nueva' }} />
      <Tabs.Screen name="clientes" options={{ title: 'Clientes' }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil' }} />
    </Tabs>
  );
}

import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { BrandLoader } from '@/components/BrandLoader';
import { Icon, type IconName } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { colors } from '@/constants/colors';
import { fonts, radius } from '@/constants/typography';
import { useProfileStore } from '@/store/profile';
import type { BarberProfile } from '@/types';

function formatCount(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

export default function PerfilScreen() {
  const profile = useProfileStore((s) => s.profile);
  const updateProfile = useProfileStore((s) => s.updateProfile);
  const setPhoto = useProfileStore((s) => s.setPhoto);
  const logout = useProfileStore((s) => s.logout);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<BarberProfile>(profile);
  const [showLogout, setShowLogout] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const initials = profile.name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();

  const startEdit = () => {
    setDraft(profile);
    setEditing(true);
  };
  const saveEdit = () => {
    updateProfile({
      name: draft.name,
      phone: draft.phone,
      email: draft.email,
      location: draft.location,
    });
    setEditing(false);
  };

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permiso necesario', 'Concede acceso a tus fotos para cambiar la imagen.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setPhoto(result.assets[0].uri);
    }
  };

  const doLogout = () => {
    setShowLogout(false);
    setLoggingOut(true);
    // Mostramos el loader de marca un instante antes de limpiar la sesión; al
    // hacer logout, el layout raíz desmonta esta pantalla y muestra el login.
    setTimeout(logout, 900);
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Mi perfil</Text>
        <Pressable style={styles.gear} onPress={editing ? saveEdit : startEdit}>
          <Icon name={editing ? 'check' : 'settings'} size={18} color={colors.gold} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* avatar */}
        <View style={styles.avatarSection}>
          <View>
            <View style={styles.avatar}>
              {profile.photoUri ? (
                <Image source={{ uri: profile.photoUri }} style={styles.avatarImg} />
              ) : (
                <Text style={styles.avatarInitials}>{initials}</Text>
              )}
            </View>
            <Pressable style={styles.cameraBadge} onPress={pickImage}>
              <Icon name="camera" size={14} color={colors.background} strokeWidth={2.5} />
            </Pressable>
          </View>

          {editing ? (
            <TextInput
              style={styles.nameInput}
              value={draft.name}
              onChangeText={(t) => setDraft((d) => ({ ...d, name: t }))}
            />
          ) : (
            <Text style={styles.name}>{profile.name}</Text>
          )}

          <View style={styles.rolePill}>
            <Icon name="scissors" size={13} color={colors.gold} />
            <Text style={styles.roleText}>{profile.role}</Text>
          </View>
        </View>

        {/* stats */}
        <View style={styles.stats}>
          <StatCard value={formatCount(profile.stats.appointments)} label="Citas" />
          <StatCard value={formatCount(profile.stats.clients)} label="Clientes" />
          <StatCard value={String(profile.stats.rating)} label="Valoración" />
        </View>

        {/* personal data */}
        <Text style={styles.sectionLabel}>Datos personales</Text>
        <View style={styles.card}>
          <DataRow
            icon="phone"
            label="Teléfono"
            value={profile.phone}
            editing={editing}
            draftValue={draft.phone}
            onChange={(t) => setDraft((d) => ({ ...d, phone: t }))}
            keyboardType="phone-pad"
          />
          <DataRow
            icon="mail"
            label="Email"
            value={profile.email}
            editing={editing}
            draftValue={draft.email}
            onChange={(t) => setDraft((d) => ({ ...d, email: t }))}
            keyboardType="email-address"
          />
          <DataRow
            icon="map-pin"
            label="Local"
            value={profile.location}
            editing={editing}
            draftValue={draft.location}
            onChange={(t) => setDraft((d) => ({ ...d, location: t }))}
            last
          />
        </View>

        {/* settings */}
        <View style={[styles.card, { marginTop: 16 }]}>
          <SettingRow icon="bell" label="Notificaciones" />
          <SettingRow icon="clock" label="Horario de trabajo" />
          <Pressable style={styles.settingRowLast} onPress={() => setShowLogout(true)}>
            <Icon name="logout" size={17} color={colors.statusRed} />
            <Text style={[styles.settingText, { color: colors.statusRed }]}>Cerrar sesión</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* confirmación de cierre de sesión (modal propio: funciona en web y nativo) */}
      <Modal
        visible={showLogout}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogout(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setShowLogout(false)}>
          <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Cerrar sesión</Text>
            <Text style={styles.modalMessage}>¿Seguro que quieres cerrar sesión?</Text>
            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalBtn, styles.modalBtnGhost]}
                onPress={() => setShowLogout(false)}
              >
                <Text style={styles.modalBtnGhostText}>Cancelar</Text>
              </Pressable>
              <Pressable style={[styles.modalBtn, styles.modalBtnDanger]} onPress={doLogout}>
                <Text style={styles.modalBtnDangerText}>Cerrar sesión</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <BrandLoader visible={loggingOut} label="Cerrando sesión…" />
    </Screen>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function DataRow({
  icon,
  label,
  value,
  editing,
  draftValue,
  onChange,
  keyboardType,
  last,
}: {
  icon: IconName;
  label: string;
  value: string;
  editing: boolean;
  draftValue: string;
  onChange: (t: string) => void;
  keyboardType?: 'phone-pad' | 'email-address';
  last?: boolean;
}) {
  return (
    <View style={[styles.dataRow, !last && styles.rowBorder]}>
      <Icon name={icon} size={17} color={colors.gold} />
      <View style={{ flex: 1 }}>
        <Text style={styles.dataLabel}>{label}</Text>
        {editing ? (
          <TextInput
            style={styles.dataInput}
            value={draftValue}
            onChangeText={onChange}
            keyboardType={keyboardType}
            autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'}
          />
        ) : (
          <Text style={styles.dataValue}>{value}</Text>
        )}
      </View>
    </View>
  );
}

function SettingRow({ icon, label }: { icon: IconName; label: string }) {
  return (
    <Pressable style={[styles.settingRow, styles.rowBorder]}>
      <Icon name={icon} size={17} color={colors.textSecondary} />
      <Text style={styles.settingText}>{label}</Text>
      <Icon name="chevron-right" size={15} color={colors.textFaint} strokeWidth={2.5} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 14,
    paddingBottom: 8,
  },
  title: { fontFamily: fonts.oswaldSemiBold, fontSize: 24, color: colors.textPrimary },
  gear: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSection: { alignItems: 'center', paddingTop: 18, paddingBottom: 20 },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#1a1a1f',
    borderWidth: 2,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: { width: 96, height: 96, borderRadius: 48 },
  avatarInitials: { fontFamily: fonts.oswaldSemiBold, fontSize: 34, color: colors.gold },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.gold,
    borderWidth: 3,
    borderColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { fontFamily: fonts.oswaldSemiBold, fontSize: 26, color: colors.textPrimary, marginTop: 14 },
  nameInput: {
    fontFamily: fonts.oswaldSemiBold,
    fontSize: 26,
    color: colors.textPrimary,
    marginTop: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.gold,
    textAlign: 'center',
    minWidth: 200,
  },
  rolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 6,
    paddingVertical: 5,
    paddingHorizontal: 13,
    borderRadius: 20,
    backgroundColor: colors.goldTint,
    borderWidth: 1,
    borderColor: colors.goldTintBorder,
  },
  roleText: { fontFamily: fonts.manropeBold, fontSize: 12, color: colors.gold },
  stats: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    paddingVertical: 14,
    alignItems: 'center',
  },
  statValue: { fontFamily: fonts.oswaldSemiBold, fontSize: 22, color: colors.gold },
  statLabel: { fontFamily: fonts.manrope, fontSize: 11, color: colors.textMuted, marginTop: 2 },
  sectionLabel: {
    fontFamily: fonts.manropeBold,
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.textMuted,
    marginBottom: 8,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.cardLg,
    overflow: 'hidden',
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  dataRow: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 14, paddingHorizontal: 16 },
  dataLabel: { fontFamily: fonts.manrope, fontSize: 10, color: colors.textFaint },
  dataValue: { fontFamily: fonts.manropeSemiBold, fontSize: 14, color: colors.textPrimary, marginTop: 1 },
  dataInput: {
    fontFamily: fonts.manropeSemiBold,
    fontSize: 14,
    color: colors.textPrimary,
    padding: 0,
    marginTop: 1,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 14, paddingHorizontal: 16 },
  settingRowLast: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 14, paddingHorizontal: 16 },
  settingText: { flex: 1, fontFamily: fonts.manropeSemiBold, fontSize: 14, color: colors.textPrimary },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.6)',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.cardLg,
    padding: 20,
  },
  modalTitle: { fontFamily: fonts.oswaldSemiBold, fontSize: 19, color: colors.textPrimary },
  modalMessage: {
    fontFamily: fonts.manrope,
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    marginBottom: 20,
  },
  modalActions: { flexDirection: 'row', gap: 10 },
  modalBtn: {
    flex: 1,
    height: 46,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnGhost: { backgroundColor: colors.surfaceDim, borderWidth: 1, borderColor: colors.border },
  modalBtnGhostText: { fontFamily: fonts.manropeBold, fontSize: 14, color: colors.textSecondary },
  modalBtnDanger: { backgroundColor: colors.statusRed },
  modalBtnDangerText: { fontFamily: fonts.manropeExtraBold, fontSize: 14, color: colors.background },
});

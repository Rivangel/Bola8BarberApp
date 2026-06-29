import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Avatar } from '@/components/Avatar';
import { Icon, type IconName } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { ServiceChips } from '@/components/ServiceChips';
import { StatusBadge } from '@/components/StatusBadge';
import { colors } from '@/constants/colors';
import { fonts, radius } from '@/constants/typography';
import { useAppointment } from '@/hooks/useAppointments';
import { useAppointmentsStore } from '@/store/appointments';
import {
  SERVICE_PRICE,
  type AppointmentStatus,
  type ServiceName,
} from '@/types';
import { addMinutesToTime, longDate } from '@/utils/dates';

const STATUS_OPTIONS: AppointmentStatus[] = ['confirmada', 'pendiente', 'cancelada'];

export default function DetalleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const appointment = useAppointment(id);
  const updateAppointment = useAppointmentsStore((s) => s.updateAppointment);
  const cancelAppointment = useAppointmentsStore((s) => s.cancelAppointment);

  const [editing, setEditing] = useState(false);
  const [service, setService] = useState<ServiceName>(appointment?.service ?? 'Corte');
  const [status, setStatus] = useState<AppointmentStatus>(appointment?.status ?? 'pendiente');
  const [notes, setNotes] = useState(appointment?.notes ?? '');

  if (!appointment) {
    return (
      <Screen>
        <Text style={styles.notFound}>Cita no encontrada.</Text>
      </Screen>
    );
  }

  const endTime = addMinutesToTime(appointment.startTime, appointment.durationMin);

  const startEdit = () => {
    setService(appointment.service);
    setStatus(appointment.status);
    setNotes(appointment.notes ?? '');
    setEditing(true);
  };

  const save = async () => {
    try {
      await updateAppointment(appointment.id, {
        service,
        status,
        notes: notes.trim() || undefined,
        price: SERVICE_PRICE[service],
      });
      setEditing(false);
    } catch (e) {
      Alert.alert('No se pudo guardar', e instanceof Error ? e.message : 'Inténtalo de nuevo.');
    }
  };

  const confirmCancel = () => {
    Alert.alert('Cancelar cita', '¿Seguro que quieres cancelar esta cita?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Sí, cancelar',
        style: 'destructive',
        onPress: async () => {
          try {
            await cancelAppointment(appointment.id);
            router.back();
          } catch (e) {
            Alert.alert('No se pudo cancelar', e instanceof Error ? e.message : 'Inténtalo de nuevo.');
          }
        },
      },
    ]);
  };

  return (
    <Screen padded={false}>
      {/* header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Icon name="chevron-left" size={16} color={colors.textPrimary} strokeWidth={2.5} />
          </Pressable>
          <Text style={styles.title}>Detalle</Text>
        </View>
        <StatusBadge status={editing ? status : appointment.status} variant="pill" />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* client */}
        <View style={styles.clientSection}>
          <Avatar initials={appointment.client?.initials ?? '?'} size={84} tone="dark" fontSize={30} photoUri={appointment.client?.photoUri} />
          <Text style={styles.clientName}>{appointment.client?.name ?? 'Cliente'}</Text>
          <View style={styles.phoneRow}>
            <Icon name="phone" size={14} color={colors.textMuted} />
            <Text style={styles.phoneText}>{appointment.client?.phone ?? '—'}</Text>
          </View>
        </View>

        {editing ? (
          <View style={styles.editBlock}>
            <Text style={styles.editLabel}>Servicio</Text>
            <ServiceChips value={service} onChange={setService} />

            <Text style={[styles.editLabel, { marginTop: 16 }]}>Estado</Text>
            <View style={styles.statusOptions}>
              {STATUS_OPTIONS.map((s) => (
                <Pressable key={s} onPress={() => setStatus(s)} style={{ opacity: status === s ? 1 : 0.45 }}>
                  <StatusBadge status={s} variant="pill" />
                </Pressable>
              ))}
            </View>

            <Text style={[styles.editLabel, { marginTop: 16 }]}>Nota</Text>
            <TextInput
              style={styles.notesInput}
              value={notes}
              onChangeText={setNotes}
              multiline
              placeholder="Añade una nota…"
              placeholderTextColor={colors.textFaint}
            />
          </View>
        ) : (
          <>
            {/* detail rows */}
            <View style={styles.card}>
              <DetailRow icon="scissors" label="Servicio" value={appointment.service} />
              <DetailRow icon="calendar-line" label="Fecha" value={longDate(appointment.date)} />
              <DetailRow icon="clock" label="Hora" value={`${appointment.startTime} — ${endTime}`} />
              <DetailRow icon="euro" label="Precio" value={`${appointment.price} €`} price last />
            </View>

            {/* note */}
            {appointment.notes && (
              <View style={styles.noteCard}>
                <Text style={styles.noteLabel}>Nota</Text>
                <Text style={styles.noteText}>{appointment.notes}</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* actions */}
      <View style={styles.actions}>
        {editing ? (
          <Pressable style={[styles.editBtn, { flex: 1 }]} onPress={save}>
            <Icon name="check" size={16} color={colors.background} strokeWidth={2.3} />
            <Text style={styles.editBtnText}>Guardar cambios</Text>
          </Pressable>
        ) : (
          <>
            <Pressable style={styles.cancelBtn} onPress={confirmCancel}>
              <Icon name="close" size={16} color={colors.statusRed} />
              <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>
            <Pressable style={styles.editBtn} onPress={startEdit}>
              <Icon name="edit" size={16} color={colors.background} strokeWidth={2.3} />
              <Text style={styles.editBtnText}>Editar cita</Text>
            </Pressable>
          </>
        )}
      </View>
    </Screen>
  );
}

function DetailRow({
  icon,
  label,
  value,
  price,
  last,
}: {
  icon: IconName;
  label: string;
  value: string;
  price?: boolean;
  last?: boolean;
}) {
  return (
    <View style={[styles.detailRow, !last && styles.rowBorder]}>
      <View style={styles.detailLeft}>
        <Icon name={icon} size={18} color={colors.gold} />
        <Text style={styles.detailLabel}>{label}</Text>
      </View>
      <Text style={price ? styles.priceValue : styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 18,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontFamily: fonts.oswaldSemiBold, fontSize: 22, color: colors.textPrimary },
  scroll: { paddingHorizontal: 22, paddingBottom: 20 },
  clientSection: { alignItems: 'center', paddingVertical: 22 },
  clientName: { fontFamily: fonts.oswaldSemiBold, fontSize: 24, color: colors.textPrimary, marginTop: 14 },
  phoneRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 6 },
  phoneText: { fontFamily: fonts.manrope, fontSize: 13, color: colors.textSecondary },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.cardLg,
    overflow: 'hidden',
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  detailRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, paddingHorizontal: 18 },
  detailLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  detailLabel: { fontFamily: fonts.manrope, fontSize: 13, color: colors.textMuted },
  detailValue: { fontFamily: fonts.manropeBold, fontSize: 14, color: colors.textPrimary },
  priceValue: { fontFamily: fonts.oswaldSemiBold, fontSize: 18, color: colors.gold },
  noteCard: {
    marginTop: 14,
    paddingVertical: 13,
    paddingHorizontal: 16,
    backgroundColor: colors.surfaceDim,
    borderWidth: 1,
    borderColor: colors.borderDim,
    borderRadius: radius.input,
  },
  noteLabel: {
    fontFamily: fonts.manropeBold,
    fontSize: 10,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.textFaint,
    marginBottom: 5,
  },
  noteText: { fontFamily: fonts.manrope, fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
  editBlock: { marginTop: 4 },
  editLabel: {
    fontFamily: fonts.manropeBold,
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.textMuted,
    marginBottom: 8,
  },
  statusOptions: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  notesInput: {
    minHeight: 90,
    backgroundColor: colors.surfaceDim,
    borderWidth: 1,
    borderColor: colors.borderDim,
    borderRadius: radius.input,
    padding: 14,
    fontFamily: fonts.manrope,
    fontSize: 13,
    color: colors.textPrimary,
    textAlignVertical: 'top',
  },
  notFound: { fontFamily: fonts.manrope, fontSize: 14, color: colors.textMuted, textAlign: 'center', marginTop: 40 },
  actions: { flexDirection: 'row', gap: 11, paddingHorizontal: 22, paddingTop: 8, paddingBottom: 16 },
  cancelBtn: {
    flex: 1,
    height: 52,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: '#3a2a2a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  cancelText: { fontFamily: fonts.manropeBold, fontSize: 15, color: colors.statusRed },
  editBtn: {
    flex: 1.3,
    height: 52,
    borderRadius: radius.card,
    backgroundColor: colors.gold,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: colors.gold,
    shadowOpacity: 0.28,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  editBtnText: { fontFamily: fonts.manropeExtraBold, fontSize: 15, color: colors.background },
});

import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { ServiceChips } from '@/components/ServiceChips';
import { TimeSlotGrid, type TimeSlot } from '@/components/TimeSlotGrid';
import { colors } from '@/constants/colors';
import { fonts, radius } from '@/constants/typography';
import { useAppointmentsStore } from '@/store/appointments';
import { useClientsStore } from '@/store/clients';
import { SERVICE_PRICE, type ServiceName } from '@/types';
import { dayMonth, toISO } from '@/utils/dates';

const BASE_SLOTS = ['09:00', '09:45', '10:30', '11:15', '12:00', '12:45', '16:00', '16:45'];
const DURATIONS = [30, 45, 60];

type FormValues = { cliente: string; telefono: string };

export default function NuevaCitaScreen() {
  const router = useRouter();
  const clients = useClientsStore((s) => s.clients);
  const addClient = useClientsStore((s) => s.addClient);
  const appointments = useAppointmentsStore((s) => s.appointments);
  const addAppointment = useAppointmentsStore((s) => s.addAppointment);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: { cliente: '', telefono: '' } });

  const [service, setService] = useState<ServiceName | null>('Corte + Barba');
  const [date, setDate] = useState(new Date());
  const [duration, setDuration] = useState(45);
  const [slot, setSlot] = useState<string | null>('10:30');
  const [showDate, setShowDate] = useState(false);
  const [showDuration, setShowDuration] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const clienteValue = watch('cliente');

  const suggestions = useMemo(() => {
    const q = clienteValue?.trim().toLowerCase() ?? '';
    if (!q) return [];
    return clients.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 4);
  }, [clienteValue, clients]);

  const slots: TimeSlot[] = useMemo(() => {
    const iso = toISO(date);
    const booked = new Set(
      appointments.filter((a) => a.date === iso && a.status !== 'cancelada').map((a) => a.startTime)
    );
    return BASE_SLOTS.map((time) => ({ time, booked: booked.has(time) && time !== slot }));
  }, [appointments, date, slot]);

  const onSubmit = (values: FormValues) => {
    if (!service || !slot) return;
    // find or create the client
    let client = clients.find((c) => c.name.toLowerCase() === values.cliente.trim().toLowerCase());
    if (!client) {
      client = addClient({ name: values.cliente, phone: values.telefono });
    }
    addAppointment({
      clientId: client.id,
      service,
      date: toISO(date),
      startTime: slot,
      durationMin: duration,
      price: SERVICE_PRICE[service],
    });
    router.replace('/');
  };

  const canSubmit = !!service && !!slot;

  return (
    <Screen padded={false}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* header */}
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => router.replace('/')}>
            <Icon name="chevron-left" size={16} color={colors.textPrimary} strokeWidth={2.5} />
          </Pressable>
          <Text style={styles.title}>Nueva cita</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* cliente */}
          <View style={styles.field}>
            <Text style={styles.label}>Cliente</Text>
            <Controller
              control={control}
              name="cliente"
              rules={{ required: 'Introduce el nombre del cliente' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={[styles.input, errors.cliente && styles.inputError]}>
                  <Icon name="user" size={18} color={colors.textFaint} />
                  <TextInput
                    style={styles.inputText}
                    placeholder="Nombre del cliente"
                    placeholderTextColor={colors.textFaint}
                    value={value}
                    onChangeText={(t) => {
                      onChange(t);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={onBlur}
                  />
                </View>
              )}
            />
            {showSuggestions && suggestions.length > 0 && (
              <View style={styles.suggestions}>
                {suggestions.map((c) => (
                  <Pressable
                    key={c.id}
                    style={styles.suggestion}
                    onPress={() => {
                      setValue('cliente', c.name, { shouldValidate: true });
                      setValue('telefono', c.phone);
                      setShowSuggestions(false);
                    }}
                  >
                    <Text style={styles.suggestionName}>{c.name}</Text>
                    <Text style={styles.suggestionPhone}>{c.phone}</Text>
                  </Pressable>
                ))}
              </View>
            )}
            {errors.cliente && <Text style={styles.errorText}>{errors.cliente.message}</Text>}
          </View>

          {/* teléfono */}
          <View style={styles.field}>
            <Text style={styles.label}>Teléfono</Text>
            <Controller
              control={control}
              name="telefono"
              rules={{ required: 'Introduce el teléfono' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={[styles.input, errors.telefono && styles.inputError]}>
                  <Icon name="phone" size={18} color={colors.textFaint} />
                  <TextInput
                    style={styles.inputText}
                    placeholder="+34 600 000 000"
                    placeholderTextColor={colors.textFaint}
                    keyboardType="phone-pad"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                </View>
              )}
            />
            {errors.telefono && <Text style={styles.errorText}>{errors.telefono.message}</Text>}
          </View>

          {/* servicio */}
          <View style={styles.field}>
            <Text style={styles.label}>Servicio</Text>
            <ServiceChips value={service} onChange={setService} />
          </View>

          {/* fecha + duración */}
          <View style={[styles.field, styles.rowFields]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Fecha</Text>
              <Pressable style={styles.inputSm} onPress={() => setShowDate(true)}>
                <Icon name="calendar-line" size={16} color={colors.gold} />
                <Text style={styles.inputSmText}>{dayMonth(toISO(date))}</Text>
              </Pressable>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Duración</Text>
              <Pressable style={styles.inputSm} onPress={() => setShowDuration(true)}>
                <Icon name="clock" size={16} color={colors.gold} />
                <Text style={styles.inputSmText}>{duration} min</Text>
              </Pressable>
            </View>
          </View>

          {/* hora disponible */}
          <View style={styles.field}>
            <Text style={styles.label}>Hora disponible</Text>
            <TimeSlotGrid slots={slots} value={slot} onChange={setSlot} />
          </View>
        </ScrollView>

        {/* CTA */}
        <View style={styles.ctaWrap}>
          <Pressable
            style={[styles.cta, !canSubmit && styles.ctaDisabled]}
            disabled={!canSubmit}
            onPress={handleSubmit(onSubmit)}
          >
            <Icon name="check" size={18} color={colors.background} strokeWidth={2.5} />
            <Text style={styles.ctaText}>Confirmar cita</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>

      {/* date picker */}
      {showDate && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          themeVariant="dark"
          onChange={(_, selectedDate) => {
            setShowDate(Platform.OS === 'ios');
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      {/* duration modal */}
      <Modal visible={showDuration} transparent animationType="fade" onRequestClose={() => setShowDuration(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setShowDuration(false)}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Duración</Text>
            {DURATIONS.map((d) => (
              <Pressable
                key={d}
                style={styles.modalOption}
                onPress={() => {
                  setDuration(d);
                  setShowDuration(false);
                }}
              >
                <Text style={[styles.modalOptionText, d === duration && styles.modalOptionActive]}>
                  {d} min
                </Text>
                {d === duration && <Icon name="check" size={16} color={colors.gold} />}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 22, paddingTop: 14, paddingBottom: 16 },
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
  title: { fontFamily: fonts.oswaldSemiBold, fontSize: 24, color: colors.textPrimary },
  scroll: { paddingHorizontal: 22, paddingBottom: 20 },
  field: { marginBottom: 16 },
  rowFields: { flexDirection: 'row', gap: 12 },
  label: {
    fontFamily: fonts.manropeBold,
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.textMuted,
    marginBottom: 8,
  },
  input: {
    height: 50,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.input,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 11,
  },
  inputError: { borderColor: colors.statusRed },
  inputText: { flex: 1, fontFamily: fonts.manropeSemiBold, fontSize: 15, color: colors.textPrimary },
  inputSm: {
    height: 50,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.input,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 9,
  },
  inputSmText: { fontFamily: fonts.manropeSemiBold, fontSize: 14, color: colors.textPrimary },
  errorText: { fontFamily: fonts.manrope, fontSize: 11, color: colors.statusRed, marginTop: 6 },
  suggestions: {
    marginTop: 6,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.input,
    overflow: 'hidden',
  },
  suggestion: { paddingVertical: 10, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: colors.divider },
  suggestionName: { fontFamily: fonts.manropeSemiBold, fontSize: 14, color: colors.textPrimary },
  suggestionPhone: { fontFamily: fonts.manrope, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  ctaWrap: { paddingHorizontal: 22, paddingTop: 8, paddingBottom: 14 },
  cta: {
    height: 54,
    borderRadius: radius.button,
    backgroundColor: colors.gold,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    shadowColor: colors.gold,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  ctaDisabled: { opacity: 0.5 },
  ctaText: { fontFamily: fonts.manropeExtraBold, fontSize: 16, letterSpacing: 0.3, color: colors.background },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,.6)', justifyContent: 'center', paddingHorizontal: 40 },
  modalCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.cardLg, padding: 8 },
  modalTitle: {
    fontFamily: fonts.manropeBold,
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.textMuted,
    padding: 12,
  },
  modalOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 12 },
  modalOptionText: { fontFamily: fonts.manropeSemiBold, fontSize: 15, color: colors.textSecondary },
  modalOptionActive: { color: colors.gold, fontFamily: fonts.manropeBold },
});

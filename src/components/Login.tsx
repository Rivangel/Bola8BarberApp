import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrandLoader } from '@/components/BrandLoader';
import { Icon } from '@/components/Icon';
import { colors } from '@/constants/colors';
import { fonts, radius } from '@/constants/typography';
import { ApiError } from '@/services/http';
import { useProfileStore } from '@/store/profile';
import { Logo } from './Logo';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FormValues = { email: string; password: string };

// Pantalla de inicio de sesión: email + contraseña validados contra la API.
export function Login() {
  const login = useProfileStore((s) => s.login);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: { email: '', password: '' } });

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const onSubmit = async (values: FormValues) => {
    if (submitting) return;
    setSubmitting(true);
    setFormError(null);
    try {
      // Tiempo mínimo para que se aprecie el loader de marca aunque la API
      // responda al instante (red local), y luego validamos credenciales.
      await new Promise((resolve) => setTimeout(resolve, 600));
      await login(values.email, values.password);
      // Al autenticarse, el gate del layout raíz desmonta esta pantalla y
      // muestra las tabs; no tocamos `submitting` para evitar avisos de unmount.
    } catch (e) {
      const message =
        e instanceof ApiError ? e.message : 'No se pudo iniciar sesión. Inténtalo de nuevo.';
      setFormError(message);
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Logo />
            <Text style={styles.tagline}>Gestión de citas</Text>
          </View>

          <View style={styles.form}>
          <Text style={styles.welcome}>Iniciar sesión</Text>

          {/* email */}
          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <Controller
              control={control}
              name="email"
              rules={{
                required: 'Introduce tu email',
                pattern: { value: EMAIL_REGEX, message: 'Email no válido' },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={[styles.input, errors.email && styles.inputError]}>
                  <Icon name="mail" size={18} color={colors.textFaint} />
                  <TextInput
                    style={styles.inputText}
                    placeholder="tu@correo.com"
                    placeholderTextColor={colors.textFaint}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="email"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                </View>
              )}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
          </View>

          {/* password */}
          <View style={styles.field}>
            <Text style={styles.label}>Contraseña</Text>
            <Controller
              control={control}
              name="password"
              rules={{
                required: 'Introduce tu contraseña',
                minLength: { value: 6, message: 'Mínimo 6 caracteres' },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={[styles.input, errors.password && styles.inputError]}>
                  <Icon name="lock" size={18} color={colors.textFaint} />
                  <TextInput
                    style={styles.inputText}
                    placeholder="••••••••"
                    placeholderTextColor={colors.textFaint}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    onSubmitEditing={handleSubmit(onSubmit)}
                  />
                  <Pressable
                    onPress={() => setShowPassword((v) => !v)}
                    hitSlop={8}
                    accessibilityLabel={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    <Icon name={showPassword ? 'eye-off' : 'eye'} size={18} color={colors.textFaint} />
                  </Pressable>
                </View>
              )}
            />
            {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
          </View>

          {formError && (
            <View style={styles.banner}>
              <Icon name="close" size={15} color={colors.statusRed} strokeWidth={2.5} />
              <Text style={styles.bannerText}>{formError}</Text>
            </View>
          )}

            <Pressable
              style={[styles.cta, submitting && styles.ctaDisabled]}
              disabled={submitting}
              onPress={handleSubmit(onSubmit)}
            >
              <Text style={styles.ctaText}>Entrar</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>

      <BrandLoader visible={submitting} label="Entrando…" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 22 },
  flex: { flex: 1 },
  content: { flex: 1, justifyContent: 'center' },
  header: { alignItems: 'center', gap: 16, marginBottom: 36 },
  tagline: { fontFamily: fonts.manrope, fontSize: 14, color: colors.textMuted, letterSpacing: 1 },
  form: {},
  welcome: {
    fontFamily: fonts.oswaldSemiBold,
    fontSize: 22,
    color: colors.textPrimary,
    marginBottom: 18,
  },
  field: { marginBottom: 16 },
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
  errorText: { fontFamily: fonts.manrope, fontSize: 11, color: colors.statusRed, marginTop: 6 },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: radius.input,
    backgroundColor: 'rgba(217,107,107,.12)',
    borderWidth: 1,
    borderColor: 'rgba(217,107,107,.35)',
    marginBottom: 16,
  },
  bannerText: { flex: 1, fontFamily: fonts.manropeSemiBold, fontSize: 13, color: colors.statusRed },
  cta: {
    height: 54,
    borderRadius: radius.button,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  ctaDisabled: { opacity: 0.6 },
  ctaText: { fontFamily: fonts.manropeExtraBold, fontSize: 16, color: colors.background },
});

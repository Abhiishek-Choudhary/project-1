import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRoute, type RouteProp } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Spacing } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { otpSchema, type OtpFormValues } from '../../features/auth/schemas';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import { useToast } from '../../contexts/ToastContext';
import type { AuthStackParamList } from '../../types/navigation';
import { parseApiError } from '../../utils/errorHandler';

export function OtpVerificationScreen() {
  const route = useRoute<RouteProp<AuthStackParamList, 'OtpVerification'>>();
  const { phone, role } = route.params;
  const { colors } = useTheme();
  const { showToast } = useToast();
  const login = useAuthStore((s) => s.login);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '123456' },
  });

  const onSubmit = async (data: OtpFormValues) => {
    setLoading(true);
    try {
      const response = await authService.verifyOtp(phone, data.otp);
      login(response.user);
      showToast('Welcome to FreshDash!', 'success');
    } catch (e) {
      showToast(parseApiError(e).message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>Verify OTP</Text>
        <Text style={[styles.sub, { color: colors.textSecondary }]}>
          Enter the 6-digit code sent to {phone}
        </Text>
        <Text style={[styles.hint, { color: colors.textMuted }]}>
          Demo OTP: 123456
        </Text>
        <Controller
          control={control}
          name="otp"
          render={({ field: { onChange, value } }) => (
            <Input
              label="OTP"
              keyboardType="number-pad"
              maxLength={6}
              value={value}
              onChangeText={onChange}
              error={errors.otp?.message}
            />
          )}
        />
        <Button title="Verify & Continue" onPress={handleSubmit(onSubmit)} loading={loading} fullWidth />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, padding: Spacing.xxl, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '700' },
  sub: { marginTop: Spacing.sm, marginBottom: Spacing.sm },
  hint: { fontSize: 12, marginBottom: Spacing.xl },
});

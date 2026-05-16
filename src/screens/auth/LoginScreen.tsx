import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Spacing, Typography } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { loginSchema, type LoginFormValues } from '../../features/auth/schemas';
import { authService } from '../../services/authService';
import { useToast } from '../../contexts/ToastContext';
import type { AuthStackParamList } from '../../types/navigation';
import { parseApiError } from '../../utils/errorHandler';

export function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { colors } = useTheme();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { phone: '+1234567890' },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    try {
      await authService.login(data.phone);
      navigation.navigate('OtpVerification', { phone: data.phone });
    } catch (e) {
      showToast(parseApiError(e).message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <Text style={[styles.brand, { color: colors.primary }]}>FreshDash</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Groceries delivered in minutes
        </Text>
        <View style={styles.form}>
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Phone Number"
                placeholder="+1 234 567 8900"
                keyboardType="phone-pad"
                value={value}
                onChangeText={onChange}
                error={errors.phone?.message}
              />
            )}
          />
          <Button title="Continue" onPress={handleSubmit(onSubmit)} loading={loading} fullWidth />
        </View>
        <Pressable onPress={() => navigation.navigate('Signup')}>
          <Text style={[styles.link, { color: colors.primary }]}>
            New here? Create an account
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, padding: Spacing.xxl, justifyContent: 'center' },
  brand: { ...Typography.brand, fontSize: 36, textAlign: 'center' },
  subtitle: { textAlign: 'center', marginTop: Spacing.sm, marginBottom: Spacing.xxxl },
  form: { marginBottom: Spacing.xl },
  link: { textAlign: 'center', fontWeight: '600' },
});

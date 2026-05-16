import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserRole } from '../../constants/enums';
import { Spacing } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { signupSchema, type SignupFormValues } from '../../features/auth/schemas';
import { authService } from '../../services/authService';
import { useToast } from '../../contexts/ToastContext';
import type { AuthStackParamList } from '../../types/navigation';
import { parseApiError } from '../../utils/errorHandler';

const ROLES = [
  { value: UserRole.User, label: 'Customer' },
  { value: UserRole.Vendor, label: 'Vendor' },
  { value: UserRole.DeliveryPartner, label: 'Delivery Partner' },
];

export function SignupScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { colors } = useTheme();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, setValue, watch, formState: { errors } } =
    useForm<SignupFormValues>({
      resolver: zodResolver(signupSchema),
      defaultValues: { role: UserRole.User },
    });

  const selectedRole = watch('role');

  const onSubmit = async (data: SignupFormValues) => {
    setLoading(true);
    try {
      await authService.signup(data);
      navigation.navigate('OtpVerification', {
        phone: data.phone,
        isSignup: true,
        role: data.role,
      });
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
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input label="Full Name" value={value} onChangeText={onChange} error={errors.name?.message} />
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
                error={errors.email?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Phone"
                keyboardType="phone-pad"
                value={value}
                onChangeText={onChange}
                error={errors.phone?.message}
              />
            )}
          />
          <Text style={[styles.roleLabel, { color: colors.text }]}>I am a</Text>
          <View style={styles.roles}>
            {ROLES.map((r) => (
              <Pressable
                key={r.value}
                onPress={() => setValue('role', r.value)}
                style={[
                  styles.rolePill,
                  {
                    backgroundColor:
                      selectedRole === r.value ? colors.primary : colors.backgroundSecondary,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text
                  style={{
                    color: selectedRole === r.value ? '#FFF' : colors.text,
                    fontWeight: '600',
                    fontSize: 13,
                  }}
                >
                  {r.label}
                </Text>
              </Pressable>
            ))}
          </View>
          <Button title="Sign Up" onPress={handleSubmit(onSubmit)} loading={loading} fullWidth />
          <Pressable onPress={() => navigation.goBack()}>
            <Text style={[styles.link, { color: colors.primary }]}>Already have an account?</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: Spacing.xxl },
  title: { fontSize: 24, fontWeight: '700', marginBottom: Spacing.xl },
  roleLabel: { fontSize: 14, fontWeight: '600', marginBottom: Spacing.sm },
  roles: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.xl },
  rolePill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
  },
  link: { textAlign: 'center', marginTop: Spacing.lg, fontWeight: '600' },
});

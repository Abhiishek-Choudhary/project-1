import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BorderRadius, Spacing } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuthStore } from '../../store/authStore';
import { VendorHeader } from '../../components/layout/VendorHeader';

export function DeliveryProfileScreen() {
  const { colors } = useTheme();
  const { user, logout } = useAuthStore();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.backgroundSecondary }]} edges={['top']}>
      <VendorHeader />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.profile}>
          <Image
            source={{ uri: user?.avatarUrl ?? 'https://i.pravatar.cc/120?u=driver' }}
            style={styles.avatar}
          />
          <Text style={[styles.name, { color: colors.text }]}>{user?.name ?? 'Driver'}</Text>
          <Text style={{ color: colors.textSecondary }}>Delivery Partner</Text>
        </View>
        {['Vehicle Info', 'Documents', 'Support'].map((item) => (
          <Pressable key={item} style={[styles.menuRow, { backgroundColor: colors.surface }]}>
            <Text style={{ color: colors.text, fontWeight: '500' }}>{item}</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </Pressable>
        ))}
        <Pressable
          style={[styles.logout, { borderColor: colors.error }]}
          onPress={() => void logout()}
        >
          <Text style={{ color: colors.error, fontWeight: '700' }}>Logout</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: Spacing.lg, paddingBottom: 100 },
  profile: { alignItems: 'center', marginBottom: Spacing.xl },
  avatar: { width: 88, height: 88, borderRadius: 44, marginBottom: Spacing.md },
  name: { fontSize: 22, fontWeight: '700' },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  logout: {
    marginTop: Spacing.xl,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    alignItems: 'center',
  },
});

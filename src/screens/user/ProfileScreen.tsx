import React from 'react';
import { ScrollView, StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Shadows, Spacing } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuthStore } from '../../store/authStore';
import { AppHeader } from '../../components/layout/AppHeader';
import { ProfileMenuCard } from '../../components/profile/ProfileMenuCard';
import { SettingsToggleRow } from '../../components/profile/SettingsToggleRow';
import { LanguageSelector } from '../../components/profile/LanguageSelector';
import type { UserStackParamList } from '../../types/navigation';

export function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<UserStackParamList>>();
  const { colors, isDark, setMode } = useTheme();
  const { locale, setLocale, t } = useLanguage();
  const { user, logout } = useAuthStore();
  const avatar = user?.avatarUrl ?? 'https://i.pravatar.cc/150?u=alexrivers';

  const handleDarkMode = (enabled: boolean) => {
    void setMode(enabled ? 'dark' : 'light');
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.backgroundSecondary }]} edges={['top']}>
      <AppHeader showBrand showLocation showAvatar avatarUrl={avatar} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.avatarWrap}>
            <Image source={{ uri: avatar }} style={styles.avatar} />
            <Pressable style={[styles.editBtn, { backgroundColor: colors.primary, borderColor: colors.surface }]}>
              <Ionicons name="pencil" size={14} color="#FFF" />
            </Pressable>
          </View>
          <Text style={[styles.name, { color: colors.text }]}>{user?.name ?? 'Alex Rivers'}</Text>
          <Text style={[styles.email, { color: colors.textSecondary }]}>
            {user?.email ?? 'alex.rivers@freshdash.com'}
          </Text>
          <View style={[styles.memberBadge, { backgroundColor: colors.goldMember }]}>
            <Ionicons name="star" size={14} color={colors.goldMemberText} />
            <Text style={[styles.memberText, { color: colors.goldMemberText }]}>
              {t('profile.goldMember')}
            </Text>
          </View>
        </View>

        <ProfileMenuCard
          icon="bag-handle-outline"
          iconBg={colors.iconBgGreen}
          iconColor={colors.primary}
          title={t('profile.myOrders')}
          subtitle={t('profile.myOrdersSub')}
          onPress={() => navigation.navigate('MainTabs', { screen: 'Orders' })}
        />
        <ProfileMenuCard
          icon="location"
          iconBg={colors.iconBgOrange}
          iconColor={colors.accentDark}
          title={t('profile.savedAddresses')}
          subtitle={t('profile.savedAddressesSub')}
          onPress={() => navigation.navigate('AddressList')}
        />
        <ProfileMenuCard
          icon="wallet-outline"
          iconBg={colors.iconBgGrey}
          iconColor={colors.textSecondary}
          title={t('profile.paymentMethods')}
          subtitle={t('profile.paymentMethodsSub')}
        />

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          {t('profile.preferences')}
        </Text>
        <View style={[styles.settingsGroup, { backgroundColor: colors.surface }]}>
          <Pressable
            style={[styles.settingsRow, { borderBottomColor: colors.border }]}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Ionicons name="notifications-outline" size={22} color={colors.textSecondary} />
            <Text style={[styles.settingsLabel, { color: colors.text }]}>{t('profile.notifications')}</Text>
            <View style={[styles.notifBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.notifBadgeText}>2</Text>
            </View>
          </Pressable>
          <Pressable style={[styles.settingsRow, { borderBottomColor: colors.border }]}>
            <Ionicons name="help-circle-outline" size={22} color={colors.textSecondary} />
            <Text style={[styles.settingsLabel, { color: colors.text }]}>{t('profile.helpSupport')}</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </Pressable>
          <SettingsToggleRow
            icon="moon-outline"
            label={t('profile.darkMode')}
            subtitle={t('profile.darkModeSub')}
            value={isDark}
            onValueChange={handleDarkMode}
          />
          <LanguageSelector
            locale={locale}
            label={t('profile.language')}
            englishLabel={t('profile.english')}
            hindiLabel={t('profile.hindi')}
            onChange={(next) => void setLocale(next)}
          />
        </View>

        <Pressable
          style={[styles.logoutBtn, Shadows.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={() => void logout()}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={[styles.logoutText, { color: colors.error }]}>{t('profile.logout')}</Text>
        </Pressable>
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  profileSection: { alignItems: 'center', marginBottom: Spacing.xl },
  avatarWrap: { position: 'relative', marginBottom: Spacing.md },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  editBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
  },
  name: { fontSize: 24, fontWeight: '700' },
  email: { fontSize: 14, marginTop: 4 },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.md,
  },
  memberText: { fontSize: 13, fontWeight: '600' },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  settingsGroup: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.xl,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    gap: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  settingsLabel: { flex: 1, fontSize: 15, fontWeight: '500' },
  notifBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  notifBadgeText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  logoutText: { fontSize: 16, fontWeight: '600' },
});

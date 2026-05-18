import React, { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Spacing } from '../../constants/theme';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNotificationCenter } from '../../contexts/NotificationContext';
import { useTheme } from '../../contexts/ThemeContext';
import { AppHeader } from '../../components/layout/AppHeader';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { NotificationCard } from '../../components/notifications/NotificationCard';
import { EmptyState } from '../../components/ui/EmptyState';
import type { Notification } from '../../types';
import type { UserStackParamList } from '../../types/navigation';

export function NotificationsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<UserStackParamList>>();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { notifications, unreadCount, isLoading, refetch, markRead, markAllRead } =
    useNotificationCenter();

  const { unread, read } = useMemo(() => {
    const u = notifications.filter((n) => !n.read);
    const r = notifications.filter((n) => n.read);
    return { unread: u, read: r };
  }, [notifications]);

  const sections = useMemo(() => {
    const items: ({ type: 'header'; title: string } | { type: 'item'; data: Notification })[] =
      [];
    if (unread.length > 0) {
      items.push({ type: 'header', title: t('notifications.unread') });
      unread.forEach((n) => items.push({ type: 'item', data: n }));
    }
    if (read.length > 0) {
      items.push({ type: 'header', title: t('notifications.earlier') });
      read.forEach((n) => items.push({ type: 'item', data: n }));
    }
    return items;
  }, [unread, read, t]);

  const openNotification = useCallback(
    (item: Notification) => {
      if (!item.read) markRead(item.id);
      if (item.data?.orderId) {
        navigation.navigate('OrderTracking', { orderId: item.data.orderId });
      }
    },
    [markRead, navigation],
  );

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.backgroundSecondary }]}
      edges={['top']}
    >
      <ScreenContainer padded>
        <AppHeader showBack title={t('notifications.title')} />
        <View style={styles.toolbar}>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {unreadCount > 0
              ? t('notifications.unreadCount', { count: unreadCount })
              : t('notifications.allCaughtUp')}
          </Text>
          {unreadCount > 0 && (
            <Pressable onPress={markAllRead} hitSlop={8}>
              <Text style={[styles.markAll, { color: colors.primary }]}>
                {t('notifications.markAllRead')}
              </Text>
            </Pressable>
          )}
        </View>

        {isLoading && notifications.length === 0 ? (
          <ActivityIndicator style={styles.loader} color={colors.primary} />
        ) : notifications.length === 0 ? (
          <EmptyState
            icon="notifications-off-outline"
            title={t('notifications.emptyTitle')}
            description={t('notifications.emptyBody')}
          />
        ) : (
          <FlatList
            data={sections}
            keyExtractor={(item, index) =>
              item.type === 'header' ? `h-${item.title}` : item.data.id
            }
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={refetch}
                tintColor={colors.primary}
              />
            }
            renderItem={({ item }) =>
              item.type === 'header' ? (
                <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
                  {item.title}
                </Text>
              ) : (
                <NotificationCard
                  notification={item.data}
                  onPress={() => openNotification(item.data)}
                />
              )
            }
          />
        )}
      </ScreenContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  subtitle: { fontSize: 14, flex: 1 },
  markAll: { fontSize: 14, fontWeight: '700' },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
  },
  list: { paddingHorizontal: Spacing.lg, paddingBottom: 100 },
  loader: { marginTop: Spacing.xxxl },
});

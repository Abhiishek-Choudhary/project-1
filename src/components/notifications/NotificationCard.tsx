import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NotificationType } from '../../constants/enums';
import { BorderRadius, Spacing } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import type { Notification } from '../../types';
import { formatNotificationTime } from '../../utils/format';
import { cardShadow } from '../../utils/platformLayout';

const TYPE_META: Record<
  NotificationType,
  { icon: keyof typeof Ionicons.glyphMap; color: string; bg: string }
> = {
  [NotificationType.Order]: { icon: 'bag-handle-outline', color: '#1B7A4E', bg: '#E8F5EE' },
  [NotificationType.Delivery]: { icon: 'bicycle-outline', color: '#0369A1', bg: '#E0F2FE' },
  [NotificationType.Promo]: { icon: 'pricetag-outline', color: '#C2410C', bg: '#FFF7ED' },
  [NotificationType.System]: { icon: 'information-circle-outline', color: '#6B7280', bg: '#F3F4F6' },
};

interface NotificationCardProps {
  notification: Notification;
  onPress: () => void;
}

export const NotificationCard = memo(function NotificationCard({
  notification,
  onPress,
}: NotificationCardProps) {
  const { colors, isDark } = useTheme();
  const meta = TYPE_META[notification.type] ?? TYPE_META[NotificationType.System];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        cardShadow(2),
        {
          backgroundColor: colors.surface,
          borderColor: notification.read ? colors.border : colors.primary,
          borderWidth: notification.read ? StyleSheet.hairlineWidth : 1.5,
        },
        pressed && { opacity: 0.92 },
      ]}
    >
      {!notification.read && (
        <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
      )}
      <View style={[styles.iconWrap, { backgroundColor: isDark ? `${meta.color}33` : meta.bg }]}>
        <Ionicons name={meta.icon} size={22} color={meta.color} />
      </View>
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {notification.title}
          </Text>
          <Text style={[styles.time, { color: colors.textMuted }]}>
            {formatNotificationTime(notification.createdAt)}
          </Text>
        </View>
        <Text style={[styles.message, { color: colors.textSecondary }]} numberOfLines={2}>
          {notification.body}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    gap: Spacing.md,
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1, minWidth: 0 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  title: { fontSize: 15, fontWeight: '700', flex: 1 },
  time: { fontSize: 11 },
  message: { fontSize: 13, lineHeight: 18, marginTop: 4 },
});

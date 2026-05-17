import React, { memo, useCallback } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BorderRadius, Shadows, Spacing } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import type { Order } from '../../types';
import { formatCurrency, formatOrderDate } from '../../utils/format';
import { getOrderStatusStyle } from '../../utils/orderStatus';

interface OrderCardProps {
  order: Order;
  trackLabel: string;
  reorderLabel: string;
  itemsLabel: string;
  onTrack: () => void;
  onReorder?: () => void;
}

export const OrderCard = memo(function OrderCard({
  order,
  trackLabel,
  reorderLabel,
  itemsLabel,
  onTrack,
  onReorder,
}: OrderCardProps) {
  const { colors, isDark } = useTheme();
  const statusStyle = getOrderStatusStyle(order.status);
  const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);
  const previewItems = order.items.slice(0, 3);
  const extraCount = order.items.length - previewItems.length;

  const statusBg = isDark ? `${statusStyle.text}22` : statusStyle.bg;
  const statusText = isDark ? statusStyle.text : statusStyle.text;

  const handleReorder = useCallback(
    (e: { stopPropagation?: () => void }) => {
      e.stopPropagation?.();
      onReorder?.();
    },
    [onReorder],
  );

  return (
    <Pressable
      onPress={onTrack}
      style={({ pressed }) => [
        styles.card,
        Shadows.card,
        {
          backgroundColor: colors.surface,
          borderColor: statusStyle.isActive ? `${statusStyle.text}33` : colors.border,
        },
        pressed && { opacity: 0.96 },
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.storeBlock}>
          <View style={[styles.storeIcon, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="storefront-outline" size={18} color={colors.primary} />
          </View>
          <View style={styles.storeText}>
            <Text style={[styles.storeName, { color: colors.text }]} numberOfLines={1}>
              {order.storeName}
            </Text>
            <Text style={[styles.orderId, { color: colors.textMuted }]}>
              #{order.displayId ?? order.id}
            </Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
          <Ionicons name={statusStyle.icon} size={12} color={statusText} />
          <Text style={[styles.statusText, { color: statusText }]}>{statusStyle.label}</Text>
        </View>
      </View>

      <View style={styles.thumbRow}>
        {previewItems.map((line) => (
          <Image
            key={line.productId}
            source={{ uri: line.product.imageUrl }}
            style={[styles.thumb, { borderColor: colors.border }]}
          />
        ))}
        {extraCount > 0 && (
          <View style={[styles.moreThumb, { backgroundColor: colors.backgroundSecondary }]}>
            <Text style={[styles.moreText, { color: colors.textSecondary }]}>+{extraCount}</Text>
          </View>
        )}
        <View style={styles.summaryBlock}>
          <Text style={[styles.itemsLine, { color: colors.text }]}>
            {itemCount} {itemsLabel} • {formatCurrency(order.summary.total)}
          </Text>
          <Text style={[styles.dateLine, { color: colors.textMuted }]}>
            {formatOrderDate(order.createdAt)}
          </Text>
        </View>
      </View>

      {order.estimatedDelivery && statusStyle.isActive && (
        <View style={[styles.etaRow, { backgroundColor: colors.primaryLight }]}>
          <Ionicons name="flash-outline" size={16} color={colors.primary} />
          <Text style={[styles.etaText, { color: colors.primary }]}>
            ETA {order.estimatedDelivery}
            {order.estimatedDeliveryWindow ? ` • ${order.estimatedDeliveryWindow}` : ''}
          </Text>
        </View>
      )}

      {order.deliveryPartner && statusStyle.isActive && (
        <View style={[styles.riderRow, { borderTopColor: colors.borderLight }]}>
          <Image source={{ uri: order.deliveryPartner.avatarUrl }} style={styles.riderAvatar} />
          <View style={styles.riderText}>
            <Text style={[styles.riderLabel, { color: colors.textMuted }]}>Delivery partner</Text>
            <Text style={[styles.riderName, { color: colors.text }]}>{order.deliveryPartner.name}</Text>
          </View>
          <View style={[styles.ratingPill, { backgroundColor: colors.ratingBg }]}>
            <Ionicons name="star" size={12} color={colors.ratingText} />
            <Text style={[styles.ratingText, { color: colors.ratingText }]}>
              {order.deliveryPartner.rating.toFixed(1)}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.actions}>
        <Pressable
          onPress={onTrack}
          style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
        >
          <Ionicons name="navigate-outline" size={16} color="#FFF" />
          <Text style={styles.primaryBtnText}>{trackLabel}</Text>
        </Pressable>
        {onReorder && (
          <Pressable
            onPress={handleReorder}
            style={[styles.secondaryBtn, { borderColor: colors.border, backgroundColor: colors.backgroundSecondary }]}
          >
            <Ionicons name="refresh-outline" size={16} color={colors.text} />
            <Text style={[styles.secondaryBtnText, { color: colors.text }]}>{reorderLabel}</Text>
          </Pressable>
        )}
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  storeBlock: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: Spacing.sm },
  storeIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeText: { flex: 1 },
  storeName: { fontSize: 16, fontWeight: '700' },
  orderId: { fontSize: 12, marginTop: 2 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    maxWidth: '46%',
  },
  statusText: { fontSize: 11, fontWeight: '700' },
  thumbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  thumb: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  moreThumb: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreText: { fontSize: 12, fontWeight: '700' },
  summaryBlock: { flex: 1, marginLeft: Spacing.xs },
  itemsLine: { fontSize: 14, fontWeight: '600' },
  dateLine: { fontSize: 12, marginTop: 4 },
  etaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  etaText: { fontSize: 13, fontWeight: '600', flex: 1 },
  riderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingTop: Spacing.md,
    marginBottom: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  riderAvatar: { width: 36, height: 36, borderRadius: 18 },
  riderText: { flex: 1 },
  riderLabel: { fontSize: 11 },
  riderName: { fontSize: 14, fontWeight: '600', marginTop: 2 },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  ratingText: { fontSize: 12, fontWeight: '700' },
  actions: { flexDirection: 'row', gap: Spacing.sm },
  primaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  primaryBtnText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  secondaryBtnText: { fontSize: 14, fontWeight: '600' },
});

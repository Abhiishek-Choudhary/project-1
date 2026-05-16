import React, { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRoute, type RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Shadows, Spacing } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { AppHeader } from '../../components/layout/AppHeader';
import { useAuthStore } from '../../store/authStore';
import { useToast } from '../../contexts/ToastContext';
import { MOCK_DELIVERY_ORDER_DETAIL } from '../../api/deliveryMockData';
import { formatCurrency } from '../../utils/format';
import type { DeliveryStackParamList } from '../../types/navigation';

export function DeliveryOrderDetailScreen() {
  const route = useRoute<RouteProp<DeliveryStackParamList, 'DeliveryOrderDetail'>>();
  const { colors } = useTheme();
  const user = useAuthStore((s) => s.user);
  const { showToast } = useToast();
  const order = MOCK_DELIVERY_ORDER_DETAIL;
  const [pickupDone, setPickupDone] = useState(order.pickupConfirmed);

  const handleConfirmPickup = () => {
    setPickupDone(true);
    showToast('Pickup confirmed!', 'success');
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.backgroundSecondary }]} edges={['top']}>
      <AppHeader
        showBack
        title={`Order #${order.displayId}`}
        titleColor={colors.primary}
        showAvatar
        avatarUrl={user?.avatarUrl}
      />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.mapSection}>
          <Image source={{ uri: order.mapImageUrl }} style={styles.mapImage} />
          <View style={[styles.etaCard, Shadows.card, { backgroundColor: colors.surface }]}>
            <View style={[styles.etaIcon, { backgroundColor: colors.primary }]}>
              <Text style={{ color: '#FFF', fontWeight: '800', fontSize: 12 }}>A</Text>
            </View>
            <View>
              <Text style={[styles.etaLabel, { color: colors.textSecondary }]}>ESTIMATED DELIVERY</Text>
              <Text style={[styles.etaValue, { color: colors.primary }]}>{order.estimatedMinutes}</Text>
            </View>
          </View>
          <View style={[styles.distanceBadge, { backgroundColor: '#8D4004' }]}>
            <Text style={styles.distanceText}>{order.distanceMiles} Miles</Text>
          </View>
        </View>

        <View style={[styles.routeCard, Shadows.card, { backgroundColor: colors.surface }]}>
          <View style={styles.routeRow}>
            <View style={styles.routeLeft}>
              <View style={[styles.routeDot, { backgroundColor: colors.primary }]}>
                <Ionicons name="storefront" size={16} color="#FFF" />
              </View>
              <View style={styles.routeLine} />
              <View style={[styles.routeDot, { backgroundColor: colors.accent }]}>
                <Ionicons name="location" size={16} color="#FFF" />
              </View>
            </View>
            <View style={styles.routeContent}>
              <View style={styles.routeStop}>
                <View style={styles.routeStopHeader}>
                  <Text style={[styles.routeLabel, { color: colors.primary }]}>PICKUP FROM</Text>
                  <Pressable hitSlop={8}>
                    <Ionicons name="call" size={20} color={colors.textSecondary} />
                  </Pressable>
                </View>
                <Text style={[styles.routeTitle, { color: colors.text }]}>{order.pickup.storeName}</Text>
                <Text style={{ color: colors.textSecondary, fontSize: 13 }}>{order.pickup.address}</Text>
              </View>
              <View style={[styles.routeStop, { marginTop: Spacing.xl }]}>
                <View style={styles.routeStopHeader}>
                  <Text style={[styles.routeLabel, { color: colors.accentDark }]}>DELIVER TO</Text>
                  <Pressable hitSlop={8}>
                    <Ionicons name="chatbubble-outline" size={20} color={colors.textSecondary} />
                  </Pressable>
                </View>
                <Text style={[styles.routeTitle, { color: colors.text }]}>{order.delivery.customerName}</Text>
                <Text style={{ color: colors.textSecondary, fontSize: 13 }}>{order.delivery.address}</Text>
              </View>
            </View>
          </View>
          <View style={[styles.instructionsBox, { backgroundColor: colors.infoLight }]}>
            <Ionicons name="information-circle" size={18} color={colors.accentDark} />
            <Text style={[styles.instructions, { color: colors.text }]}>
              "{order.delivery.instructions}"
            </Text>
          </View>
        </View>

        <View style={[styles.itemsCard, Shadows.card, { backgroundColor: colors.surface }]}>
          <View style={styles.itemsHeader}>
            <View style={styles.itemsTitleRow}>
              <Ionicons name="cube-outline" size={20} color={colors.primary} />
              <Text style={[styles.itemsTitle, { color: colors.text }]}>Order Items</Text>
            </View>
            <View style={[styles.itemsBadge, { backgroundColor: colors.infoLight }]}>
              <Text style={{ color: colors.infoText, fontWeight: '700', fontSize: 12 }}>
                {order.items.length} Items
              </Text>
            </View>
          </View>
          {order.items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Image source={{ uri: item.imageUrl }} style={styles.itemImg} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
                <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{item.unit}</Text>
              </View>
              <Text style={[styles.itemQty, { color: colors.primary }]}>x{item.quantity}</Text>
            </View>
          ))}
          <View style={[styles.divider, { borderColor: colors.border }]} />
          <View style={styles.summaryRow}>
            <Text style={{ color: colors.textSecondary }}>Subtotal</Text>
            <Text style={{ color: colors.text, fontWeight: '600' }}>
              {formatCurrency(order.subtotal)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.earnLabel, { color: colors.primary }]}>Driver Earnings</Text>
            <Text style={[styles.earnValue, { color: colors.primary }]}>
              {formatCurrency(order.driverEarnings)}
            </Text>
          </View>
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <Pressable style={[styles.supportBtn, { backgroundColor: colors.infoLight }]}>
          <Ionicons name="headset" size={22} color={colors.infoText} />
        </Pressable>
        {!pickupDone ? (
          <Pressable style={styles.confirmWrap} onPress={handleConfirmPickup}>
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.confirmBtn}
            >
              <Text style={styles.confirmText}>Confirm Pick Up</Text>
              <Ionicons name="arrow-forward" size={22} color="#FFF" />
            </LinearGradient>
          </Pressable>
        ) : (
          <Pressable style={[styles.confirmWrap, { backgroundColor: colors.primary, borderRadius: BorderRadius.lg }]}>
            <Text style={[styles.confirmText, { textAlign: 'center', flex: 1 }]}>Confirm Delivery</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingBottom: Spacing.lg },
  mapSection: { position: 'relative', height: 200, marginBottom: Spacing.lg },
  mapImage: { width: '100%', height: '100%' },
  etaCard: {
    position: 'absolute',
    top: Spacing.lg,
    left: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  etaIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  etaLabel: { fontSize: 10, fontWeight: '600', letterSpacing: 0.5 },
  etaValue: { fontSize: 16, fontWeight: '700' },
  distanceBadge: {
    position: 'absolute',
    top: Spacing.lg,
    right: Spacing.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  distanceText: { color: '#FFF', fontWeight: '700', fontSize: 13 },
  routeCard: { marginHorizontal: Spacing.lg, padding: Spacing.lg, borderRadius: BorderRadius.lg, marginBottom: Spacing.lg },
  routeRow: { flexDirection: 'row', gap: Spacing.md },
  routeLeft: { alignItems: 'center', width: 32 },
  routeDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeLine: {
    width: 2,
    flex: 1,
    minHeight: 40,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginVertical: 4,
  },
  routeContent: { flex: 1 },
  routeStop: {},
  routeStopHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  routeLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 0.3 },
  routeTitle: { fontSize: 16, fontWeight: '700', marginTop: 4 },
  instructionsBox: {
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.lg,
  },
  instructions: { flex: 1, fontSize: 13, fontStyle: 'italic', lineHeight: 18 },
  itemsCard: { marginHorizontal: Spacing.lg, padding: Spacing.lg, borderRadius: BorderRadius.lg },
  itemsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  itemsTitleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  itemsTitle: { fontSize: 17, fontWeight: '700' },
  itemsBadge: { paddingHorizontal: Spacing.md, paddingVertical: 4, borderRadius: BorderRadius.full },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.md },
  itemImg: { width: 48, height: 48, borderRadius: BorderRadius.sm },
  itemName: { fontSize: 14, fontWeight: '600' },
  itemQty: { fontSize: 15, fontWeight: '700' },
  divider: { borderTopWidth: 1, borderStyle: 'dashed', marginVertical: Spacing.md },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  earnLabel: { fontWeight: '700' },
  earnValue: { fontSize: 16, fontWeight: '700' },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  supportBtn: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmWrap: { flex: 1 },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  confirmText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});

import React, { useEffect, useState } from 'react';
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
import { OrderStatus } from '../../constants/enums';
import { BorderRadius, Shadows, Spacing } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { AppHeader } from '../../components/layout/AppHeader';
import { OrderStepper, type TrackingStep } from '../../components/order/OrderStepper';
import { Loader } from '../../components/ui/Loader';
import { useOrder } from '../../hooks/useOrders';
import { useSocket } from '../../contexts/SocketContext';
import { useAuthStore } from '../../store/authStore';
import { formatCurrency } from '../../utils/format';
import type { UserStackParamList } from '../../types/navigation';

function statusToStep(status: OrderStatus): TrackingStep {
  switch (status) {
    case OrderStatus.Confirmed:
    case OrderStatus.Pending:
      return 'ordered';
    case OrderStatus.Preparing:
      return 'packed';
    case OrderStatus.ReadyForPickup:
    case OrderStatus.OutForDelivery:
      return 'in_transit';
    case OrderStatus.Delivered:
      return 'delivered';
    default:
      return 'in_transit';
  }
}

export function OrderTrackingScreen() {
  const route = useRoute<RouteProp<UserStackParamList, 'OrderTracking'>>();
  const { colors } = useTheme();
  const user = useAuthStore((s) => s.user);
  const { data: order, isLoading } = useOrder(route.params.orderId);
  const { subscribeOrder, isConnected } = useSocket();
  const [status, setStatus] = useState<OrderStatus | null>(null);
  const [summaryExpanded, setSummaryExpanded] = useState(false);

  useEffect(() => {
    if (!order) return;
    setStatus(order.status);
    return subscribeOrder(order.id, (payload) => setStatus(payload.status));
  }, [order, subscribeOrder]);

  if (isLoading || !order) return <Loader fullScreen />;

  const currentStatus = status ?? order.status;
  const currentStep = statusToStep(currentStatus);
  const displayId = order.displayId ?? order.id;
  const partner = order.deliveryPartner;
  const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.backgroundSecondary }]} edges={['top']}>
      <AppHeader
        showBack
        title={`Order #${displayId}`}
        titleColor={colors.primary}
        showHelp
        showAvatar
        avatarUrl={user?.avatarUrl}
      />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.etaCard, Shadows.card, { backgroundColor: colors.surface }]}>
          <View style={styles.etaTop}>
            <View>
              <Text style={[styles.etaLabel, { color: colors.textSecondary }]}>ESTIMATED DELIVERY</Text>
              <Text style={[styles.etaTime, { color: colors.primary }]}>
                {order.estimatedDeliveryWindow ?? order.estimatedDelivery ?? '12:45 PM – 1:00 PM'}
              </Text>
            </View>
            {order.isOnTime !== false && (
              <View style={[styles.onTimeBadge, { backgroundColor: colors.primaryLight }]}>
                <Text style={[styles.onTimeText, { color: colors.primary }]}>On Time</Text>
              </View>
            )}
          </View>
          <OrderStepper currentStep={currentStep} />
          {!isConnected && (
            <Text style={[styles.offline, { color: colors.warning }]}>
              Reconnecting to live updates...
            </Text>
          )}
        </View>

        <LinearGradient
          colors={[colors.mapOverlay, colors.primaryLight]}
          style={styles.mapSection}
        >
          <View style={styles.riderBadge}>
            <Text style={[styles.riderBadgeText, { color: colors.primary }]}>RIDER IS NEAR</Text>
            <View style={[styles.riderIcon, { backgroundColor: colors.primary }]}>
              <Ionicons name="bicycle" size={28} color="#FFF" />
            </View>
          </View>
          <View style={[styles.phoneMock, { backgroundColor: colors.surface }]}>
            <View style={[styles.phoneScreen, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="map" size={48} color={colors.primary} style={{ opacity: 0.4 }} />
              <Ionicons name="bicycle" size={32} color={colors.primary} style={styles.scooterOnMap} />
            </View>
          </View>
          <View style={styles.mapControls}>
            <Pressable style={[styles.mapCtrlBtn, { backgroundColor: colors.surface }]}>
              <Ionicons name="locate" size={20} color={colors.primary} />
            </Pressable>
            <Pressable style={[styles.mapCtrlBtn, { backgroundColor: colors.surface }]}>
              <Ionicons name="search" size={20} color={colors.primary} />
            </Pressable>
          </View>
        </LinearGradient>

        {partner && (
          <View style={[styles.partnerCard, Shadows.card, { backgroundColor: colors.surface }]}>
            <View style={styles.partnerLeft}>
              <View style={styles.partnerImgWrap}>
                <Image source={{ uri: partner.avatarUrl }} style={styles.partnerImg} />
                <View style={[styles.ratingBadge, { backgroundColor: colors.accent }]}>
                  <Text style={styles.ratingText}>{partner.rating} ★</Text>
                </View>
              </View>
              <View>
                <Text style={[styles.partnerName, { color: colors.text }]}>{partner.name}</Text>
                <Text style={[styles.partnerTitle, { color: colors.textSecondary }]}>
                  {partner.title}
                </Text>
              </View>
            </View>
            <View style={styles.partnerActions}>
              <Pressable style={[styles.actionBtn, { backgroundColor: colors.infoLight }]}>
                <Ionicons name="chatbubble-outline" size={20} color={colors.infoText} />
              </Pressable>
              <Pressable style={[styles.actionBtn, { backgroundColor: colors.primary }]}>
                <Ionicons name="call" size={20} color="#FFF" />
              </Pressable>
            </View>
          </View>
        )}

        <Pressable
          style={[styles.summaryCard, Shadows.card, { backgroundColor: colors.surface }]}
          onPress={() => setSummaryExpanded((v) => !v)}
        >
          <View style={styles.summaryHeader}>
            <View style={[styles.receiptIcon, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="receipt-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.summaryTitleWrap}>
              <Text style={[styles.summaryTitle, { color: colors.text }]}>Order Summary</Text>
              <Text style={[styles.summarySub, { color: colors.textSecondary }]}>
                {itemCount} items • Total {formatCurrency(order.summary.total)}
              </Text>
            </View>
            <Ionicons
              name={summaryExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={colors.textMuted}
            />
          </View>
          <View style={styles.thumbnails}>
            {order.items.slice(0, 3).map((item) => (
              <Image
                key={item.productId}
                source={{ uri: item.product.imageUrl }}
                style={styles.thumb}
              />
            ))}
            {order.items.length > 3 && (
              <View style={[styles.thumbMore, { backgroundColor: colors.borderLight }]}>
                <Text style={{ color: colors.textSecondary, fontWeight: '600' }}>
                  +{order.items.length - 3}
                </Text>
              </View>
            )}
          </View>
          {summaryExpanded && (
            <View style={styles.summaryDetails}>
              {order.items.map((item) => (
                <Text key={item.productId} style={{ color: colors.textSecondary, fontSize: 13 }}>
                  {item.quantity}x {item.product.name}
                </Text>
              ))}
            </View>
          )}
        </Pressable>
        <View style={{ height: 100 }} />
      </ScrollView>

      <Pressable style={[styles.supportFab, { backgroundColor: colors.supportFab }, Shadows.floating]}>
        <Ionicons name="headset" size={26} color="#FFF" />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: Spacing.lg },
  etaCard: { borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.lg },
  etaTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  etaLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 0.5 },
  etaTime: { fontSize: 22, fontWeight: '700', marginTop: 4 },
  onTimeBadge: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full },
  onTimeText: { fontSize: 12, fontWeight: '700' },
  offline: { fontSize: 12, marginTop: Spacing.sm, textAlign: 'center' },
  mapSection: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    minHeight: 220,
    position: 'relative',
  },
  riderBadge: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.lg },
  riderBadgeText: { fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
  riderIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneMock: {
    width: 140,
    height: 200,
    borderRadius: 20,
    padding: 8,
    ...Shadows.card,
  },
  phoneScreen: {
    flex: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  scooterOnMap: { position: 'absolute', bottom: 24, right: 20 },
  mapControls: { position: 'absolute', right: Spacing.lg, top: '40%', gap: Spacing.sm },
  mapCtrlBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.card,
  },
  partnerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  partnerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, flex: 1 },
  partnerImgWrap: { position: 'relative' },
  partnerImg: { width: 56, height: 56, borderRadius: BorderRadius.md },
  ratingBadge: {
    position: 'absolute',
    bottom: -4,
    left: 0,
    right: 0,
    paddingVertical: 2,
    borderRadius: 4,
    alignItems: 'center',
  },
  ratingText: { color: '#FFF', fontSize: 10, fontWeight: '700' },
  partnerName: { fontSize: 16, fontWeight: '700' },
  partnerTitle: { fontSize: 13, marginTop: 2 },
  partnerActions: { flexDirection: 'row', gap: Spacing.sm },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCard: { borderRadius: BorderRadius.lg, padding: Spacing.lg },
  summaryHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  receiptIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryTitleWrap: { flex: 1 },
  summaryTitle: { fontSize: 16, fontWeight: '700' },
  summarySub: { fontSize: 13, marginTop: 2 },
  thumbnails: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md },
  thumb: { width: 48, height: 48, borderRadius: BorderRadius.sm },
  thumbMore: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryDetails: { marginTop: Spacing.md, gap: 4 },
  supportFab: {
    position: 'absolute',
    bottom: 100,
    right: Spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

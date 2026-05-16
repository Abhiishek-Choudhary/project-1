import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Shadows, Spacing } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { VendorHeader } from '../../components/layout/VendorHeader';
import {
  MOCK_VENDOR_INVENTORY_ALERTS,
  MOCK_VENDOR_RECENT_ORDERS,
  MOCK_VENDOR_STATS,
} from '../../api/vendorMockData';
import { formatCurrency } from '../../utils/format';
import type { VendorStackParamList, VendorTabParamList } from '../../types/navigation';

type VendorDashNav = CompositeNavigationProp<
  BottomTabNavigationProp<VendorTabParamList, 'VendorDashboard'>,
  NativeStackNavigationProp<VendorStackParamList>
>;

const STATUS_COLORS = {
  new: { bg: '#E8F5EE', text: '#1B7A4E' },
  preparing: { bg: '#FFF7ED', text: '#EA580C' },
  on_way: { bg: '#E0F2FE', text: '#0369A1' },
};

export function VendorDashboardScreen() {
  const navigation = useNavigation<VendorDashNav>();
  const { colors } = useTheme();
  const stats = MOCK_VENDOR_STATS;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.backgroundSecondary }]} edges={['top']}>
      <VendorHeader />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, Shadows.card, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Today's Revenue</Text>
            <Text style={[styles.statValueGreen, { color: colors.primary }]}>
              {formatCurrency(stats.todayRevenue)}
            </Text>
            <Text style={[styles.statSub, { color: colors.success }]}>
              ↑ +{stats.revenueChange}% from yesterday
            </Text>
            <Ionicons name="cash-outline" size={40} color={colors.primaryLight} style={styles.statIcon} />
          </View>
        </View>
        <View style={styles.statsRowHalf}>
          <View style={[styles.statCardHalf, Shadows.card, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Active Orders</Text>
            <Text style={[styles.statValueBrown, { color: '#8D4004' }]}>{stats.activeOrders}</Text>
            <View style={[styles.iconCircle, { backgroundColor: '#FFF7ED' }]}>
              <Ionicons name="cart-outline" size={22} color="#EA580C" />
            </View>
          </View>
          <View style={[styles.statCardHalf, Shadows.card, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>In Delivery</Text>
            <Text style={[styles.statValueGreen, { color: colors.primary }]}>{stats.inDelivery}</Text>
            <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="car-outline" size={22} color={colors.primary} />
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Orders</Text>
          <Pressable>
            <Text style={{ color: colors.primary, fontWeight: '600' }}>View All ›</Text>
          </Pressable>
        </View>

        {MOCK_VENDOR_RECENT_ORDERS.map((order) => {
          const sc = STATUS_COLORS[order.status];
          return (
            <View key={order.id} style={[styles.orderCard, Shadows.card, { backgroundColor: colors.surface }]}>
              <View style={styles.orderTop}>
                <View style={[styles.orderIcon, { backgroundColor: sc.bg }]}>
                  <Ionicons
                    name={
                      order.status === 'new'
                        ? 'document-text-outline'
                        : order.status === 'preparing'
                          ? 'restaurant-outline'
                          : 'car-outline'
                    }
                    size={22}
                    color={sc.text}
                  />
                </View>
                <View style={styles.orderInfo}>
                  <Text style={[styles.orderId, { color: colors.text }]}>#{order.id}</Text>
                  <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
                    {order.itemCount} Items • {formatCurrency(order.total)} • {order.timeAgo}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
                  <Text style={[styles.statusText, { color: sc.text }]}>{order.statusLabel}</Text>
                </View>
              </View>
              {order.status === 'new' && (
                <View style={styles.orderActions}>
                  <Pressable style={[styles.rejectBtn, { borderColor: colors.error }]}>
                    <Text style={{ color: colors.error, fontWeight: '700' }}>Reject</Text>
                  </Pressable>
                  <Pressable style={[styles.acceptBtn, { backgroundColor: colors.primary }]}>
                    <Text style={styles.acceptText}>Accept Order</Text>
                  </Pressable>
                </View>
              )}
              {order.status === 'preparing' && (
                <Pressable style={[styles.readyBtn, { backgroundColor: colors.infoLight }]}>
                  <Text style={{ color: colors.infoText, fontWeight: '700' }}>Ready for Pickup</Text>
                </Pressable>
              )}
              {order.status === 'on_way' && (
                <Text style={{ color: colors.primary, fontWeight: '600', marginTop: Spacing.sm }}>
                  Tracking Live
                </Text>
              )}
            </View>
          );
        })}

        <View style={[styles.alertCard, Shadows.card, { backgroundColor: colors.surface }]}>
          <View style={styles.alertHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Inventory Alert</Text>
            <Ionicons name="warning" size={22} color={colors.error} />
          </View>
          <View style={styles.alertSub}>
            <Ionicons name="cube-outline" size={16} color={colors.error} />
            <Text style={{ color: colors.error, fontWeight: '600' }}>4 Items Running Low</Text>
          </View>
          {MOCK_VENDOR_INVENTORY_ALERTS.map((item) => (
            <View key={item.id} style={styles.alertItem}>
              <Image source={{ uri: item.imageUrl }} style={styles.alertImg} />
              <Text style={{ flex: 1, color: colors.text, fontWeight: '500' }}>{item.name}</Text>
              <Text
                style={{
                  color: item.stockLeft <= 10 ? colors.error : colors.textSecondary,
                  fontSize: 13,
                }}
              >
                {item.stockLeft <= 10 ? `Only ${item.stockLeft} units left` : `Stock: ${item.stockLeft} units`}
              </Text>
              <Pressable style={[styles.alertAdd, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="add" size={18} color={colors.primary} />
              </Pressable>
            </View>
          ))}
          <Pressable onPress={() => navigation.navigate('VendorInventory')}>
            <Text style={[styles.manageLink, { color: colors.primary }]}>Manage Full Inventory</Text>
          </Pressable>
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
      <Pressable
        style={[styles.fab, { backgroundColor: '#8D4004' }, Shadows.floating]}
        onPress={() => navigation.getParent()?.navigate('VendorProductForm', {})}
      >
        <Ionicons name="add" size={28} color="#FFF" />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: Spacing.lg },
  statsRow: { marginBottom: Spacing.md },
  statCard: { padding: Spacing.lg, borderRadius: BorderRadius.lg, position: 'relative' },
  statCardHalf: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    position: 'relative',
    minHeight: 100,
  },
  statsRowHalf: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.xl },
  statLabel: { fontSize: 13 },
  statValueGreen: { fontSize: 28, fontWeight: '700', marginTop: 4 },
  statValueBrown: { fontSize: 28, fontWeight: '700', marginTop: 4 },
  statSub: { fontSize: 12, marginTop: 4 },
  statIcon: { position: 'absolute', right: Spacing.lg, top: Spacing.lg, opacity: 0.5 },
  iconCircle: {
    position: 'absolute',
    right: Spacing.md,
    bottom: Spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  orderCard: { padding: Spacing.lg, borderRadius: BorderRadius.lg, marginBottom: Spacing.md },
  orderTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  orderIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderInfo: { flex: 1 },
  orderId: { fontSize: 15, fontWeight: '700' },
  statusBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: BorderRadius.full },
  statusText: { fontSize: 10, fontWeight: '700' },
  orderActions: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.md },
  rejectBtn: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  acceptBtn: {
    flex: 1.5,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  acceptText: { color: '#FFF', fontWeight: '700' },
  readyBtn: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  alertCard: { padding: Spacing.lg, borderRadius: BorderRadius.lg, marginTop: Spacing.md },
  alertHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  alertSub: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginVertical: Spacing.md },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  alertImg: { width: 40, height: 40, borderRadius: BorderRadius.sm },
  alertAdd: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  manageLink: { textAlign: 'center', fontWeight: '600', marginTop: Spacing.lg },
  fab: {
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

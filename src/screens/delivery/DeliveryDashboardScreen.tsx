import React, { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Shadows, Spacing } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { VendorHeader } from '../../components/layout/VendorHeader';
import {
  MOCK_DELIVERY_ACTIVE,
  MOCK_DELIVERY_HOTSPOTS,
  MOCK_DELIVERY_STATS,
} from '../../api/deliveryMockData';
import { formatCurrency } from '../../utils/format';
import type { DeliveryStackParamList } from '../../types/navigation';

export function DeliveryDashboardScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<DeliveryStackParamList>>();
  const { colors } = useTheme();
  const [isOnline, setIsOnline] = useState(true);
  const stats = MOCK_DELIVERY_STATS;
  const active = MOCK_DELIVERY_ACTIVE;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.backgroundSecondary }]} edges={['top']}>
      <VendorHeader showOnlineToggle isOnline={isOnline} onToggleOnline={setIsOnline} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.statCard, Shadows.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Earnings Today</Text>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {formatCurrency(stats.earningsToday)}
          </Text>
          <Text style={{ color: colors.success, fontSize: 13, marginTop: 4 }}>
            ↑ +{stats.earningsChange}% from yesterday
          </Text>
        </View>
        <View style={styles.statRow}>
          <View style={[styles.statHalf, Shadows.card, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Deliveries</Text>
            <Text style={[styles.statValueSm, { color: colors.text }]}>{stats.deliveriesCount}</Text>
            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
              ✓ {stats.completionRate}% completion rate
            </Text>
          </View>
          <View style={[styles.statHalf, Shadows.card, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Time Online</Text>
            <Text style={[styles.statValueSm, { color: colors.text }]}>{stats.timeOnline}</Text>
            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
              Shift ends in {stats.shiftEndsIn}
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Active Delivery</Text>
          <View style={[styles.inProgressBadge, { backgroundColor: '#FFF7ED' }]}>
            <Text style={{ color: colors.accent, fontWeight: '700', fontSize: 11 }}>In Progress</Text>
          </View>
        </View>

        <Pressable
          style={[styles.activeCard, { borderColor: colors.primary, backgroundColor: colors.surface }]}
          onPress={() => navigation.getParent()?.navigate('DeliveryOrderDetail', { assignmentId: 'd2' })}
        >
          <View style={styles.mapWrap}>
            <Image source={{ uri: active.mapImageUrl }} style={styles.mapImg} />
            <View style={[styles.etaBadge, { backgroundColor: colors.primaryDark }]}>
              <Ionicons name="navigate" size={12} color="#FFF" />
              <Text style={styles.etaText}>ETA: {active.etaMinutes} mins</Text>
            </View>
          </View>
          <View style={styles.activeBody}>
            <View style={styles.customerRow}>
              <View style={[styles.avatarPlaceholder, { backgroundColor: colors.infoLight }]}>
                <Ionicons name="person" size={24} color={colors.infoText} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.customerName, { color: colors.text }]}>{active.customerName}</Text>
                <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
                  Order #{active.displayId} • {active.itemCount} items
                </Text>
              </View>
              <Pressable style={[styles.callBtn, { backgroundColor: colors.primary }]}>
                <Ionicons name="call" size={18} color="#FFF" />
              </Pressable>
            </View>
            <View style={styles.addressBlock}>
              <Ionicons name="location" size={16} color={colors.primary} />
              <View>
                <Text style={[styles.addressLabel, { color: colors.textSecondary }]}>DELIVERY ADDRESS</Text>
                <Text style={[styles.addressLine, { color: colors.text }]}>{active.addressLine1}</Text>
                <Text style={{ color: colors.textSecondary, fontSize: 13 }}>{active.addressLine2}</Text>
              </View>
            </View>
            <View style={styles.activeActions}>
              <Pressable
                style={[styles.detailsBtn, { backgroundColor: colors.borderLight }]}
                onPress={() =>
                  navigation.getParent()?.navigate('DeliveryOrderDetail', { assignmentId: 'd2' })
                }
              >
                <Text style={{ color: colors.text, fontWeight: '600' }}>Order Details</Text>
              </Pressable>
              <Pressable style={[styles.arrivedBtn, { backgroundColor: colors.primary }]}>
                <Ionicons name="checkmark-circle" size={18} color="#FFF" />
                <Text style={styles.arrivedText}>Arrived at Customer</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>

        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: Spacing.xl }]}>
          Nearby Hotspots
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {MOCK_DELIVERY_HOTSPOTS.map((h) => (
            <View
              key={h.id}
              style={[styles.hotspotCard, { backgroundColor: colors.borderLight }]}
            >
              <View style={[styles.hotspotIcon, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="flame" size={20} color={colors.primary} />
              </View>
              <Text style={[styles.hotspotName, { color: colors.text }]}>{h.name}</Text>
              <Text style={{ color: colors.success, fontWeight: '700' }}>
                + {formatCurrency(h.surgeBonus)} Surge
              </Text>
            </View>
          ))}
        </ScrollView>
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: Spacing.lg },
  statCard: { padding: Spacing.lg, borderRadius: BorderRadius.lg, marginBottom: Spacing.md },
  statRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.xl },
  statHalf: { flex: 1, padding: Spacing.lg, borderRadius: BorderRadius.lg },
  statLabel: { fontSize: 13 },
  statValue: { fontSize: 32, fontWeight: '700', marginTop: 4 },
  statValueSm: { fontSize: 24, fontWeight: '700', marginTop: 4 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  inProgressBadge: { paddingHorizontal: Spacing.md, paddingVertical: 4, borderRadius: BorderRadius.full },
  activeCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    overflow: 'hidden',
    ...Shadows.card,
  },
  mapWrap: { position: 'relative', height: 140 },
  mapImg: { width: '100%', height: '100%' },
  etaBadge: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  etaText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  activeBody: { padding: Spacing.lg },
  customerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customerName: { fontSize: 16, fontWeight: '700' },
  callBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressBlock: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.lg },
  addressLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  addressLine: { fontSize: 15, fontWeight: '700', marginTop: 2 },
  activeActions: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.lg },
  detailsBtn: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  arrivedBtn: {
    flex: 1.4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  arrivedText: { color: '#FFF', fontWeight: '700', fontSize: 13 },
  hotspotCard: {
    width: 160,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginRight: Spacing.md,
  },
  hotspotIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  hotspotName: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
});

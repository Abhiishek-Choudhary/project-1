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
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Shadows, Spacing } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { AppHeader } from '../../components/layout/AppHeader';
import { useCart } from '../../hooks/useCart';
import { useCreateOrder } from '../../hooks/useOrders';
import { useToast } from '../../contexts/ToastContext';
import { useAuthStore } from '../../store/authStore';
import {
  MOCK_CHECKOUT_ADDRESS,
  MOCK_CHECKOUT_ITEMS,
  MOCK_CHECKOUT_SUMMARY,
  MOCK_DELIVERY_SLOTS,
} from '../../api/mockData';
import { formatINR } from '../../utils/format';
import type { UserStackParamList } from '../../types/navigation';

type PaymentMethod = 'upi' | 'card' | 'cod';

function SectionHeader({
  icon,
  title,
  action,
  onAction,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.sectionHeader}>
      <View style={[styles.sectionIcon, { backgroundColor: colors.primaryLight }]}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      {action && (
        <Pressable onPress={onAction}>
          <Text style={[styles.sectionAction, { color: colors.primary }]}>{action}</Text>
        </Pressable>
      )}
    </View>
  );
}

export function CheckoutScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<UserStackParamList>>();
  const { colors } = useTheme();
  const user = useAuthStore((s) => s.user);
  const { clearCart } = useCart();
  const createOrder = useCreateOrder();
  const { showToast } = useToast();

  const [selectedSlot, setSelectedSlot] = useState(MOCK_DELIVERY_SLOTS[0]!.id);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [couponApplied, setCouponApplied] = useState(true);
  const summary = MOCK_CHECKOUT_SUMMARY;

  const handlePlaceOrder = async () => {
    try {
      const order = await createOrder.mutateAsync({
        paymentMethod,
        deliverySlotId: selectedSlot,
        couponCode: couponApplied ? summary.couponCode : undefined,
      });
      clearCart();
      showToast('Order placed successfully!', 'success');
      navigation.replace('OrderTracking', { orderId: order.id });
    } catch {
      showToast('Failed to place order', 'error');
    }
  };

  const paymentOptions: {
    id: PaymentMethod;
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle: string;
  }[] = [
    { id: 'upi', icon: 'qr-code-outline', title: 'Unified Payment Interface (UPI)', subtitle: 'GooglePay, PhonePe, Paytm' },
    { id: 'card', icon: 'card-outline', title: 'Credit / Debit Cards', subtitle: 'Visa, Mastercard, RuPay' },
    { id: 'cod', icon: 'cash-outline', title: 'Cash on Delivery', subtitle: 'Pay at your doorstep' },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.backgroundSecondary }]} edges={['top']}>
      <AppHeader showBack title="Checkout" titleColor={colors.primary} showAvatar avatarUrl={user?.avatarUrl} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Delivery Address */}
        <SectionHeader
          icon="location"
          title="Delivery Address"
          action="Change"
          onAction={() => navigation.navigate('AddressList')}
        />
        <View style={[styles.addressCard, { borderColor: colors.primary, backgroundColor: colors.surface }]}>
          <View style={styles.addressTop}>
            <Text style={[styles.addressLabel, { color: colors.primary }]}>{MOCK_CHECKOUT_ADDRESS.label}</Text>
            <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
          </View>
          <Text style={[styles.addressText, { color: colors.text }]}>
            {MOCK_CHECKOUT_ADDRESS.line1}, {MOCK_CHECKOUT_ADDRESS.line2}
          </Text>
        </View>
        <Pressable
          style={[styles.addAddressBtn, { borderColor: colors.border }]}
          onPress={() => navigation.navigate('AddressList')}
        >
          <Ionicons name="add" size={20} color={colors.textMuted} />
          <Text style={{ color: colors.textSecondary, fontWeight: '500' }}>Add New Address</Text>
        </Pressable>
        <View style={styles.mapPreview}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&h=200&fit=crop',
            }}
            style={styles.mapImage}
          />
          <View style={[styles.mapPin, { backgroundColor: colors.primary }]}>
            <Ionicons name="location" size={20} color="#FFF" />
          </View>
        </View>

        {/* Delivery Slot */}
        <SectionHeader icon="time-outline" title="Delivery Slot" />
        <View style={styles.slotsGrid}>
          {MOCK_DELIVERY_SLOTS.map((slot) => {
            const selected = selectedSlot === slot.id;
            return (
              <Pressable
                key={slot.id}
                onPress={() => setSelectedSlot(slot.id)}
                style={[
                  styles.slotCard,
                  {
                    borderColor: selected ? colors.primary : colors.border,
                    backgroundColor: selected ? colors.primaryLight : colors.surface,
                  },
                ]}
              >
                {slot.isExpress && (
                  <View style={[styles.expressBadge, { backgroundColor: colors.primary }]}>
                    <Text style={styles.expressText}>EXPRESS</Text>
                  </View>
                )}
                <Text style={[styles.slotLabel, { color: colors.text }]}>{slot.label}</Text>
                <Text style={[styles.slotSub, { color: colors.textSecondary }]}>{slot.sublabel}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Payment Method */}
        <SectionHeader icon="cash-outline" title="Payment Method" />
        {paymentOptions.map((opt) => {
          const selected = paymentMethod === opt.id;
          return (
            <Pressable
              key={opt.id}
              onPress={() => setPaymentMethod(opt.id)}
              style={[
                styles.paymentCard,
                {
                  borderColor: selected ? colors.primary : colors.border,
                  backgroundColor: selected ? colors.primaryLight : colors.surface,
                },
              ]}
            >
              <Ionicons name={opt.icon} size={24} color={colors.primary} />
              <View style={styles.paymentText}>
                <Text style={[styles.paymentTitle, { color: colors.text }]}>{opt.title}</Text>
                <Text style={[styles.paymentSub, { color: colors.textSecondary }]}>{opt.subtitle}</Text>
              </View>
              <View
                style={[
                  styles.radio,
                  {
                    borderColor: selected ? colors.primary : colors.border,
                    backgroundColor: selected ? colors.primary : 'transparent',
                  },
                ]}
              >
                {selected && <View style={styles.radioInner} />}
              </View>
            </Pressable>
          );
        })}

        {/* Order Summary */}
        <Text style={[styles.orderSummaryTitle, { color: colors.text }]}>Order Summary</Text>
        <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
          {MOCK_CHECKOUT_ITEMS.map((item) => (
            <View key={item.id} style={styles.summaryItem}>
              <Image source={{ uri: item.imageUrl }} style={styles.itemImg} />
              <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={[styles.itemPrice, { color: colors.text }]}>{formatINR(item.price)}</Text>
            </View>
          ))}
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SummaryRow label="Item Total" value={formatINR(summary.itemTotal)} />
          <SummaryRow
            label="Delivery Fee"
            value="FREE"
            valueColor={colors.success}
            strikethrough={summary.deliveryFeeStrikethrough ? formatINR(summary.deliveryFeeStrikethrough) : undefined}
          />
          <SummaryRow label="Taxes & Charges" value={formatINR(summary.taxes)} />
          <View style={styles.toPayRow}>
            <Text style={[styles.toPayLabel, { color: colors.text }]}>To Pay</Text>
            <Text style={[styles.toPayValue, { color: colors.primary }]}>
              {formatINR(summary.total)}
            </Text>
          </View>
          {couponApplied && summary.couponCode && (
            <View style={[styles.couponBanner, { backgroundColor: colors.badgeOrganic }]}>
              <Ionicons name="pricetag" size={18} color={colors.accentDark} />
              <Text style={[styles.couponText, { color: colors.accentDark }]}>
                {summary.couponCode} Applied!
              </Text>
              <Pressable onPress={() => setCouponApplied(false)}>
                <Text style={[styles.couponRemove, { color: colors.accent }]}>Remove</Text>
              </Pressable>
            </View>
          )}
        </View>
        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <Pressable onPress={handlePlaceOrder} disabled={createOrder.isPending}>
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.placeOrderBtn}
          >
            <Text style={styles.placeOrderText}>
              {createOrder.isPending ? 'Placing Order...' : 'Place Order'}
            </Text>
            <Ionicons name="arrow-forward" size={22} color="#FFF" />
          </LinearGradient>
        </Pressable>
        <Text style={[styles.terms, { color: colors.textMuted }]}>
          By placing the order, you agree to FreshDash's{' '}
          <Text style={{ textDecorationLine: 'underline', color: colors.textSecondary }}>
            Terms of Service
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

function SummaryRow({
  label,
  value,
  valueColor,
  strikethrough,
}: {
  label: string;
  value: string;
  valueColor?: string;
  strikethrough?: string;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.summaryRow}>
      <Text style={[styles.summaryRowLabel, { color: colors.textSecondary }]}>{label}</Text>
      <View style={styles.summaryRowRight}>
        {strikethrough && (
          <Text style={[styles.strike, { color: colors.textMuted }]}>{strikethrough}</Text>
        )}
        <Text style={[styles.summaryRowValue, { color: valueColor ?? colors.text }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: Spacing.lg },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: { flex: 1, fontSize: 17, fontWeight: '700' },
  sectionAction: { fontSize: 14, fontWeight: '600' },
  addressCard: {
    borderWidth: 1.5,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  addressTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm },
  addressLabel: { fontSize: 14, fontWeight: '700' },
  addressText: { fontSize: 14, lineHeight: 20 },
  addAddressBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    marginBottom: Spacing.md,
  },
  mapPreview: {
    height: 120,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    position: 'relative',
  },
  mapImage: { width: '100%', height: '100%' },
  mapPin: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -18,
    marginTop: -18,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  slotCard: {
    width: '47%',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    minHeight: 72,
  },
  expressBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  expressText: { color: '#FFF', fontSize: 9, fontWeight: '800' },
  slotLabel: { fontSize: 14, fontWeight: '700' },
  slotSub: { fontSize: 12, marginTop: 2 },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  paymentText: { flex: 1 },
  paymentTitle: { fontSize: 14, fontWeight: '600' },
  paymentSub: { fontSize: 12, marginTop: 2 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFF' },
  orderSummaryTitle: { fontSize: 17, fontWeight: '700', marginTop: Spacing.lg, marginBottom: Spacing.md },
  summaryCard: { borderRadius: BorderRadius.lg, padding: Spacing.lg, ...Shadows.card },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  itemImg: { width: 48, height: 48, borderRadius: BorderRadius.sm },
  itemName: { flex: 1, fontSize: 13, fontWeight: '500' },
  itemPrice: { fontSize: 14, fontWeight: '700' },
  divider: { height: 1, marginVertical: Spacing.md },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  summaryRowLabel: { fontSize: 14 },
  summaryRowRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  summaryRowValue: { fontSize: 14, fontWeight: '600' },
  strike: { fontSize: 13, textDecorationLine: 'line-through' },
  toPayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
  },
  toPayLabel: { fontSize: 16, fontWeight: '700' },
  toPayValue: { fontSize: 24, fontWeight: '700' },
  couponBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.md,
  },
  couponText: { flex: 1, fontSize: 14, fontWeight: '700' },
  couponRemove: { fontSize: 13, fontWeight: '600' },
  footer: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  placeOrderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  placeOrderText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
  terms: { fontSize: 11, textAlign: 'center', marginTop: Spacing.md, lineHeight: 16 },
});

import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BorderRadius, Spacing } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { AppHeader } from '../../components/layout/AppHeader';
import { Card } from '../../components/ui/Card';
import { CartItemRow } from '../../components/cart/CartItemRow';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { useCart } from '../../hooks/useCart';
import { MOCK_ADDRESS } from '../../api/mockData';
import { formatCurrency } from '../../utils/format';
import type { UserStackParamList } from '../../types/navigation';

export function CartScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<UserStackParamList>>();
  const { colors } = useTheme();
  const {
    items,
    removeItem,
    updateQuantity,
    getSubtotal,
    getTotal,
    getItemCount,
    setCoupon,
    couponCode,
  } = useCart();
  const [couponInput, setCouponInput] = useState(couponCode ?? 'FRESH2024');

  const itemCount = getItemCount();
  const subtotal = getSubtotal();
  const taxes = subtotal * 0.06;
  const total = getTotal();

  if (items.length === 0) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.backgroundSecondary }]}>
        <AppHeader showBack title="Shopping Cart" />
        <EmptyState
          title="Your cart is empty"
          description="Add items from a store to get started"
          actionLabel="Browse Stores"
          onAction={() => navigation.navigate('MainTabs', { screen: 'Home' })}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.backgroundSecondary }]} edges={['top']}>
      <AppHeader
        showBack
        title="Shopping Cart"
        rightElement={
          <View style={[styles.itemBadge, { backgroundColor: colors.itemBadge }]}>
            <Text style={[styles.itemBadgeText, { color: colors.itemBadgeText }]}>
              {itemCount} Items
            </Text>
          </View>
        }
      />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Card style={styles.addressCard}>
          <View style={styles.addressHeader}>
            <View style={styles.addressLabelRow}>
              <Ionicons name="location" size={16} color={colors.primary} />
              <Text style={[styles.addressLabel, { color: colors.textSecondary }]}>
                DELIVERY ADDRESS
              </Text>
            </View>
            <Pressable onPress={() => navigation.navigate('AddressList')}>
              <Text style={[styles.changeLink, { color: colors.primary }]}>Change</Text>
            </Pressable>
          </View>
          <Text style={[styles.addressLine1, { color: colors.text }]}>{MOCK_ADDRESS.line1}</Text>
          <Text style={[styles.addressLine2, { color: colors.textSecondary }]}>
            {MOCK_ADDRESS.line2}
          </Text>
        </Card>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Items</Text>
        {items.map((item) => (
          <CartItemRow
            key={item.productId}
            item={item}
            onRemove={() => removeItem(item.productId)}
            onQuantityChange={(qty) => updateQuantity(item.productId, qty)}
          />
        ))}
        <Card style={styles.couponCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Apply Coupon</Text>
          <View style={[styles.couponRow, { backgroundColor: colors.backgroundSecondary }]}>
            <Ionicons name="pricetag-outline" size={18} color={colors.textMuted} />
            <Text style={[styles.couponInput, { color: colors.text }]}>{couponInput}</Text>
            <Pressable
              onPress={() => {
                setCoupon(couponInput, couponInput === 'FRESH2024' ? 2.5 : 0);
              }}
            >
              <Text style={[styles.applyBtn, { color: colors.couponApply }]}>Apply</Text>
            </Pressable>
          </View>
        </Card>
        <Card>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Order Summary</Text>
          <SummaryRow label={`Subtotal (${itemCount} items)`} value={formatCurrency(subtotal)} colors={colors} />
          <SummaryRow label="Delivery Fee" value="FREE" colors={colors} highlight />
          <SummaryRow label="Taxes & Fees" value={formatCurrency(taxes)} colors={colors} />
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
            <Text style={[styles.totalValue, { color: colors.primary }]}>
              {formatCurrency(total)}
            </Text>
          </View>
          <View style={[styles.savingsBanner, { backgroundColor: colors.savingsBg }]}>
            <Ionicons name="leaf" size={16} color={colors.savingsText} />
            <Text style={[styles.savingsText, { color: colors.savingsText }]}>
              You're saving $2.50 in delivery fees today!
            </Text>
          </View>
          <Pressable onPress={() => navigation.navigate('Checkout')}>
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.checkoutBtn}
            >
              <Text style={styles.checkoutText}>Proceed to Checkout</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFF" />
            </LinearGradient>
          </Pressable>
          <View style={styles.paymentIcons}>
            <Ionicons name="card-outline" size={24} color={colors.textMuted} />
            <Ionicons name="wallet-outline" size={24} color={colors.textMuted} />
            <Ionicons name="phone-portrait-outline" size={24} color={colors.textMuted} />
          </View>
          <Text style={[styles.terms, { color: colors.textMuted }]}>
            By proceeding, you agree to our Terms of Service.
          </Text>
        </Card>
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function SummaryRow({
  label,
  value,
  colors,
  highlight,
}: {
  label: string;
  value: string;
  colors: ReturnType<typeof useTheme>['colors'];
  highlight?: boolean;
}) {
  return (
    <View style={summaryStyles.row}>
      <Text style={[summaryStyles.label, { color: colors.textSecondary }]}>{label}</Text>
      <Text
        style={[
          summaryStyles.value,
          { color: highlight ? colors.success : colors.text },
          highlight && { fontWeight: '700' },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

const summaryStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  label: { fontSize: 14 },
  value: { fontSize: 14, fontWeight: '500' },
});

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: Spacing.lg },
  itemBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  itemBadgeText: { fontSize: 12, fontWeight: '600' },
  addressCard: { marginBottom: Spacing.lg },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  addressLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  addressLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 0.5 },
  changeLink: { fontSize: 14, fontWeight: '600' },
  addressLine1: { fontSize: 16, fontWeight: '700' },
  addressLine2: { fontSize: 13, marginTop: 2 },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: Spacing.md },
  couponCard: { marginTop: Spacing.md, marginBottom: Spacing.lg },
  couponRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  couponInput: { flex: 1, fontSize: 15 },
  applyBtn: { fontSize: 14, fontWeight: '700' },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Spacing.md,
    marginTop: Spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
  },
  totalLabel: { fontSize: 18, fontWeight: '700' },
  totalValue: { fontSize: 22, fontWeight: '700' },
  savingsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  savingsText: { fontSize: 13, fontWeight: '600', flex: 1 },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  checkoutText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  paymentIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xl,
    marginTop: Spacing.lg,
  },
  terms: { fontSize: 11, textAlign: 'center', marginTop: Spacing.md },
});

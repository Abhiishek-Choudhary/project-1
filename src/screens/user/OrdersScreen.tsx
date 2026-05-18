import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { OrderStatus } from '../../constants/enums';
import { BorderRadius, Spacing, Typography } from '../../constants/theme';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { OrderCard } from '../../components/order/OrderCard';
import { Loader } from '../../components/ui/Loader';
import { EmptyState } from '../../components/ui/EmptyState';
import { useOrders } from '../../hooks/useOrders';
import { useCart } from '../../hooks/useCart';
import { getOrderStatusStyle } from '../../utils/orderStatus';
import type { Order } from '../../types';
import type { UserStackParamList } from '../../types/navigation';

type OrderFilter = 'active' | 'past' | 'all';

export function OrdersScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<UserStackParamList>>();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { data: orders, isLoading } = useOrders();
  const { addToCart } = useCart();
  const [filter, setFilter] = useState<OrderFilter>('active');

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    if (filter === 'all') return orders;
    if (filter === 'active') {
      return orders.filter((o) => getOrderStatusStyle(o.status).isActive);
    }
    return orders.filter((o) => !getOrderStatusStyle(o.status).isActive);
  }, [orders, filter]);

  const activeCount = useMemo(
    () => orders?.filter((o) => getOrderStatusStyle(o.status).isActive).length ?? 0,
    [orders],
  );

  const handleReorder = useCallback(
    (order: Order) => {
      order.items.forEach((line) => {
        for (let i = 0; i < line.quantity; i += 1) {
          addToCart(line.product);
        }
      });
      navigation.navigate('Cart');
    },
    [addToCart, navigation],
  );

  const renderOrder = useCallback(
    ({ item }: { item: Order }) => (
      <OrderCard
        order={item}
        trackLabel={t('orders.track')}
        reorderLabel={t('orders.reorder')}
        itemsLabel={t('orders.items')}
        onTrack={() => navigation.navigate('OrderTracking', { orderId: item.id })}
        onReorder={
          item.status === OrderStatus.Delivered
            ? () => handleReorder(item)
            : undefined
        }
      />
    ),
    [navigation, handleReorder, t],
  );

  const filters: { key: OrderFilter; label: string }[] = [
    { key: 'active', label: t('orders.active') },
    { key: 'past', label: t('orders.past') },
    { key: 'all', label: t('orders.all') },
  ];

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.backgroundSecondary }]}
      edges={['top']}
    >
      <ScreenContainer padded>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{t('orders.title')}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {t('orders.subtitle')}
        </Text>
      </View>

      <View style={styles.segmentRow}>
        {filters.map((f) => {
          const selected = filter === f.key;
          return (
            <Pressable
              key={f.key}
              onPress={() => setFilter(f.key)}
              style={[
                styles.segment,
                {
                  backgroundColor: selected ? colors.primary : colors.surface,
                },
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  { color: selected ? '#FFF' : colors.textSecondary },
                ]}
              >
                {f.label}
                {f.key === 'active' && activeCount > 0 ? ` (${activeCount})` : ''}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {isLoading ? (
        <Loader />
      ) : !orders?.length ? (
        <EmptyState
          icon="bag-outline"
          title={t('orders.emptyTitle')}
          description={t('orders.emptyBody')}
          actionLabel={t('orders.shopNow')}
          onAction={() => navigation.navigate('MainTabs', { screen: 'Home' })}
        />
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          icon="checkmark-done-outline"
          title={t('orders.noFilterTitle')}
          description={t('orders.noFilterBody')}
          actionLabel={t('orders.viewAll')}
          onAction={() => setFilter('all')}
        />
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrder}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
      </ScreenContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  title: { ...Typography.h1, fontSize: 28 },
  subtitle: { fontSize: 14, marginTop: 4 },
  segmentRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  segment: {
    flex: 1,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
  },
  segmentText: { fontSize: 13, fontWeight: '700' },
  list: { paddingHorizontal: Spacing.lg, paddingBottom: 120 },
});

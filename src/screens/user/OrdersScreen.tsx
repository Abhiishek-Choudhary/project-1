import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Spacing } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { Loader } from '../../components/ui/Loader';
import { EmptyState } from '../../components/ui/EmptyState';
import { useOrders } from '../../hooks/useOrders';
import { formatCurrency } from '../../utils/format';
import type { Order } from '../../types';
import type { UserStackParamList } from '../../types/navigation';

export function OrdersScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<UserStackParamList>>();
  const { colors } = useTheme();
  const { data: orders, isLoading } = useOrders();

  const renderOrder = ({ item }: { item: Order }) => (
    <Pressable
      style={[styles.card, { backgroundColor: colors.surface }]}
      onPress={() => navigation.navigate('OrderTracking', { orderId: item.id })}
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.store, { color: colors.text }]}>
          {item.displayId ? `#${item.displayId}` : item.storeName}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: colors.primaryLight }]}>
          <Text style={[styles.status, { color: colors.primary }]}>
            {item.status.replace(/_/g, ' ')}
          </Text>
        </View>
      </View>
      <Text style={[styles.items, { color: colors.textSecondary }]}>
        {item.items.length} items • {formatCurrency(item.summary.total)}
      </Text>
      {item.estimatedDelivery && (
        <Text style={[styles.eta, { color: colors.primary }]}>
          ETA: {item.estimatedDelivery}
        </Text>
      )}
    </Pressable>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <Text style={[styles.title, { color: colors.text }]}>Your Orders</Text>
      {isLoading ? (
        <Loader />
      ) : !orders?.length ? (
        <EmptyState
          icon="bag-outline"
          title="No orders yet"
          description="Your order history will appear here"
          actionLabel="Start Shopping"
          onAction={() => navigation.navigate('MainTabs', { screen: 'Home' })}
        />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrder}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  title: { fontSize: 24, fontWeight: '700', padding: Spacing.lg },
  list: { padding: Spacing.lg, paddingBottom: 100 },
  card: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  store: { fontSize: 16, fontWeight: '700' },
  statusBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: BorderRadius.full },
  status: { fontSize: 11, fontWeight: '600', textTransform: 'capitalize' },
  items: { fontSize: 13, marginTop: Spacing.sm },
  eta: { fontSize: 13, fontWeight: '600', marginTop: Spacing.sm },
});

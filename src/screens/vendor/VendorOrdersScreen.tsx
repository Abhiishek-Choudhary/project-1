import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Shadows, Spacing } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { VendorHeader } from '../../components/layout/VendorHeader';
import { MOCK_VENDOR_RECENT_ORDERS } from '../../api/vendorMockData';
import { formatCurrency } from '../../utils/format';

export function VendorOrdersScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.backgroundSecondary }]} edges={['top']}>
      <VendorHeader />
      <FlatList
        data={MOCK_VENDOR_RECENT_ORDERS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text style={[styles.title, { color: colors.text }]}>All Orders</Text>
        }
        renderItem={({ item }) => (
          <Pressable style={[styles.card, Shadows.card, { backgroundColor: colors.surface }]}>
            <Text style={[styles.orderId, { color: colors.text }]}>#{item.id}</Text>
            <Text style={{ color: colors.textSecondary }}>
              {item.itemCount} items • {formatCurrency(item.total)} • {item.timeAgo}
            </Text>
            <View style={[styles.badge, { backgroundColor: colors.primaryLight }]}>
              <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 11 }}>
                {item.statusLabel}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  list: { padding: Spacing.lg, paddingBottom: 100 },
  title: { fontSize: 26, fontWeight: '700', marginBottom: Spacing.lg },
  card: { padding: Spacing.lg, borderRadius: BorderRadius.lg, marginBottom: Spacing.md },
  orderId: { fontSize: 16, fontWeight: '700' },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.sm,
  },
});

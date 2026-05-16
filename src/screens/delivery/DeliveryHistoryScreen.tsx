import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Shadows, Spacing } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { VendorHeader } from '../../components/layout/VendorHeader';
import { MOCK_DELIVERY_ASSIGNMENTS } from '../../api/mockData';
import { formatCurrency } from '../../utils/format';

export function DeliveryHistoryScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.backgroundSecondary }]} edges={['top']}>
      <VendorHeader />
      <FlatList
        data={MOCK_DELIVERY_ASSIGNMENTS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text style={[styles.title, { color: colors.text }]}>Delivery History</Text>
        }
        renderItem={({ item }) => (
          <View style={[styles.card, Shadows.card, { backgroundColor: colors.surface }]}>
            <Text style={[styles.store, { color: colors.text }]}>{item.storeName}</Text>
            <Text style={{ color: colors.textSecondary, fontSize: 13 }}>{item.customerAddress}</Text>
            <Text style={{ color: colors.primary, fontWeight: '700', marginTop: Spacing.sm }}>
              Earned {formatCurrency(item.earnings)}
            </Text>
          </View>
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
  store: { fontSize: 16, fontWeight: '700' },
});

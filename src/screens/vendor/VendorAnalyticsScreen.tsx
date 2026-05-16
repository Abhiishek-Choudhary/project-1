import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Shadows, Spacing } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { VendorHeader } from '../../components/layout/VendorHeader';
import { MOCK_VENDOR_STATS } from '../../api/vendorMockData';
import { formatCurrency } from '../../utils/format';

export function VendorAnalyticsScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.backgroundSecondary }]} edges={['top']}>
      <VendorHeader />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.title, { color: colors.text }]}>Analytics</Text>
        <View style={[styles.card, Shadows.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Weekly Revenue</Text>
          <Text style={[styles.value, { color: colors.primary }]}>
            {formatCurrency(MOCK_VENDOR_STATS.todayRevenue * 7)}
          </Text>
        </View>
        <View style={[styles.card, Shadows.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Avg. Order Value</Text>
          <Text style={[styles.value, { color: colors.text }]}>{formatCurrency(38.5)}</Text>
        </View>
        <View style={[styles.card, Shadows.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Fulfillment Rate</Text>
          <Text style={[styles.value, { color: colors.success }]}>98.2%</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: Spacing.lg, paddingBottom: 100 },
  title: { fontSize: 26, fontWeight: '700', marginBottom: Spacing.xl },
  card: { padding: Spacing.xl, borderRadius: BorderRadius.lg, marginBottom: Spacing.md },
  label: { fontSize: 14 },
  value: { fontSize: 28, fontWeight: '700', marginTop: Spacing.sm },
});

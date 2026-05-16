import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Shadows, Spacing } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { VendorHeader } from '../../components/layout/VendorHeader';
import { MOCK_DELIVERY_STATS } from '../../api/deliveryMockData';
import { formatCurrency } from '../../utils/format';

export function DeliveryEarningsScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.backgroundSecondary }]} edges={['top']}>
      <VendorHeader showOnlineToggle isOnline />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.title, { color: colors.text }]}>Earnings</Text>
        <View style={[styles.hero, Shadows.card, { backgroundColor: colors.primary }]}>
          <Text style={styles.heroLabel}>Today</Text>
          <Text style={styles.heroValue}>{formatCurrency(MOCK_DELIVERY_STATS.earningsToday)}</Text>
        </View>
        {[
          { label: 'This Week', value: 892.5 },
          { label: 'This Month', value: 3240 },
        ].map((row) => (
          <View key={row.label} style={[styles.row, Shadows.card, { backgroundColor: colors.surface }]}>
            <Text style={{ color: colors.text, fontWeight: '600' }}>{row.label}</Text>
            <Text style={{ color: colors.primary, fontWeight: '700' }}>{formatCurrency(row.value)}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: Spacing.lg, paddingBottom: 100 },
  title: { fontSize: 26, fontWeight: '700', marginBottom: Spacing.xl },
  hero: { padding: Spacing.xxl, borderRadius: BorderRadius.lg, alignItems: 'center', marginBottom: Spacing.lg },
  heroLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  heroValue: { color: '#FFF', fontSize: 36, fontWeight: '700', marginTop: Spacing.sm },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
});

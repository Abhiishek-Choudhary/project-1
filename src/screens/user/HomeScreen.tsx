import React, { useCallback } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Spacing } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { Loader } from '../../components/ui/Loader';
import { EmptyState } from '../../components/ui/EmptyState';
import { useNearbyStores } from '../../hooks/useStores';
import { useAuthStore } from '../../store/authStore';
import { formatDeliveryTime, formatRating } from '../../utils/format';
import type { Store } from '../../types';
import type { UserStackParamList } from '../../types/navigation';

const CATEGORIES = ['Vegetables', 'Fruits', 'Dairy', 'Snacks', 'Beverages', 'Household'];

export function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<UserStackParamList>>();
  const { colors } = useTheme();
  const user = useAuthStore((s) => s.user);
  const { data: stores, isLoading, isError, refetch } = useNearbyStores();

  const renderStore = useCallback(
    ({ item }: { item: Store }) => (
      <Pressable
        style={[styles.storeCard, { backgroundColor: colors.surface }]}
        onPress={() => navigation.navigate('StoreProducts', { store: item })}
      >
        <Image source={{ uri: item.imageUrl }} style={styles.storeImage} />
        <View style={styles.storeInfo}>
          <Text style={[styles.storeName, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.storeMeta, { color: colors.textSecondary }]}>
            {formatRating(item.rating, item.reviewCount)} • {item.distanceKm} km
          </Text>
          <Text style={[styles.delivery, { color: colors.primary }]}>
            {formatDeliveryTime(item.deliveryTimeMin, item.deliveryTimeMax)} •{' '}
            {item.deliveryFee === 0 ? 'Free Delivery' : `$${item.deliveryFee}`}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      </Pressable>
    ),
    [colors, navigation],
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>Deliver to</Text>
          <Pressable style={styles.locationRow}>
            <Ionicons name="location" size={16} color={colors.primary} />
            <Text style={[styles.location, { color: colors.text }]}>Premium Urban Lofts</Text>
            <Ionicons name="chevron-down" size={16} color={colors.text} />
          </Pressable>
        </View>
        <Pressable onPress={() => navigation.navigate('Notifications')}>
          <Ionicons name="notifications-outline" size={24} color={colors.text} />
        </Pressable>
      </View>
      <Text style={[styles.brand, { color: colors.primary }]}>FreshDash</Text>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Shop by Category</Text>
      <FlatList
        horizontal
        data={CATEGORIES}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categories}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.categoryChip, { backgroundColor: colors.primaryLight }]}
            onPress={() => navigation.navigate('CategoryBrowse', { category: item })}
          >
            <Text style={[styles.categoryText, { color: colors.primary }]}>{item}</Text>
          </Pressable>
        )}
      />
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Nearby Stores</Text>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <EmptyState
          title="Couldn't load stores"
          actionLabel="Retry"
          onAction={() => void refetch()}
        />
      ) : (
        <FlatList
          data={stores}
          keyExtractor={(item) => item.id}
          renderItem={renderStore}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  greeting: { fontSize: 12 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  location: { fontSize: 15, fontWeight: '700' },
  brand: { fontSize: 28, fontWeight: '700', paddingHorizontal: Spacing.lg, marginTop: Spacing.lg },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  categories: { paddingHorizontal: Spacing.lg, gap: Spacing.sm },
  categoryChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.sm,
  },
  categoryText: { fontSize: 13, fontWeight: '600' },
  list: { paddingHorizontal: Spacing.lg, paddingBottom: 100 },
  storeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  storeImage: { width: 64, height: 64, borderRadius: BorderRadius.md },
  storeInfo: { flex: 1, marginLeft: Spacing.md },
  storeName: { fontSize: 16, fontWeight: '700' },
  storeMeta: { fontSize: 12, marginTop: 2 },
  delivery: { fontSize: 12, fontWeight: '600', marginTop: 4 },
});

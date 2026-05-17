import React, { useCallback } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useRoute, useNavigation, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Shadows, Spacing, Typography } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { AppHeader } from '../../components/layout/AppHeader';
import { ProductCard } from '../../components/product/ProductCard';
import { Loader } from '../../components/ui/Loader';
import { EmptyState } from '../../components/ui/EmptyState';
import { FloatingCartBar } from '../../components/cart/FloatingCartBar';
import { useCategoryProducts } from '../../hooks/useStores';
import { useCart } from '../../hooks/useCart';
import type { Product } from '../../types';
import type { UserStackParamList } from '../../types/navigation';

const CATEGORY_META: Record<string, { icon: keyof typeof Ionicons.glyphMap; subtitle: string }> = {
  Fruits: { icon: 'nutrition-outline', subtitle: 'Fresh picks delivered fast' },
  Vegetables: { icon: 'leaf-outline', subtitle: 'Farm-fresh greens & more' },
  Dairy: { icon: 'water-outline', subtitle: 'Milk, curd & daily dairy' },
  Staples: { icon: 'restaurant-outline', subtitle: 'Rice, flour & pantry essentials' },
  Snacks: { icon: 'fast-food-outline', subtitle: 'Chips, mixes & munchies' },
  Beverages: { icon: 'cafe-outline', subtitle: 'Juices, water & drinks' },
};

export function CategoryBrowseScreen() {
  const route = useRoute<RouteProp<UserStackParamList, 'CategoryBrowse'>>();
  const navigation = useNavigation<NativeStackNavigationProp<UserStackParamList>>();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const category = route.params.category;
  const { data: products, isLoading, isError, refetch } = useCategoryProducts(category);
  const { addToCart, getItemCount, getTotal } = useCart();

  const meta = CATEGORY_META[category] ?? {
    icon: 'grid-outline' as const,
    subtitle: 'Browse items in this category',
  };

  const categoryLabel =
    category === 'Fruits'
      ? t('categories.fruits')
      : category === 'Vegetables'
        ? t('categories.veggies')
        : category === 'Dairy'
          ? t('categories.dairy')
          : category === 'Staples'
            ? t('categories.staples')
            : category;

  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <View style={styles.gridItem}>
        <ProductCard
          product={item}
          onPress={() => navigation.navigate('ProductDetail', { product: item })}
          onAdd={() => addToCart(item)}
        />
      </View>
    ),
    [navigation, addToCart],
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.backgroundSecondary }]} edges={['top']}>
      <AppHeader showBack title={categoryLabel} />

      <View style={[styles.hero, { backgroundColor: colors.surface }, Shadows.card]}>
        <View style={[styles.heroIcon, { backgroundColor: colors.primaryLight }]}>
          <Ionicons name={meta.icon} size={28} color={colors.primary} />
        </View>
        <View style={styles.heroText}>
          <Text style={[styles.heroTitle, { color: colors.text }]}>{categoryLabel}</Text>
          <Text style={[styles.heroSub, { color: colors.textSecondary }]}>{meta.subtitle}</Text>
          {!isLoading && (
            <Text style={[styles.heroCount, { color: colors.primary }]}>
              {products?.length ?? 0} items available
            </Text>
          )}
        </View>
      </View>

      {isLoading ? (
        <Loader />
      ) : isError ? (
        <EmptyState title="Could not load products" actionLabel="Retry" onAction={() => void refetch()} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={renderItem}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              title="No products yet"
              description={`We're restocking ${categoryLabel.toLowerCase()}. Check back soon.`}
            />
          }
        />
      )}

      {getItemCount() > 0 && (
        <View style={styles.cartWrap}>
          <FloatingCartBar
            compact
            itemCount={getItemCount()}
            total={getTotal()}
            onPress={() => navigation.navigate('Cart')}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
  },
  heroIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroText: { flex: 1 },
  heroTitle: { ...Typography.h2 },
  heroSub: { fontSize: 13, marginTop: 4, lineHeight: 18 },
  heroCount: { fontSize: 13, fontWeight: '700', marginTop: Spacing.sm },
  list: { paddingHorizontal: Spacing.md, paddingBottom: 130 },
  row: { justifyContent: 'space-between', gap: Spacing.sm },
  gridItem: { width: '48%' },
  cartWrap: { position: 'absolute', bottom: 24, left: 0, right: 0 },
});

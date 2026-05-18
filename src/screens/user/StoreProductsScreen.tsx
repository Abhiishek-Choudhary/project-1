import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRoute, useNavigation, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Shadows, Spacing } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { AppHeader } from '../../components/layout/AppHeader';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { CategoryPill } from '../../components/product/CategoryPill';
import { ProductCard } from '../../components/product/ProductCard';
import { FloatingCartBar } from '../../components/cart/FloatingCartBar';
import { Loader } from '../../components/ui/Loader';
import { EmptyState } from '../../components/ui/EmptyState';
import { useStoreProducts } from '../../hooks/useStores';
import { useCart } from '../../hooks/useCart';
import { useAuthStore } from '../../store/authStore';
import { formatDeliveryTime, formatRating } from '../../utils/format';
import type { Product } from '../../types';
import type { UserStackParamList } from '../../types/navigation';

export function StoreProductsScreen() {
  const route = useRoute<RouteProp<UserStackParamList, 'StoreProducts'>>();
  const navigation = useNavigation<NativeStackNavigationProp<UserStackParamList>>();
  const { store } = route.params;
  const { colors } = useTheme();
  const layout = useResponsiveLayout();
  const user = useAuthStore((s) => s.user);
  const [category, setCategory] = useState(store.categories[0] ?? 'Vegetables');
  const { data: products, isLoading, isError, refetch } = useStoreProducts(store.id, category);
  const { addToCart, getItemCount, getTotal } = useCart();

  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <View style={[styles.gridItem, { width: layout.productCardWidth }]}>
        <ProductCard
          product={item}
          onPress={() => navigation.navigate('ProductDetail', { product: item })}
          onAdd={() => addToCart(item)}
        />
      </View>
    ),
    [navigation, addToCart, layout.productCardWidth],
  );

  const listHeader = (
    <>
      <View
        style={[
          styles.storeBanner,
          Shadows.card,
          { backgroundColor: colors.surface, marginHorizontal: layout.gutter },
        ]}
      >
        <Image source={{ uri: store.imageUrl }} style={styles.bannerImage} />
        <View style={styles.bannerOverlay}>
          <Text style={[styles.storeName, { color: colors.text }]}>{store.name}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="time-outline" size={14} color={colors.primary} />
            <Text style={[styles.meta, { color: colors.textSecondary }]}>
              {formatDeliveryTime(store.deliveryTimeMin, store.deliveryTimeMax)} •{' '}
              {store.deliveryFee === 0 ? 'Free delivery' : `$${store.deliveryFee} delivery`}
            </Text>
          </View>
          <View style={[styles.ratingBadge, { backgroundColor: colors.ratingBg }]}>
            <Text style={[styles.ratingText, { color: colors.ratingText }]}>
              {formatRating(store.rating, store.reviewCount)}
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.categoryRow, { paddingLeft: layout.gutter }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categories}
          style={styles.categoryScroll}
        >
          {store.categories.map((cat) => (
            <CategoryPill
              key={cat}
              label={cat}
              active={category === cat}
              onPress={() => setCategory(cat)}
            />
          ))}
        </ScrollView>
        <Pressable
          style={[styles.filterBtn, { backgroundColor: colors.backgroundSecondary }]}
        >
          <Ionicons name="options-outline" size={18} color={colors.text} />
        </Pressable>
      </View>

      {!isLoading && (products?.length ?? 0) > 0 && (
        <Text style={[styles.resultLine, { color: colors.textSecondary, paddingHorizontal: layout.gutter }]}>
          {products?.length} items in {category}
        </Text>
      )}
    </>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.backgroundSecondary }]} edges={['top']}>
      <ScreenContainer style={styles.screen}>
      <AppHeader
        showBack
        showSearch
        showAvatar
        avatarUrl={user?.avatarUrl}
        onSearchPress={() => navigation.navigate('MainTabs', { screen: 'Search' })}
      />

      {isLoading ? (
        <>
          {listHeader}
          <Loader />
        </>
      ) : isError ? (
        <>
          {listHeader}
          <EmptyState title="Could not load products" actionLabel="Retry" onAction={() => void refetch()} />
        </>
      ) : (
        <FlatList
          data={products}
          key={`store-${layout.productColumns}`}
          keyExtractor={(item) => item.id}
          numColumns={layout.productColumns}
          renderItem={renderItem}
          ListHeaderComponent={listHeader}
          contentContainerStyle={[styles.list, { paddingHorizontal: layout.gutter }]}
          columnWrapperStyle={layout.productColumns > 1 ? [styles.row, { gap: layout.gap }] : undefined}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              title={`No ${category.toLowerCase()} right now`}
              description="Try another category or check back later."
              actionLabel="View all categories"
              onAction={() => {
                const next = store.categories.find((c) => c !== category);
                if (next) setCategory(next);
              }}
            />
          }
        />
      )}

      {getItemCount() > 0 && (
        <View style={[styles.cartWrap, layout.isWeb && styles.cartWrapWeb, { paddingHorizontal: layout.gutter }]}>
          <FloatingCartBar
            itemCount={getItemCount()}
            total={getTotal()}
            onPress={() => navigation.navigate('Cart')}
            style={layout.isWeb ? styles.cartBarWeb : undefined}
          />
        </View>
      )}
      </ScreenContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  screen: { flex: 1 },
  storeBanner: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  bannerImage: { width: '100%', height: 120 },
  bannerOverlay: { padding: Spacing.lg },
  storeName: { fontSize: 22, fontWeight: '700' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: Spacing.xs },
  meta: { fontSize: 13, flex: 1 },
  ratingBadge: {
    alignSelf: 'flex-start',
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  ratingText: { fontSize: 12, fontWeight: '700' },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  categoryScroll: { flex: 1 },
  categories: { paddingRight: Spacing.sm },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.lg,
  },
  resultLine: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  list: { paddingBottom: 120 },
  row: { justifyContent: 'flex-start' },
  gridItem: {},
  cartWrap: { position: 'absolute', bottom: 24, left: 0, right: 0 },
  cartWrapWeb: { alignItems: 'center' },
  cartBarWeb: { marginHorizontal: 0, maxWidth: 420, width: '100%' },
});

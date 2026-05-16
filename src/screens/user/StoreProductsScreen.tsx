import React, { useCallback, useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRoute, useNavigation, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Spacing } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { AppHeader } from '../../components/layout/AppHeader';
import { CategoryPill } from '../../components/product/CategoryPill';
import { ProductCard } from '../../components/product/ProductCard';
import { FloatingCartBar } from '../../components/cart/FloatingCartBar';
import { Loader } from '../../components/ui/Loader';
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
  const user = useAuthStore((s) => s.user);
  const [category, setCategory] = useState(store.categories[0] ?? 'Vegetables');
  const { data: products, isLoading } = useStoreProducts(store.id, category);
  const { addToCart, getItemCount, getTotal } = useCart();

  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard
        product={item}
        onPress={() => navigation.navigate('ProductDetail', { product: item })}
        onAdd={() => addToCart(item)}
      />
    ),
    [navigation, addToCart],
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <AppHeader
        showBack
        showBrand
        showSearch
        showAvatar
        avatarUrl={user?.avatarUrl}
        onSearchPress={() => navigation.navigate('MainTabs', { screen: 'Search' })}
      />
      <View style={styles.storeHeader}>
        <View style={styles.storeInfo}>
          <Text style={[styles.storeName, { color: colors.text }]}>{store.name}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="location" size={14} color={colors.primary} />
            <Text style={[styles.meta, { color: colors.textSecondary }]}>
              {formatDeliveryTime(store.deliveryTimeMin, store.deliveryTimeMax)} •{' '}
              {store.deliveryFee === 0 ? 'Free Delivery' : `$${store.deliveryFee} Delivery`}
            </Text>
          </View>
        </View>
        <View style={[styles.ratingBadge, { backgroundColor: colors.ratingBg }]}>
          <Text style={[styles.ratingText, { color: colors.ratingText }]}>
            {formatRating(store.rating, store.reviewCount)}
          </Text>
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categories}
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
      {isLoading ? (
        <Loader />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
        />
      )}
      <View style={styles.cartWrap}>
        <FloatingCartBar
          itemCount={getItemCount()}
          total={getTotal()}
          onPress={() => navigation.navigate('Cart')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  storeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  storeInfo: { flex: 1 },
  storeName: { fontSize: 26, fontWeight: '700' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: Spacing.xs },
  meta: { fontSize: 13 },
  ratingBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
  },
  ratingText: { fontSize: 13, fontWeight: '600' },
  categories: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md },
  list: { paddingHorizontal: Spacing.md, paddingBottom: 100 },
  row: { justifyContent: 'space-between' },
  cartWrap: { position: 'absolute', bottom: 88, left: 0, right: 0 },
});

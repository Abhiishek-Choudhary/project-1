import React, { useCallback } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Shadows, Spacing } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { HomeProductCard } from '../../components/product/HomeProductCard';
import { FloatingCartBar } from '../../components/cart/FloatingCartBar';
import { Loader } from '../../components/ui/Loader';
import { EmptyState } from '../../components/ui/EmptyState';
import { useNearbyStores } from '../../hooks/useStores';
import { useCart } from '../../hooks/useCart';
import { useAuthStore } from '../../store/authStore';
import { MOCK_ESSENTIALS } from '../../api/mockData';
import { formatRating } from '../../utils/format';
import type { Store, Product } from '../../types';
import type { UserStackParamList } from '../../types/navigation';

const POPULAR_CATEGORIES = [
  { id: 'Fruits', label: 'Fruits', icon: 'nutrition-outline' as const, bg: '#E8F5EE', color: '#1B7A4E' },
  { id: 'Vegetables', label: 'Veggies', icon: 'leaf-outline' as const, bg: '#FFF7ED', color: '#EA580C' },
  { id: 'Dairy', label: 'Dairy', icon: 'water-outline' as const, bg: '#E0F2FE', color: '#0369A1' },
  { id: 'Staples', label: 'Staples', icon: 'restaurant-outline' as const, bg: '#F3E8FF', color: '#7C3AED' },
];

export function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<UserStackParamList>>();
  const { colors } = useTheme();
  const user = useAuthStore((s) => s.user);
  const { data: stores, isLoading, isError, refetch } = useNearbyStores();
  const { addToCart, getItemCount, getTotal } = useCart();

  const openStore = useCallback(
    (store: Store) => navigation.navigate('StoreProducts', { store }),
    [navigation],
  );

  const openProduct = useCallback(
    (product: Product) => navigation.navigate('ProductDetail', { product }),
    [navigation],
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.topHeader}>
        <Pressable style={styles.locationBlock}>
          <Ionicons name="location" size={18} color={colors.primary} />
          <View>
            <Text style={[styles.locationLabel, { color: colors.text }]}>Home</Text>
            <Text style={[styles.locationSub, { color: colors.textSecondary }]}>123 Street</Text>
          </View>
          <Ionicons name="chevron-down" size={14} color={colors.text} />
        </Pressable>
        <Text style={[styles.brandCenter, { color: colors.primary }]}>FreshDash</Text>
        <Pressable onPress={() => navigation.navigate('MainTabs', { screen: 'Profile' })}>
          <Image
            source={{ uri: user?.avatarUrl ?? 'https://i.pravatar.cc/80?u=home' }}
            style={styles.avatar}
          />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Pressable
          style={[styles.searchBar, { borderColor: colors.border, backgroundColor: colors.surface }]}
          onPress={() => navigation.navigate('MainTabs', { screen: 'Search' })}
        >
          <Ionicons name="search" size={20} color={colors.textMuted} />
          <Text style={[styles.searchPlaceholder, { color: colors.textMuted }]}>
            Search for groceries, shops...
          </Text>
          <Pressable
            onPress={(e) => {
              e.stopPropagation?.();
              navigation.navigate('ProductScanner');
            }}
            hitSlop={8}
          >
            <Ionicons name="barcode-outline" size={24} color={colors.text} />
          </Pressable>
        </Pressable>

        <View style={[styles.promoBanner, Shadows.card]}>
          <View style={styles.promoLeft}>
            <Text style={styles.promoTitle}>50% Off{'\n'}First Order</Text>
            <Pressable style={styles.claimBtn}>
              <Text style={styles.claimText}>Claim Now</Text>
            </Pressable>
          </View>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop',
            }}
            style={styles.promoImage}
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Nearby Shops</Text>
          <Pressable>
            <Text style={{ color: colors.primary, fontWeight: '600' }}>See All</Text>
          </Pressable>
        </View>
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <EmptyState title="Couldn't load stores" actionLabel="Retry" onAction={() => void refetch()} />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.shopsScroll}>
            {stores?.map((store) => (
              <Pressable
                key={store.id}
                style={[styles.shopCard, Shadows.card, { backgroundColor: colors.surface }]}
                onPress={() => openStore(store)}
              >
                <Image source={{ uri: store.imageUrl }} style={styles.shopImage} />
                <View style={styles.shopInfo}>
                  <Text style={[styles.shopName, { color: colors.text }]} numberOfLines={1}>
                    {store.name}
                  </Text>
                  <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                    {formatRating(store.rating, store.reviewCount)} • {store.distanceKm} km
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        )}

        <Text style={[styles.sectionTitle, styles.sectionPad, { color: colors.text }]}>
          Popular Categories
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
          {POPULAR_CATEGORIES.map((cat) => (
            <Pressable
              key={cat.id}
              style={styles.catItem}
              onPress={() => navigation.navigate('CategoryBrowse', { category: cat.id })}
            >
              <View style={[styles.catCircle, { backgroundColor: cat.bg }]}>
                <Ionicons name={cat.icon} size={28} color={cat.color} />
              </View>
              <Text style={[styles.catLabel, { color: colors.text }]}>{cat.label}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Daily Essentials</Text>
          <Pressable onPress={() => navigation.navigate('CategoryBrowse', { category: 'Staples' })}>
            <Text style={{ color: colors.primary, fontWeight: '600' }}>View More</Text>
          </Pressable>
        </View>
        <View style={styles.essentialsGrid}>
          {MOCK_ESSENTIALS.map((product) => (
            <HomeProductCard
              key={product.id}
              product={product}
              onPress={() => openProduct(product)}
              onAdd={() => addToCart(product)}
            />
          ))}
        </View>
        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={styles.cartWrap}>
        <FloatingCartBar
          compact
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
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  locationBlock: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flex: 1 },
  locationLabel: { fontSize: 14, fontWeight: '700' },
  locationSub: { fontSize: 11 },
  brandCenter: { fontSize: 18, fontWeight: '700', flex: 1, textAlign: 'center' },
  avatar: { width: 36, height: 36, borderRadius: 18 },
  scroll: { paddingBottom: Spacing.lg },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  searchPlaceholder: { flex: 1, fontSize: 14 },
  promoBanner: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    backgroundColor: '#FF8A33',
    marginBottom: Spacing.xl,
    minHeight: 140,
  },
  promoLeft: { flex: 1, padding: Spacing.lg, justifyContent: 'center' },
  promoTitle: { fontSize: 22, fontWeight: '800', color: '#3D2314', lineHeight: 28 },
  claimBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#5D3A1A',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.md,
  },
  claimText: { color: '#FFF', fontWeight: '700', fontSize: 13 },
  promoImage: { width: 130, height: '100%' },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  sectionPad: { paddingHorizontal: Spacing.lg, marginTop: Spacing.lg, marginBottom: Spacing.md },
  shopsScroll: { paddingLeft: Spacing.lg, marginBottom: Spacing.md },
  shopCard: {
    width: 200,
    borderRadius: BorderRadius.lg,
    marginRight: Spacing.md,
    overflow: 'hidden',
  },
  shopImage: { width: '100%', height: 110 },
  shopInfo: { padding: Spacing.md },
  shopName: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  catScroll: { paddingHorizontal: Spacing.lg, gap: Spacing.lg, paddingBottom: Spacing.md },
  catItem: { alignItems: 'center', marginRight: Spacing.xl },
  catCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  catLabel: { fontSize: 13, fontWeight: '500' },
  essentialsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
  },
  cartWrap: { position: 'absolute', bottom: 88, left: 0, right: 0 },
});

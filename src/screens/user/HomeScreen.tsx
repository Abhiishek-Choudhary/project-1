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
import { MOCK_UNSPLASH } from '../../constants/mockImages';
import { BorderRadius, Shadows, Spacing } from '../../constants/theme';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNotificationCenter } from '../../contexts/NotificationContext';
import { useTheme } from '../../contexts/ThemeContext';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { NotificationBell } from '../../components/notifications/NotificationBell';
import { SearchBar } from '../../components/ui/SearchBar';
import { HomeProductCard } from '../../components/product/HomeProductCard';
import { FloatingCartBar } from '../../components/cart/FloatingCartBar';
import { Loader } from '../../components/ui/Loader';
import { EmptyState } from '../../components/ui/EmptyState';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { useNearbyStores } from '../../hooks/useStores';
import { useCart } from '../../hooks/useCart';
import { useAuthStore } from '../../store/authStore';
import { MOCK_ESSENTIALS } from '../../api/mockData';
import { formatRating } from '../../utils/format';
import type { Store, Product } from '../../types';
import type { UserStackParamList } from '../../types/navigation';

export function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<UserStackParamList>>();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const layout = useResponsiveLayout();

  const POPULAR_CATEGORIES = [
    { id: 'Fruits', label: t('categories.fruits'), icon: 'nutrition-outline' as const, bg: '#E8F5EE', color: '#1B7A4E' },
    { id: 'Vegetables', label: t('categories.veggies'), icon: 'leaf-outline' as const, bg: '#FFF7ED', color: '#EA580C' },
    { id: 'Dairy', label: t('categories.dairy'), icon: 'water-outline' as const, bg: '#E0F2FE', color: '#0369A1' },
    { id: 'Staples', label: t('categories.staples'), icon: 'restaurant-outline' as const, bg: '#F3E8FF', color: '#7C3AED' },
  ];
  const user = useAuthStore((s) => s.user);
  const { unreadCount } = useNotificationCenter();
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

  const sectionPad = { paddingHorizontal: layout.gutter };

  const renderShopCard = (store: Store) => (
    <Pressable
      key={store.id}
      style={[
        styles.shopCard,
        Shadows.card,
        { backgroundColor: colors.surface, width: layout.shopCardWidth },
      ]}
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
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <ScreenContainer>
        <View
          style={[
            styles.topHeader,
            sectionPad,
            layout.useWebHeader && styles.topHeaderWeb,
          ]}
        >
          <View style={layout.useWebHeader ? styles.headerSide : styles.locationBlock}>
            <Pressable style={styles.locationBlock}>
              <Ionicons name="location" size={18} color={colors.primary} />
              <View>
                <Text style={[styles.locationLabel, { color: colors.text }]}>{t('home.locationLabel')}</Text>
                <Text style={[styles.locationSub, { color: colors.textSecondary }]}>{t('home.locationSub')}</Text>
              </View>
              <Ionicons name="chevron-down" size={14} color={colors.text} />
            </Pressable>
          </View>
          {!layout.useWebHeader ? (
            <Text style={[styles.brandCenter, { color: colors.primary }]}>FreshDash</Text>
          ) : (
            <Text style={[styles.brandWeb, { color: colors.primary }]}>FreshDash</Text>
          )}
          <View style={[styles.headerActions, layout.useWebHeader && styles.headerActionsWeb]}>
            <NotificationBell
              count={unreadCount}
              onPress={() => navigation.navigate('Notifications')}
            />
            <Pressable onPress={() => navigation.navigate('MainTabs', { screen: 'Profile' })}>
              <Image
                source={{ uri: user?.avatarUrl ?? 'https://i.pravatar.cc/80?u=home' }}
                style={styles.avatar}
              />
            </Pressable>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          <View style={[styles.searchSection, sectionPad]}>
            <SearchBar
              readonly
              placeholder={t('search.homePlaceholder')}
              onPress={() => navigation.navigate('MainTabs', { screen: 'Search' })}
              rightElement={
                <Pressable
                  onPress={() => navigation.navigate('ProductScanner')}
                  hitSlop={8}
                  style={[styles.scanBtn, { backgroundColor: colors.backgroundSecondary }]}
                >
                  <Ionicons name="barcode-outline" size={22} color={colors.text} />
                </Pressable>
              }
            />
          </View>

          <View
            style={[
              styles.promoBanner,
              Shadows.card,
              { marginHorizontal: layout.gutter },
              layout.isDesktop && styles.promoBannerDesktop,
            ]}
          >
            <View style={styles.promoLeft}>
              <Text style={styles.promoTitle}>{t('home.promoTitle')}</Text>
              <Pressable style={styles.claimBtn}>
                <Text style={styles.claimText}>{t('home.claimNow')}</Text>
              </Pressable>
            </View>
            <Image
              source={{ uri: MOCK_UNSPLASH.produce }}
              style={[styles.promoImage, layout.isDesktop && styles.promoImageDesktop]}
            />
          </View>

          <View style={[styles.sectionHeader, sectionPad]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('home.nearbyShops')}</Text>
            <Pressable>
              <Text style={{ color: colors.primary, fontWeight: '600' }}>See All</Text>
            </Pressable>
          </View>
          {isLoading ? (
            <Loader />
          ) : isError ? (
            <EmptyState title="Couldn't load stores" actionLabel="Retry" onAction={() => void refetch()} />
          ) : layout.useShopCarousel ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.shopsScroll}>
              <View style={{ paddingLeft: layout.gutter, flexDirection: 'row', gap: layout.gap }}>
                {stores?.map(renderShopCard)}
              </View>
            </ScrollView>
          ) : (
            <View style={[styles.shopsGrid, sectionPad, { gap: layout.gap }]}>
              {stores?.map(renderShopCard)}
            </View>
          )}

          <Text style={[styles.sectionTitle, styles.sectionPad, sectionPad, { color: colors.text }]}>
            {t('home.popularCategories')}
          </Text>
          {layout.useCategoryCarousel ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.catScroll, { paddingHorizontal: layout.gutter }]}>
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
          ) : (
            <View style={[styles.categoriesGrid, sectionPad, { gap: layout.gap }]}>
              {POPULAR_CATEGORIES.map((cat) => (
                <Pressable
                  key={cat.id}
                  style={[styles.catGridItem, { width: layout.categoryItemWidth }]}
                  onPress={() => navigation.navigate('CategoryBrowse', { category: cat.id })}
                >
                  <View style={[styles.catCircle, { backgroundColor: cat.bg }]}>
                    <Ionicons name={cat.icon} size={28} color={cat.color} />
                  </View>
                  <Text style={[styles.catLabel, { color: colors.text }]}>{cat.label}</Text>
                </Pressable>
              ))}
            </View>
          )}

          <View style={[styles.sectionHeader, sectionPad]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('home.dailyEssentials')}</Text>
            <Pressable onPress={() => navigation.navigate('CategoryBrowse', { category: 'Staples' })}>
              <Text style={{ color: colors.primary, fontWeight: '600' }}>{t('home.viewMore')}</Text>
            </Pressable>
          </View>
          <View style={[styles.essentialsGrid, sectionPad, { gap: layout.gap }]}>
            {MOCK_ESSENTIALS.map((product) => (
              <View key={product.id} style={{ width: layout.productCardWidth }}>
                <HomeProductCard
                  product={product}
                  onPress={() => openProduct(product)}
                  onAdd={() => addToCart(product)}
                />
              </View>
            ))}
          </View>
          <View style={{ height: layout.showBrowseNav ? 120 : 88 }} />
        </ScrollView>

        <View style={[styles.cartWrap, layout.isWeb && styles.cartWrapWeb, sectionPad]}>
          <FloatingCartBar
            compact
            itemCount={getItemCount()}
            total={getTotal()}
            onPress={() => navigation.navigate('Cart')}
            style={layout.isWeb ? styles.cartBarWeb : undefined}
          />
        </View>
      </ScreenContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
  },
  topHeaderWeb: { gap: Spacing.md },
  headerSide: { flex: 1 },
  locationBlock: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flex: 1 },
  locationLabel: { fontSize: 14, fontWeight: '700' },
  locationSub: { fontSize: 11 },
  brandCenter: { fontSize: 18, fontWeight: '700', flex: 1, textAlign: 'center' },
  brandWeb: { fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  headerActionsWeb: { flex: 1, justifyContent: 'flex-end' },
  avatar: { width: 36, height: 36, borderRadius: 18 },
  scroll: { paddingBottom: Spacing.lg },
  searchSection: { marginBottom: Spacing.lg },
  scanBtn: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoBanner: {
    flexDirection: 'row',
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    backgroundColor: '#FF8A33',
    marginBottom: Spacing.xl,
    minHeight: 140,
  },
  promoBannerDesktop: { minHeight: 180 },
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
  promoImageDesktop: { width: 280 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  sectionPad: { marginTop: Spacing.lg, marginBottom: Spacing.md },
  shopsScroll: { marginBottom: Spacing.md },
  shopsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.md,
  },
  shopCard: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  shopImage: { width: '100%', height: 110 },
  shopInfo: { padding: Spacing.md },
  shopName: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  catScroll: { gap: Spacing.lg, paddingBottom: Spacing.md },
  catItem: { alignItems: 'center', marginRight: Spacing.xl },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.md,
  },
  catGridItem: { alignItems: 'center' },
  catCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  catLabel: { fontSize: 13, fontWeight: '500', textAlign: 'center' },
  essentialsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cartWrap: { position: 'absolute', bottom: 130, left: 0, right: 0 },
  cartWrapWeb: { alignItems: 'center' },
  cartBarWeb: { marginHorizontal: 0, maxWidth: 420, width: '100%' },
});

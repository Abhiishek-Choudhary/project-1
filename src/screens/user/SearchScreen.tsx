import React, { useCallback, useState } from 'react';
import {
  FlatList,
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
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { BorderRadius, Spacing, Typography } from '../../constants/theme';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { SearchBar } from '../../components/ui/SearchBar';
import { ProductCard } from '../../components/product/ProductCard';
import { Loader } from '../../components/ui/Loader';
import { useProductSearch } from '../../hooks/useStores';
import { useCart } from '../../hooks/useCart';
import type { UserStackParamList } from '../../types/navigation';

const TRENDING = ['Organic milk', 'Strawberries', 'Avocado', 'Tomatoes', 'Spinach', 'Basmati rice'];

export function SearchScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<UserStackParamList>>();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const layout = useResponsiveLayout();

  const CATEGORIES = [
    { id: 'Fruits', label: t('categories.fruits'), icon: 'nutrition-outline' as const },
    { id: 'Vegetables', label: t('categories.veggies'), icon: 'leaf-outline' as const },
    { id: 'Dairy', label: t('categories.dairy'), icon: 'water-outline' as const },
    { id: 'Staples', label: t('categories.staples'), icon: 'restaurant-outline' as const },
  ];
  const [query, setQuery] = useState('');
  const { data: results, isLoading } = useProductSearch(query);
  const { addToCart } = useCart();

  const runSearch = useCallback((term: string) => setQuery(term), []);

  const showResults = query.trim().length >= 2;

  const categoryCardWidth =
    layout.productColumns >= 4
      ? Math.floor((layout.innerWidth - layout.gap * 3) / 4)
      : layout.productColumns === 3
        ? Math.floor((layout.innerWidth - layout.gap * 2) / 3)
        : undefined;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <ScreenContainer padded>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{t('search.title')}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {t('search.subtitle')}
        </Text>
      </View>

      <View style={[styles.searchSection, { paddingHorizontal: 0 }]}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          onClear={() => setQuery('')}
          placeholder={t('search.placeholder')}
          autoFocus
        />
      </View>

      {!showResults ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.discovery}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[styles.sectionLabel, { color: colors.text }]}>{t('search.trending')}</Text>
          <View style={styles.chipRow}>
            {TRENDING.map((term) => (
              <Pressable
                key={term}
                onPress={() => runSearch(term)}
                style={[styles.chip, { backgroundColor: colors.primaryLight }]}
              >
                <Ionicons name="trending-up" size={14} color={colors.primary} />
                <Text style={[styles.chipText, { color: colors.primary }]}>{term}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={[styles.sectionLabel, { color: colors.text }]}>{t('search.shopByCategory')}</Text>
          <View style={[styles.categoryGrid, { gap: layout.gap }]}>
            {CATEGORIES.map((cat) => (
              <Pressable
                key={cat.id}
                onPress={() => navigation.navigate('CategoryBrowse', { category: cat.id })}
                style={[
                  styles.categoryCard,
                  { backgroundColor: colors.surface },
                  categoryCardWidth != null ? { width: categoryCardWidth } : { width: '47%' },
                ]}
              >
                <View style={[styles.categoryIcon, { backgroundColor: colors.primaryLight }]}>
                  <Ionicons name={cat.icon} size={22} color={colors.primary} />
                </View>
                <Text style={[styles.categoryLabel, { color: colors.text }]}>{cat.label}</Text>
              </Pressable>
            ))}
          </View>

          <View style={[styles.tipCard, { backgroundColor: colors.backgroundSecondary }]}>
            <Ionicons name="barcode-outline" size={28} color={colors.primary} />
            <View style={styles.tipText}>
              <Text style={[styles.tipTitle, { color: colors.text }]}>{t('search.scanTitle')}</Text>
              <Text style={[styles.tipBody, { color: colors.textSecondary }]}>
                {t('search.scanBody')}
              </Text>
            </View>
          </View>
        </ScrollView>
      ) : isLoading ? (
        <Loader />
      ) : (
        <FlatList
          data={results}
          key={`cols-${layout.productColumns}`}
          keyExtractor={(item) => item.id}
          numColumns={layout.productColumns}
          columnWrapperStyle={layout.productColumns > 1 ? styles.row : undefined}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <Text style={[styles.resultCount, { color: colors.textSecondary }]}>
              {t('search.results', { count: results?.length ?? 0, query })}
            </Text>
          }
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => navigation.navigate('ProductDetail', { product: item })}
              onAdd={() => addToCart(item)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="search-outline" size={48} color={colors.textMuted} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>{t('search.noMatches')}</Text>
              <Text style={[styles.emptyBody, { color: colors.textSecondary }]}>
                {t('search.noMatchesBody')}
              </Text>
            </View>
          }
        />
      )}
      </ScreenContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  title: { ...Typography.h1, fontSize: 28 },
  subtitle: { fontSize: 14, marginTop: 4 },
  searchSection: {
    paddingBottom: Spacing.md,
  },
  discovery: {
    paddingBottom: 120,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  chipText: { fontSize: 13, fontWeight: '600' },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  categoryCard: {
    width: '47%',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryLabel: { fontSize: 14, fontWeight: '600' },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  tipTitle: { fontSize: 15, fontWeight: '700' },
  tipBody: { fontSize: 13, marginTop: 2, lineHeight: 18 },
  tipText: { flex: 1 },
  resultCount: {
    fontSize: 13,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },
  hint: { textAlign: 'center', marginTop: Spacing.xxxl },
  list: { padding: Spacing.md, paddingBottom: 120 },
  row: { justifyContent: 'space-between' },
  empty: {
    alignItems: 'center',
    paddingTop: Spacing.xxxl,
    gap: Spacing.sm,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700' },
  emptyBody: { fontSize: 14, textAlign: 'center', paddingHorizontal: Spacing.xxl },
});

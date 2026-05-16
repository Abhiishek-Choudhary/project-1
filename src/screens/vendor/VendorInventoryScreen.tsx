import React, { useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Shadows, Spacing } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { VendorHeader } from '../../components/layout/VendorHeader';
import { MOCK_VENDOR_INVENTORY } from '../../api/vendorMockData';
import { formatCurrency } from '../../utils/format';
import type { VendorInventoryItem } from '../../types';
import type { VendorStackParamList } from '../../types/navigation';

const CATEGORIES = ['All items', 'Vegetables', 'Fruits', 'Dairy'];

export function VendorInventoryScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<VendorStackParamList>>();
  const { colors } = useTheme();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All items');
  const [items, setItems] = useState(MOCK_VENDOR_INVENTORY);

  const filtered = items.filter((item) => {
    const matchCat =
      category === 'All items' ||
      item.category.toLowerCase().includes(category.toLowerCase().slice(0, 4));
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const toggleStock = (id: string, value: boolean) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, inStock: value, isSoldOut: !value } : i)),
    );
  };

  const openProductForm = () => {
    navigation.getParent()?.navigate('VendorProductForm', {});
  };

  const renderItem = ({ item }: { item: VendorInventoryItem }) => (
    <View style={[styles.card, Shadows.card, { backgroundColor: colors.surface }]}>
      <View style={styles.imageWrap}>
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
        {item.isLowStock && !item.isSoldOut && (
          <View style={styles.lowStockBadge}>
            <Ionicons name="warning" size={10} color="#FFF" />
            <Text style={styles.lowStockText}>LOW STOCK</Text>
          </View>
        )}
        {item.isSoldOut && (
          <View style={styles.soldOutOverlay}>
            <Text style={styles.soldOutText}>SOLD OUT</Text>
          </View>
        )}
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
            <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
              {item.category} • {item.unit}
            </Text>
          </View>
          <Text style={[styles.price, { color: colors.primary }]}>
            {formatCurrency(item.price)}
          </Text>
        </View>
        <View style={styles.stockRow}>
          <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
            Inventory{' '}
            <Text
              style={{
                fontWeight: '700',
                color: item.isLowStock ? colors.error : colors.text,
              }}
            >
              {item.isSoldOut ? '0 left' : `${item.stockCount} left`}
            </Text>
          </Text>
          <View style={styles.toggleRow}>
            <Text style={{ color: colors.textSecondary, fontSize: 13, marginRight: Spacing.sm }}>
              In Stock
            </Text>
            <Switch
              value={item.inStock}
              onValueChange={(v) => toggleStock(item.id, v)}
              trackColor={{ true: colors.primary }}
            />
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.backgroundSecondary }]} edges={['top']}>
      <VendorHeader />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <>
            <Text style={[styles.pageTitle, { color: colors.text }]}>Inventory Management</Text>
            <Text style={[styles.pageSub, { color: colors.textSecondary }]}>
              Manage your fresh stock and product availability.
            </Text>
            <View style={[styles.searchBar, { backgroundColor: colors.settingsGroup }]}>
              <Ionicons name="search" size={20} color={colors.textMuted} />
              <TextInput
                placeholder="Search products..."
                placeholderTextColor={colors.textMuted}
                value={search}
                onChangeText={setSearch}
                style={[styles.searchInput, { color: colors.text }]}
              />
            </View>
            <Pressable style={[styles.filterBtn, { backgroundColor: colors.settingsGroup }]}>
              <Ionicons name="options-outline" size={20} color={colors.text} />
              <Text style={{ color: colors.text, fontWeight: '600' }}>Filters</Text>
            </Pressable>
            <FlatList
              horizontal
              data={CATEGORIES}
              keyExtractor={(c) => c}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categories}
              renderItem={({ item: cat }) => (
                <Pressable
                  onPress={() => setCategory(cat)}
                  style={[
                    styles.catPill,
                    category === cat
                      ? { backgroundColor: colors.primary }
                      : { backgroundColor: colors.borderLight },
                  ]}
                >
                  <Text
                    style={{
                      color: category === cat ? '#FFF' : colors.text,
                      fontWeight: '600',
                      fontSize: 13,
                    }}
                  >
                    {cat}
                  </Text>
                </Pressable>
              )}
            />
          </>
        }
      />
      <Pressable
        style={[styles.fab, { backgroundColor: colors.accent }, Shadows.floating]}
        onPress={openProductForm}
      >
        <Ionicons name="add" size={22} color="#FFF" />
        <Text style={styles.fabText}>Add New Product</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  list: { padding: Spacing.lg, paddingBottom: 120 },
  pageTitle: { fontSize: 26, fontWeight: '700' },
  pageSub: { fontSize: 14, marginTop: Spacing.xs, marginBottom: Spacing.lg },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    minHeight: 48,
  },
  searchInput: { flex: 1, fontSize: 15 },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  categories: { gap: Spacing.sm, marginBottom: Spacing.lg },
  catPill: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.sm,
  },
  card: { borderRadius: BorderRadius.lg, marginBottom: Spacing.lg, overflow: 'hidden' },
  imageWrap: { position: 'relative' },
  image: { width: '100%', height: 140 },
  lowStockBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DC2626',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  lowStockText: { color: '#FFF', fontSize: 9, fontWeight: '800' },
  soldOutOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  soldOutText: { color: '#FFF', fontSize: 16, fontWeight: '800', letterSpacing: 1 },
  cardBody: { padding: Spacing.lg },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between' },
  name: { fontSize: 16, fontWeight: '700' },
  price: { fontSize: 16, fontWeight: '700' },
  stockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
  },
  toggleRow: { flexDirection: 'row', alignItems: 'center' },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  fabText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
});

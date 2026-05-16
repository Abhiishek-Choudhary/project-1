import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Spacing } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { Input } from '../../components/ui/Input';
import { ProductCard } from '../../components/product/ProductCard';
import { Loader } from '../../components/ui/Loader';
import { useProductSearch } from '../../hooks/useStores';
import { useCart } from '../../hooks/useCart';
import { MOCK_STORES } from '../../api/mockData';
import type { UserStackParamList } from '../../types/navigation';

export function SearchScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<UserStackParamList>>();
  const { colors } = useTheme();
  const [query, setQuery] = useState('');
  const { data: results, isLoading } = useProductSearch(query);
  const { addToCart } = useCart();
  const defaultStore = MOCK_STORES[0]!;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <Text style={[styles.brand, { color: colors.primary }]}>FreshDash</Text>
      <View style={styles.searchWrap}>
        <Input
          placeholder="Search groceries..."
          value={query}
          onChangeText={setQuery}
          autoFocus
        />
      </View>
      {query.length < 2 ? (
        <Text style={[styles.hint, { color: colors.textSecondary }]}>
          Type at least 2 characters to search
        </Text>
      ) : isLoading ? (
        <Loader />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => navigation.navigate('ProductDetail', { product: item })}
              onAdd={() => addToCart(item)}
            />
          )}
          ListEmptyComponent={
            <Text style={[styles.hint, { color: colors.textSecondary }]}>No products found</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  brand: { fontSize: 24, fontWeight: '700', paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  searchWrap: { paddingHorizontal: Spacing.lg },
  hint: { textAlign: 'center', marginTop: Spacing.xxxl },
  list: { padding: Spacing.md, paddingBottom: 100 },
  row: { justifyContent: 'space-between' },
});

import React from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';
import { useRoute, type RouteProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Spacing } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { AppHeader } from '../../components/layout/AppHeader';
import { ProductCard } from '../../components/product/ProductCard';
import { Loader } from '../../components/ui/Loader';
import { useStoreProducts } from '../../hooks/useStores';
import { useCart } from '../../hooks/useCart';
import { MOCK_STORES } from '../../api/mockData';
import type { UserStackParamList } from '../../types/navigation';

export function CategoryBrowseScreen() {
  const route = useRoute<RouteProp<UserStackParamList, 'CategoryBrowse'>>();
  const navigation = useNavigation<NativeStackNavigationProp<UserStackParamList>>();
  const { colors } = useTheme();
  const store = MOCK_STORES[0]!;
  const { data: products, isLoading } = useStoreProducts(store.id, route.params.category);
  const { addToCart } = useCart();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <AppHeader showBack title={route.params.category} />
      {isLoading ? (
        <Loader />
      ) : (
        <FlatList
          data={products}
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
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  list: { padding: Spacing.md, paddingBottom: 40 },
  row: { justifyContent: 'space-between' },
});

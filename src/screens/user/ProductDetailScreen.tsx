import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  FlatList,
} from 'react-native';
import { useRoute, useNavigation, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Spacing } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { AppHeader } from '../../components/layout/AppHeader';
import { Badge } from '../../components/ui/Badge';
import { QuantitySelector } from '../../components/ui/QuantitySelector';
import { Button } from '../../components/ui/Button';
import { useRelatedProducts } from '../../hooks/useStores';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/format';
import type { UserStackParamList } from '../../types/navigation';
import type { Product } from '../../types';

export function ProductDetailScreen() {
  const route = useRoute<RouteProp<UserStackParamList, 'ProductDetail'>>();
  const navigation = useNavigation<NativeStackNavigationProp<UserStackParamList>>();
  const { product } = route.params;
  const { colors } = useTheme();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { data: related = [] } = useRelatedProducts(product.id);

  const nutrition = product.nutrition;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <AppHeader showBack showBrand />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageWrap}>
          <Image source={{ uri: product.imageUrl }} style={styles.heroImage} />
          <View style={[styles.deliveryBadge, { backgroundColor: colors.primaryDark }]}>
            <Ionicons name="car-outline" size={14} color="#FFF" />
            <Text style={styles.deliveryText}>15-20 mins</Text>
          </View>
        </View>
        <View style={styles.infoSection}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: colors.text }]}>{product.name}</Text>
            <View style={styles.priceCol}>
              <Text style={[styles.price, { color: colors.primary }]}>
                {formatCurrency(product.price)}
              </Text>
              {product.pricePerKg && (
                <Text style={[styles.perKg, { color: colors.textSecondary }]}>
                  Price per kg: {formatCurrency(product.pricePerKg)}
                </Text>
              )}
            </View>
          </View>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{product.unit}</Text>
        </View>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
          <Text style={[styles.desc, { color: colors.textSecondary }]}>{product.description}</Text>
          <View style={styles.tags}>
            {(product.tags ?? []).map((tag) => (
              <Badge key={tag} label={tag} type="default" />
            ))}
          </View>
        </View>
        {nutrition && (
          <View style={styles.nutritionGrid}>
            {[
              { label: 'Calories', value: nutrition.calories },
              { label: 'Fiber', value: nutrition.fiber },
              { label: 'Sugar', value: nutrition.sugar },
              { label: 'Vitamin C', value: nutrition.vitaminC },
            ].map((n) => (
              <View key={n.label} style={[styles.nutritionCard, { backgroundColor: colors.infoLight }]}>
                <Text style={[styles.nutLabel, { color: colors.textSecondary }]}>{n.label}</Text>
                <Text style={[styles.nutValue, { color: colors.primary }]}>{n.value}</Text>
              </View>
            ))}
          </View>
        )}
        <Text style={[styles.sectionTitle, styles.sectionPad, { color: colors.text }]}>
          Customers also bought
        </Text>
        <FlatList
          horizontal
          data={related}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.relatedList}
          renderItem={({ item }: { item: Product }) => (
            <Pressable
              style={[styles.relatedCard, { backgroundColor: colors.surface }]}
              onPress={() => navigation.navigate('ProductDetail', { product: item })}
            >
              <Image source={{ uri: item.imageUrl }} style={styles.relatedImage} />
              <Text style={[styles.relatedName, { color: colors.text }]} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={[styles.relatedPrice, { color: colors.primary }]}>
                {formatCurrency(item.price)}
              </Text>
              <Pressable
                style={[styles.relatedAdd, { backgroundColor: colors.primary }]}
                onPress={() => addToCart(item)}
              >
                <Ionicons name="add" size={16} color="#FFF" />
              </Pressable>
            </Pressable>
          )}
        />
        <View style={{ height: 120 }} />
      </ScrollView>
      <View style={[styles.bottomBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <QuantitySelector
          variant="wide"
          quantity={quantity}
          onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
          onIncrease={() => setQuantity((q) => q + 1)}
        />
        <Button
          title="Add to Cart"
          onPress={() => {
            addToCart(product, quantity);
            navigation.goBack();
          }}
          icon={<Ionicons name="cart" size={18} color="#FFF" />}
          style={styles.addBtn}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  imageWrap: { position: 'relative' },
  heroImage: { width: '100%', height: 280 },
  deliveryBadge: {
    position: 'absolute',
    bottom: Spacing.lg,
    right: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    opacity: 0.9,
  },
  deliveryText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  infoSection: { padding: Spacing.lg },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.md },
  title: { fontSize: 22, fontWeight: '700', flex: 1 },
  priceCol: { alignItems: 'flex-end' },
  price: { fontSize: 22, fontWeight: '700' },
  perKg: { fontSize: 11, marginTop: 2 },
  subtitle: { fontSize: 14, marginTop: Spacing.sm },
  card: {
    marginHorizontal: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: Spacing.sm },
  sectionPad: { paddingHorizontal: Spacing.lg, marginTop: Spacing.md },
  desc: { fontSize: 14, lineHeight: 22 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginTop: Spacing.md },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  nutritionCard: {
    width: '47%',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  nutLabel: { fontSize: 12 },
  nutValue: { fontSize: 22, fontWeight: '700', marginTop: 4 },
  relatedList: { paddingHorizontal: Spacing.lg, gap: Spacing.md, paddingBottom: Spacing.lg },
  relatedCard: {
    width: 140,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginRight: Spacing.md,
    position: 'relative',
  },
  relatedImage: { width: '100%', height: 90, borderRadius: BorderRadius.md },
  relatedName: { fontSize: 13, fontWeight: '600', marginTop: Spacing.sm },
  relatedPrice: { fontSize: 14, fontWeight: '700', marginTop: 2 },
  relatedAdd: {
    position: 'absolute',
    bottom: Spacing.md,
    right: Spacing.md,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    gap: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  addBtn: { flex: 1 },
});

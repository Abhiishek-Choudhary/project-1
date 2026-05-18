import React, { memo, useCallback } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProductBadge } from '../../constants/enums';
import { BorderRadius, Spacing } from '../../constants/theme';
import { cardShadow } from '../../utils/platformLayout';
import { useTheme } from '../../contexts/ThemeContext';
import type { Product } from '../../types';
import { formatCurrency } from '../../utils/format';
import { Badge } from '../ui/Badge';

interface HomeProductCardProps {
  product: Product;
  onPress: () => void;
  onAdd: () => void;
}

export const HomeProductCard = memo(function HomeProductCard({
  product,
  onPress,
  onAdd,
}: HomeProductCardProps) {
  const { colors } = useTheme();

  const handleAdd = useCallback(
    (e: { stopPropagation?: () => void }) => {
      e.stopPropagation?.();
      onAdd();
    },
    [onAdd],
  );

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        cardShadow(3),
        { backgroundColor: colors.surface },
        pressed && { opacity: 0.95 },
      ]}
    >
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: product.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        {product.badge && (
          <View style={styles.badgePos}>
            <Badge label={product.badge} type={product.badge} />
          </View>
        )}
      </View>
      <View style={styles.content}>
        {product.brand && (
          <Text style={[styles.brand, { color: colors.textMuted }]}>{product.brand}</Text>
        )}
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
          {product.name}
        </Text>
        <View style={styles.footer}>
          <Text style={[styles.price, { color: colors.primary }]}>
            {formatCurrency(product.price)}
          </Text>
          <Pressable
            onPress={handleAdd}
            style={[styles.addBtn, { backgroundColor: colors.primary }]}
          >
            <Ionicons name="add" size={20} color="#FFF" />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  imageWrap: { position: 'relative', width: '100%' },
  image: {
    width: '100%',
    height: 118,
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
  },
  badgePos: { position: 'absolute', top: Spacing.sm, left: Spacing.sm },
  content: { padding: Spacing.md },
  brand: { fontSize: 11, marginBottom: 2 },
  name: { fontSize: 14, fontWeight: '700', lineHeight: 18, minHeight: 40 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  price: { fontSize: 15, fontWeight: '700' },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

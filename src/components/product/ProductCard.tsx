import React, { memo, useCallback } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProductBadge } from '../../constants/enums';
import { BorderRadius, Shadows, Spacing } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import type { Product } from '../../types';
import { formatCurrency } from '../../utils/format';
import { Badge } from '../ui/Badge';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onAdd: () => void;
}

export const ProductCard = memo(function ProductCard({
  product,
  onPress,
  onAdd,
}: ProductCardProps) {
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
        Shadows.card,
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
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={[styles.unit, { color: colors.textSecondary }]}>{product.unit}</Text>
        <View style={styles.footer}>
          <View>
            <Text style={[styles.price, { color: colors.primary }]}>
              {formatCurrency(product.price)}
            </Text>
            {product.originalPrice && (
              <Text style={[styles.original, { color: colors.textMuted }]}>
                {formatCurrency(product.originalPrice)}
              </Text>
            )}
          </View>
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
    height: 132,
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
  },
  badgePos: { position: 'absolute', top: Spacing.sm, left: Spacing.sm },
  content: { padding: Spacing.md },
  name: { fontSize: 14, fontWeight: '700', lineHeight: 18 },
  unit: { fontSize: 12, marginTop: 2 },
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  price: { fontSize: 15, fontWeight: '700' },
  original: { fontSize: 11, textDecorationLine: 'line-through' },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

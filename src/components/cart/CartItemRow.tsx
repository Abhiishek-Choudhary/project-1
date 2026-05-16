import React, { memo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BorderRadius, Shadows, Spacing } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import type { CartItem } from '../../types';
import { formatCurrency } from '../../utils/format';
import { QuantitySelector } from '../ui/QuantitySelector';

interface CartItemRowProps {
  item: CartItem;
  onRemove: () => void;
  onQuantityChange: (qty: number) => void;
}

export const CartItemRow = memo(function CartItemRow({
  item,
  onRemove,
  onQuantityChange,
}: CartItemRowProps) {
  const { colors } = useTheme();
  const { product, quantity } = item;

  return (
    <View style={[styles.card, Shadows.card, { backgroundColor: colors.surface }]}>
      <Pressable onPress={onRemove} style={styles.trash} hitSlop={8}>
        <Ionicons name="trash-outline" size={18} color={colors.textMuted} />
      </Pressable>
      <Image source={{ uri: product.imageUrl }} style={styles.image} />
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={[styles.unit, { color: colors.textSecondary }]}>{product.unit}</Text>
        <Text style={[styles.price, { color: colors.primary }]}>
          {formatCurrency(product.price * quantity)}
        </Text>
      </View>
      <View style={styles.controls}>
        <QuantitySelector
          quantity={quantity}
          onDecrease={() => onQuantityChange(quantity - 1)}
          onIncrease={() => onQuantityChange(quantity + 1)}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  trash: { position: 'absolute', top: Spacing.md, right: Spacing.md, zIndex: 1 },
  image: { width: 72, height: 72, borderRadius: BorderRadius.md },
  info: { flex: 1, marginLeft: Spacing.md, paddingRight: Spacing.xl },
  name: { fontSize: 15, fontWeight: '700' },
  unit: { fontSize: 12, marginTop: 2 },
  price: { fontSize: 16, fontWeight: '700', marginTop: Spacing.sm },
  controls: { alignSelf: 'flex-end' },
});

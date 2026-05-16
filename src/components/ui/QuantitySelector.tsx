import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BorderRadius, Spacing } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';

interface QuantitySelectorProps {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  variant?: 'compact' | 'wide';
}

export const QuantitySelector = memo(function QuantitySelector({
  quantity,
  onDecrease,
  onIncrease,
  variant = 'compact',
}: QuantitySelectorProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        variant === 'wide' && styles.wide,
        { backgroundColor: colors.quantityBg },
      ]}
    >
      <Pressable onPress={onDecrease} hitSlop={8} style={styles.btn}>
        <Ionicons name="remove" size={18} color={colors.quantityText} />
      </Pressable>
      <Text style={[styles.qty, { color: colors.quantityText }]}>{quantity}</Text>
      <Pressable
        onPress={onIncrease}
        hitSlop={8}
        style={[styles.plusBtn, { backgroundColor: colors.primary }]}
      >
        <Ionicons name="add" size={16} color="#FFF" />
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    gap: Spacing.sm,
  },
  wide: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  btn: { padding: Spacing.xs },
  plusBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qty: { fontSize: 15, fontWeight: '700', minWidth: 20, textAlign: 'center' },
});

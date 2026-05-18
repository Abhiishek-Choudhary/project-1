import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BorderRadius, Shadows, Spacing } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { formatCurrency } from '../../utils/format';

interface FloatingCartBarProps {
  itemCount: number;
  total: number;
  onPress: () => void;
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const FloatingCartBar = memo(function FloatingCartBar({
  itemCount,
  total,
  onPress,
  compact = false,
  style,
}: FloatingCartBarProps) {
  const { colors } = useTheme();

  if (itemCount === 0) return null;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.bar,
        Shadows.floating,
        { backgroundColor: colors.cartBar },
        pressed && { opacity: 0.92 },
        style,
      ]}
    >
      <Ionicons name="cart" size={20} color="#FFF" />
      <Text style={styles.text}>
        View Cart ({itemCount}{compact ? '' : ' items'})
      </Text>
      {!compact && (
        <>
          <View style={styles.divider} />
          <Text style={styles.total}>{formatCurrency(total)}</Text>
        </>
      )}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Spacing.lg,
    paddingVertical: Spacing.md + 2,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.full,
    gap: Spacing.md,
  },
  text: { color: '#FFF', fontSize: 15, fontWeight: '700', flex: 1 },
  divider: { width: 1, height: 20, backgroundColor: 'rgba(255,255,255,0.4)' },
  total: { color: '#FFF', fontSize: 15, fontWeight: '700' },
});

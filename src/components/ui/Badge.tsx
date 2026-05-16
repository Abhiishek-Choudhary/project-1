import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ProductBadge } from '../../constants/enums';
import { BorderRadius, Spacing } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';

interface BadgeProps {
  label: string;
  type?: ProductBadge | 'default' | 'count';
}

export const Badge = memo(function Badge({ label, type = 'default' }: BadgeProps) {
  const { colors } = useTheme();

  const palette = {
    [ProductBadge.Organic]: {
      bg: colors.badgeOrganic,
      text: colors.badgeOrganicText,
    },
    [ProductBadge.Sale]: {
      bg: colors.badgeSale,
      text: colors.badgeSaleText,
    },
    default: { bg: colors.itemBadge, text: colors.itemBadgeText },
    count: { bg: colors.itemBadge, text: colors.itemBadgeText },
  }[type];

  return (
    <View style={[styles.badge, { backgroundColor: palette.bg }]}>
      <Text style={[styles.text, { color: palette.text }]}>{label}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  text: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
});

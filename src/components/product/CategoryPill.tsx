import React, { memo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { BorderRadius, Spacing } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';

interface CategoryPillProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

export const CategoryPill = memo(function CategoryPill({
  label,
  active,
  onPress,
}: CategoryPillProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.pill,
        active
          ? { backgroundColor: colors.primary, borderColor: colors.primary }
          : { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: active ? colors.white : colors.text },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    marginRight: Spacing.sm,
  },
  text: { fontSize: 14, fontWeight: '600' },
});

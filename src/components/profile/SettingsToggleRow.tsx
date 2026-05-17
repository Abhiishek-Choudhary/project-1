import React, { memo } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';

interface SettingsToggleRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  showBorder?: boolean;
}

export const SettingsToggleRow = memo(function SettingsToggleRow({
  icon,
  label,
  subtitle,
  value,
  onValueChange,
  showBorder = true,
}: SettingsToggleRowProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.row,
        showBorder && {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <Ionicons name={icon} size={22} color={colors.textSecondary} />
      <View style={styles.textBlock}>
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor="#FFFFFF"
        ios_backgroundColor={colors.border}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  textBlock: { flex: 1 },
  label: { fontSize: 15, fontWeight: '600' },
  subtitle: { fontSize: 12, marginTop: 2 },
});

import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BorderRadius, Spacing } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import type { AppLocale } from '../../store/languageStore';

interface LanguageSelectorProps {
  locale: AppLocale;
  label: string;
  englishLabel: string;
  hindiLabel: string;
  onChange: (locale: AppLocale) => void;
}

export const LanguageSelector = memo(function LanguageSelector({
  locale,
  label,
  englishLabel,
  hindiLabel,
  onChange,
}: LanguageSelectorProps) {
  const { colors, isDark } = useTheme();

  const options: { id: AppLocale; label: string }[] = [
    { id: 'en', label: englishLabel },
    { id: 'hi', label: hindiLabel },
  ];

  return (
    <View style={styles.row}>
      <Ionicons name="language-outline" size={22} color={colors.textSecondary} />
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <View style={[styles.segment, { backgroundColor: isDark ? colors.background : colors.backgroundSecondary }]}>
        {options.map((opt) => {
          const active = locale === opt.id;
          return (
            <Pressable
              key={opt.id}
              onPress={() => onChange(opt.id)}
              style={[styles.chip, active && { backgroundColor: colors.primary }]}
            >
              <Text
                style={[styles.chipText, { color: active ? '#FFFFFF' : colors.textSecondary }]}
              >
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
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
  label: { flex: 1, fontSize: 15, fontWeight: '600' },
  segment: {
    flexDirection: 'row',
    borderRadius: BorderRadius.full,
    padding: 3,
    gap: 2,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  chipText: { fontSize: 13, fontWeight: '700' },
});

import React, { forwardRef, memo } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { BorderRadius, Spacing } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = memo(
  forwardRef<TextInput, InputProps>(function Input(
    { label, error, leftIcon, rightElement, style, ...props },
    ref,
  ) {
    const { colors } = useTheme();

    return (
      <View style={styles.wrapper}>
        {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}
        <View
          style={[
            styles.inputRow,
            {
              backgroundColor: colors.backgroundSecondary,
              borderColor: error ? colors.error : colors.border,
            },
          ]}
        >
          {leftIcon}
          <TextInput
            ref={ref}
            placeholderTextColor={colors.textMuted}
            style={[styles.input, { color: colors.text }, style]}
            {...props}
          />
          {rightElement}
        </View>
        {error && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}
      </View>
    );
  }),
);

const styles = StyleSheet.create({
  wrapper: { marginBottom: Spacing.lg },
  label: { fontSize: 14, fontWeight: '600', marginBottom: Spacing.sm },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    minHeight: 50,
    gap: Spacing.sm,
  },
  input: { flex: 1, fontSize: 15, paddingVertical: Spacing.md },
  error: { fontSize: 12, marginTop: Spacing.xs },
});

import React, { memo, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BorderRadius, Spacing } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';

interface SearchBarProps extends Omit<TextInputProps, 'style'> {
  value?: string;
  onChangeText?: (text: string) => void;
  onClear?: () => void;
  readonly?: boolean;
  onPress?: () => void;
  rightElement?: React.ReactNode;
}

export const SearchBar = memo(function SearchBar({
  value = '',
  onChangeText,
  onClear,
  placeholder = 'Search groceries, shops...',
  readonly = false,
  onPress,
  rightElement,
  autoFocus,
  ...inputProps
}: SearchBarProps) {
  const { colors, isDark } = useTheme();
  const [focused, setFocused] = useState(false);

  const barBg = isDark ? '#2D2D2D' : '#F1F3F4';
  const glow = focused
    ? {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.4 : 0.22,
        shadowRadius: 12,
        elevation: 4,
      }
    : {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: isDark ? 0.25 : 0.06,
        shadowRadius: 4,
        elevation: 1,
      };

  const content = (
    <View style={[styles.container, glow, { backgroundColor: barBg }]}>
      <Ionicons name="search" size={20} color={colors.textMuted} style={styles.searchIcon} />
      {readonly ? (
        <Text style={[styles.placeholder, { color: colors.textMuted }]} numberOfLines={1}>
          {value || placeholder}
        </Text>
      ) : (
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          autoFocus={autoFocus}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          selectionColor={colors.primary}
          underlineColorAndroid="transparent"
          style={[
            styles.input,
            { color: colors.text },
            Platform.OS === 'web' && (webInputReset as object),
          ]}
          {...inputProps}
        />
      )}
      {!readonly && value.length > 0 && (
        <Pressable
          onPress={onClear ?? (() => onChangeText?.(''))}
          hitSlop={8}
          style={[styles.clearBtn, { backgroundColor: isDark ? '#3C4043' : '#E8EAED' }]}
        >
          <Ionicons name="close" size={16} color={colors.textSecondary} />
        </Pressable>
      )}
      {rightElement}
    </View>
  );

  if (readonly && onPress) {
    return (
      <Pressable onPress={onPress} style={styles.pressable}>
        {content}
      </Pressable>
    );
  }

  return content;
});

const webInputReset = {
  outlineStyle: 'none',
  outlineWidth: 0,
  borderWidth: 0,
  boxShadow: 'none',
} as const;

const styles = StyleSheet.create({
  pressable: { width: '100%' },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 50,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
    borderWidth: 0,
    overflow: 'hidden',
  },
  searchIcon: { marginRight: 2 },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: Spacing.sm,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  placeholder: {
    flex: 1,
    fontSize: 16,
  },
  clearBtn: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

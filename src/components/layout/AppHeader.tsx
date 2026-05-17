import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Spacing, Typography } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';

interface AppHeaderProps {
  showBack?: boolean;
  showForward?: boolean;
  onBackPress?: () => void;
  onForwardPress?: () => void;
  canGoForward?: boolean;
  title?: string;
  showBrand?: boolean;
  showSearch?: boolean;
  showAvatar?: boolean;
  showLocation?: boolean;
  showHelp?: boolean;
  avatarUrl?: string;
  onSearchPress?: () => void;
  onHelpPress?: () => void;
  rightElement?: React.ReactNode;
  titleColor?: string;
}

export const AppHeader = memo(function AppHeader({
  showBack = false,
  showForward = false,
  onBackPress,
  onForwardPress,
  canGoForward = false,
  title,
  showBrand = false,
  showSearch = false,
  showAvatar = false,
  showLocation = false,
  showHelp = false,
  avatarUrl,
  onSearchPress,
  onHelpPress,
  rightElement,
  titleColor,
}: AppHeaderProps) {
  const navigation = useNavigation();
  const { colors } = useTheme();

  return (
    <View style={[styles.header, { borderBottomColor: colors.borderLight }]}>
      <View style={styles.left}>
        {(showBack || showForward) && (
          <View style={styles.navGroup}>
            {showBack && (
              <Pressable
                onPress={onBackPress ?? (() => navigation.goBack())}
                hitSlop={12}
                style={styles.navBtn}
              >
                <Ionicons name="chevron-back" size={22} color={colors.primary} />
              </Pressable>
            )}
            {showForward && (
              <Pressable
                onPress={onForwardPress}
                disabled={!canGoForward}
                hitSlop={12}
                style={[styles.navBtn, !canGoForward && styles.navBtnDisabled]}
              >
                <Ionicons
                  name="chevron-forward"
                  size={22}
                  color={canGoForward ? colors.primary : colors.tabInactive}
                />
              </Pressable>
            )}
          </View>
        )}
        {showLocation && (
          <Ionicons name="location" size={22} color={colors.primary} />
        )}
      </View>
      <View style={styles.center}>
        {showBrand ? (
          <Text style={[styles.brand, { color: colors.primary }]}>FreshDash</Text>
        ) : title ? (
          <Text style={[styles.title, { color: titleColor ?? colors.primary }]}>{title}</Text>
        ) : null}
      </View>
      <View style={styles.right}>
        {showSearch && (
          <Pressable onPress={onSearchPress} hitSlop={8}>
            <Ionicons name="search-outline" size={22} color={colors.text} />
          </Pressable>
        )}
        {showHelp && (
          <Pressable onPress={onHelpPress} hitSlop={8}>
            <Ionicons name="help-circle-outline" size={24} color={colors.primary} />
          </Pressable>
        )}
        {showAvatar && avatarUrl && (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        )}
        {rightElement}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  left: { minWidth: 40, alignItems: 'flex-start' },
  navGroup: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  navBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnDisabled: { opacity: 0.4 },
  center: { flex: 1, alignItems: 'center' },
  right: {
    width: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: Spacing.md,
  },
  brand: { ...Typography.brand },
  title: { fontSize: 17, fontWeight: '700' },
  avatar: { width: 32, height: 32, borderRadius: 16 },
});

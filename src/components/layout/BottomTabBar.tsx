import React, { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BorderRadius, Spacing } from '../../constants/theme';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { applyNavHistoryEntry } from '../../navigation/userNavigationHistory';
import { useNavigationHistoryStore } from '../../store/navigationHistoryStore';
import type { UserStackParamList } from '../../types/navigation';

const TAB_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Home: 'home-outline',
  Search: 'search-outline',
  Orders: 'bag-outline',
  Profile: 'person-outline',
};

const TAB_LABEL_KEYS: Record<string, string> = {
  Home: 'tabs.home',
  Search: 'tabs.search',
  Orders: 'tabs.orders',
  Profile: 'tabs.profile',
};

export const CustomTabBar = memo(function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { t } = useLanguage();

  const entries = useNavigationHistoryStore((s) => s.entries);
  const historyIndex = useNavigationHistoryStore((s) => s.index);
  const setApplyingHistory = useNavigationHistoryStore((s) => s.setApplyingHistory);
  const goBackIndex = useNavigationHistoryStore((s) => s.goBackIndex);
  const goForwardIndex = useNavigationHistoryStore((s) => s.goForwardIndex);

  const stackNavigation = navigation.getParent<NativeStackNavigationProp<UserStackParamList>>();

  const canGoBack = historyIndex > 0 || (stackNavigation?.canGoBack() ?? false);
  const canGoForward = historyIndex < entries.length - 1;

  const handleBack = useCallback(() => {
    if (!stackNavigation) return;

    const prevIndex = goBackIndex();
    if (prevIndex !== null) {
      const entry = entries[prevIndex];
      if (entry) {
        setApplyingHistory(true);
        useNavigationHistoryStore.setState({ index: prevIndex });
        applyNavHistoryEntry(stackNavigation, entry);
        requestAnimationFrame(() => setApplyingHistory(false));
        return;
      }
    }

    if (stackNavigation.canGoBack()) {
      stackNavigation.goBack();
    }
  }, [stackNavigation, goBackIndex, entries, setApplyingHistory]);

  const handleForward = useCallback(() => {
    if (!stackNavigation) return;

    const nextIndex = goForwardIndex();
    if (nextIndex === null) return;

    const entry = entries[nextIndex];
    if (!entry) return;

    setApplyingHistory(true);
    useNavigationHistoryStore.setState({ index: nextIndex });
    applyNavHistoryEntry(stackNavigation, entry);
    requestAnimationFrame(() => setApplyingHistory(false));
  }, [stackNavigation, goForwardIndex, entries, setApplyingHistory]);

  return (
    <View
      style={[
        styles.wrapper,
        {
          paddingBottom: insets.bottom + Spacing.sm,
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
      ]}
    >
      <View style={[styles.navRow, { borderBottomColor: colors.borderLight }]}>
        <Pressable
          onPress={handleBack}
          disabled={!canGoBack}
          style={({ pressed }) => [
            styles.navBtn,
            { backgroundColor: colors.backgroundSecondary },
            !canGoBack && styles.navBtnDisabled,
            pressed && canGoBack && { opacity: 0.75 },
          ]}
          accessibilityLabel="Go back"
        >
          <Ionicons
            name="chevron-back"
            size={22}
            color={canGoBack ? colors.primary : colors.tabInactive}
          />
        </Pressable>
        <Pressable
          onPress={handleForward}
          disabled={!canGoForward}
          style={({ pressed }) => [
            styles.navBtn,
            { backgroundColor: colors.backgroundSecondary },
            !canGoForward && styles.navBtnDisabled,
            pressed && canGoForward && { opacity: 0.75 },
          ]}
          accessibilityLabel="Go forward"
        >
          <Ionicons
            name="chevron-forward"
            size={22}
            color={canGoForward ? colors.primary : colors.tabInactive}
          />
        </Pressable>
        <Text style={[styles.navHint, { color: colors.textMuted }]}>
          {canGoForward || canGoBack ? t('nav.browseHistory') : t('nav.home')}
        </Text>
      </View>

      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key]!;
          const label = TAB_LABEL_KEYS[route.name]
          ? t(TAB_LABEL_KEYS[route.name]!)
          : (options.title ?? route.name);
          const isFocused = state.index === index;
          const iconName = TAB_ICONS[route.name] ?? 'ellipse-outline';

          return (
            <Pressable
              key={route.key}
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }}
              style={styles.tab}
            >
              <View
                style={[
                  styles.iconWrap,
                  isFocused && { backgroundColor: colors.primary },
                ]}
              >
                <Ionicons
                  name={iconName}
                  size={22}
                  color={isFocused ? '#FFF' : colors.tabInactive}
                />
              </View>
              <Text
                style={[
                  styles.label,
                  { color: isFocused ? colors.primary : colors.tabInactive },
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnDisabled: { opacity: 0.45 },
  navHint: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    marginLeft: Spacing.xs,
  },
  bar: {
    flexDirection: 'row',
    paddingTop: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  tab: { flex: 1, alignItems: 'center', gap: 4 },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 11, fontWeight: '600' },
});

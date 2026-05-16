import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BorderRadius, Spacing } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';

export type RoleTabIcon = keyof typeof Ionicons.glyphMap;

interface RoleTabConfig {
  icons: Record<string, RoleTabIcon>;
}

const VENDOR_ICONS: Record<string, RoleTabIcon> = {
  VendorDashboard: 'grid-outline',
  VendorOrders: 'bag-outline',
  VendorInventory: 'cube-outline',
  VendorAnalytics: 'bar-chart-outline',
};

const DELIVERY_ICONS: Record<string, RoleTabIcon> = {
  DeliveryDashboard: 'grid-outline',
  DeliveryEarnings: 'cash-outline',
  DeliveryHistory: 'time-outline',
  DeliveryProfile: 'person-outline',
};

export const VENDOR_TAB_CONFIG: RoleTabConfig = { icons: VENDOR_ICONS };
export const DELIVERY_TAB_CONFIG: RoleTabConfig = { icons: DELIVERY_ICONS };

const TAB_LABELS: Record<string, string> = {
  VendorDashboard: 'Dashboard',
  VendorOrders: 'Orders',
  VendorInventory: 'Inventory',
  VendorAnalytics: 'Analytics',
  DeliveryDashboard: 'Dashboard',
  DeliveryEarnings: 'Earnings',
  DeliveryHistory: 'History',
  DeliveryProfile: 'Profile',
};

interface RoleTabBarProps extends BottomTabBarProps {
  config: RoleTabConfig;
}

export const RoleTabBar = memo(function RoleTabBar({
  state,
  descriptors,
  navigation,
  config,
}: RoleTabBarProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.bar,
        {
          paddingBottom: insets.bottom + Spacing.sm,
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key]!;
        const label = options.title ?? TAB_LABELS[route.name] ?? route.name;
        const isFocused = state.index === index;
        const iconName = config.icons[route.name] ?? 'ellipse-outline';

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
                styles.pill,
                isFocused && { backgroundColor: colors.primary },
              ]}
            >
              <Ionicons
                name={iconName}
                size={20}
                color={isFocused ? '#FFF' : colors.tabInactive}
              />
              <Text
                style={[
                  styles.label,
                  { color: isFocused ? '#FFF' : colors.tabInactive },
                ]}
              >
                {label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  tab: { flex: 1, alignItems: 'center' },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  label: { fontSize: 11, fontWeight: '600' },
});

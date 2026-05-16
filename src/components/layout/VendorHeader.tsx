import React, { memo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, Typography } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuthStore } from '../../store/authStore';

interface VendorHeaderProps {
  showOnlineToggle?: boolean;
  isOnline?: boolean;
  onToggleOnline?: (v: boolean) => void;
}

export const VendorHeader = memo(function VendorHeader({
  showOnlineToggle = false,
  isOnline = true,
  onToggleOnline,
}: VendorHeaderProps) {
  const { colors } = useTheme();
  const user = useAuthStore((s) => s.user);

  return (
    <View style={[styles.header, { borderBottomColor: colors.borderLight }]}>
      <Pressable hitSlop={12}>
        <Ionicons name="menu" size={26} color={colors.text} />
      </Pressable>
      <Text style={[styles.brand, { color: colors.primary }]}>FreshDash</Text>
      <View style={styles.right}>
        {showOnlineToggle && (
          <Pressable
            style={[styles.onlinePill, { backgroundColor: colors.borderLight }]}
            onPress={() => onToggleOnline?.(!isOnline)}
          >
            <Text style={[styles.onlineText, { color: colors.text }]}>Online</Text>
            <View
              style={[
                styles.toggle,
                { backgroundColor: isOnline ? colors.primary : colors.border },
              ]}
            >
              <View style={[styles.knob, isOnline && styles.knobOn]} />
            </View>
          </Pressable>
        )}
        <Image
          source={{ uri: user?.avatarUrl ?? 'https://i.pravatar.cc/80?u=vendor' }}
          style={styles.avatar}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  brand: { ...Typography.brand, fontSize: 20 },
  right: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  onlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: 20,
  },
  onlineText: { fontSize: 13, fontWeight: '600' },
  toggle: {
    width: 40,
    height: 22,
    borderRadius: 11,
    padding: 2,
    justifyContent: 'center',
  },
  knob: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFF',
  },
  knobOn: { alignSelf: 'flex-end' },
  avatar: { width: 36, height: 36, borderRadius: 18 },
});

import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

interface NotificationBellProps {
  count: number;
  onPress: () => void;
}

export const NotificationBell = memo(function NotificationBell({
  count,
  onPress,
}: NotificationBellProps) {
  const { colors } = useTheme();

  return (
    <Pressable onPress={onPress} hitSlop={10} style={styles.wrap}>
      <View style={[styles.circle, { backgroundColor: colors.backgroundSecondary }]}>
        <Ionicons name="notifications-outline" size={22} color={colors.text} />
      </View>
      {count > 0 && (
        <View style={[styles.badge, { backgroundColor: colors.accent }]}>
          <Text style={styles.badgeText}>{count > 9 ? '9+' : count}</Text>
        </View>
      )}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  wrap: { position: 'relative' },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: '800' },
});

import React, { memo } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface LoaderProps {
  fullScreen?: boolean;
  size?: 'small' | 'large';
}

export const Loader = memo(function Loader({ fullScreen = false, size = 'large' }: LoaderProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size={size} color={colors.primary} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: { padding: 24, alignItems: 'center', justifyContent: 'center' },
  fullScreen: { flex: 1 },
});

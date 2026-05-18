import React, { memo } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { pageShellStyle } from '../../utils/platformLayout';

interface ScreenContainerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Apply horizontal gutter padding (recommended on web). */
  padded?: boolean;
}

export const ScreenContainer = memo(function ScreenContainer({
  children,
  style,
  padded = false,
}: ScreenContainerProps) {
  const layout = useResponsiveLayout();

  return (
    <View
      style={[
        styles.root,
        pageShellStyle(layout.maxContentWidth),
        padded && { paddingHorizontal: layout.gutter },
        style,
      ]}
    >
      {children}
    </View>
  );
});

const styles = StyleSheet.create({
  root: { flex: 1 },
});

import React, { memo } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';

interface WebContentProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  noGutter?: boolean;
}

/** Applies responsive horizontal padding inside ScreenContainer. */
export const WebContent = memo(function WebContent({
  children,
  style,
  noGutter = false,
}: WebContentProps) {
  const { gutter, isWeb } = useResponsiveLayout();

  return (
    <View
      style={[
        styles.root,
        isWeb && !noGutter && { paddingHorizontal: gutter },
        style,
      ]}
    >
      {children}
    </View>
  );
});

const styles = StyleSheet.create({
  root: { width: '100%' },
});

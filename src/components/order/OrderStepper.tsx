import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';

export type TrackingStep = 'ordered' | 'packed' | 'in_transit' | 'delivered';

const STEPS: { key: TrackingStep; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'ordered', label: 'Ordered', icon: 'checkmark' },
  { key: 'packed', label: 'Packed', icon: 'cube-outline' },
  { key: 'in_transit', label: 'In Transit', icon: 'bicycle-outline' },
  { key: 'delivered', label: 'Delivered', icon: 'checkmark-done-outline' },
];

interface OrderStepperProps {
  currentStep: TrackingStep;
}

export const OrderStepper = memo(function OrderStepper({ currentStep }: OrderStepperProps) {
  const { colors } = useTheme();
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <View style={styles.container}>
      <View style={styles.trackRow}>
        {STEPS.map((step, index) => {
          const isDone = index <= currentIndex;
          const isActive = index === currentIndex;
          const isLast = index === STEPS.length - 1;

          return (
            <View key={step.key} style={styles.stepWrap}>
              <View
                style={[
                  styles.circle,
                  {
                    backgroundColor: isDone ? colors.primary : colors.border,
                    borderWidth: isActive ? 2 : 0,
                    borderColor: colors.primaryDark,
                  },
                ]}
              >
                <Ionicons
                  name={step.icon}
                  size={14}
                  color={isDone ? '#FFF' : colors.textMuted}
                />
              </View>
              {!isLast && (
                <View
                  style={[
                    styles.line,
                    {
                      backgroundColor: index < currentIndex ? colors.primary : colors.border,
                      borderStyle: index < currentIndex ? 'solid' : 'dashed',
                    },
                  ]}
                />
              )}
            </View>
          );
        })}
      </View>
      <View style={styles.labelsRow}>
        {STEPS.map((step, index) => {
          const isActive = index === currentIndex;
          const isDone = index <= currentIndex;
          return (
            <Text
              key={step.key}
              style={[
                styles.label,
                {
                  color: isActive || isDone ? colors.primary : colors.textMuted,
                  fontWeight: isActive ? '700' : '500',
                },
              ]}
              numberOfLines={1}
            >
              {step.label}
            </Text>
          );
        })}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: { paddingVertical: Spacing.md },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.sm,
  },
  stepWrap: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  line: {
    flex: 1,
    height: 3,
    marginHorizontal: -4,
    borderRadius: 2,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
    paddingHorizontal: 0,
  },
  label: { fontSize: 10, textAlign: 'center', flex: 1 },
});

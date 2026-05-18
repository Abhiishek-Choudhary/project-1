import { Platform, type ViewStyle } from 'react-native';
import { BREAKPOINTS } from '../hooks/useResponsiveLayout';

export function pageShellStyle(maxContentWidth: number): ViewStyle {
  if (Platform.OS === 'web') {
    return {
      width: '100%',
      maxWidth: maxContentWidth,
      alignSelf: 'center',
      flex: 1,
    };
  }
  return { flex: 1, width: '100%' };
}

/** @deprecated Use useResponsiveLayout + pageShellStyle */
export function contentMaxWidthStyle(maxWidth = BREAKPOINTS.maxContent): ViewStyle {
  return pageShellStyle(maxWidth);
}

export function cardShadow(elevation = 3): ViewStyle {
  return Platform.select({
    android: { elevation },
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
    },
    web: {
      boxShadow: '0px 2px 12px rgba(0,0,0,0.08)',
    },
    default: {},
  }) as ViewStyle;
}

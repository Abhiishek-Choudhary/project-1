import { Platform, useWindowDimensions } from 'react-native';

export const BREAKPOINTS = {
  tablet: 768,
  desktop: 1024,
  maxContent: 1280,
} as const;

export function useResponsiveLayout() {
  const { width, height } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isNative = !isWeb;
  const isTablet = width >= BREAKPOINTS.tablet;
  const isDesktop = width >= BREAKPOINTS.desktop;

  const maxContentWidth = isWeb
    ? Math.min(width, BREAKPOINTS.maxContent)
    : width;

  const gutter = isWeb ? (isDesktop ? 32 : isTablet ? 24 : 16) : 16;
  const gap = isWeb && isDesktop ? 20 : 12;
  const innerWidth = maxContentWidth - gutter * 2;

  const productColumns = isNative ? 2 : isDesktop ? 4 : isTablet ? 3 : 2;
  const shopColumns = isNative ? 1 : isDesktop ? 3 : isTablet ? 2 : 1;
  const categoryColumns = 4;

  const productCardWidth = Math.floor(
    (innerWidth - gap * (productColumns - 1)) / productColumns,
  );
  const shopCardWidth =
    shopColumns > 1
      ? Math.floor((innerWidth - gap * (shopColumns - 1)) / shopColumns)
      : Math.min(280, innerWidth * 0.72);
  const categoryItemWidth = Math.floor(
    (innerWidth - gap * (categoryColumns - 1)) / categoryColumns,
  );

  return {
    width,
    height,
    isWeb,
    isNative,
    isTablet,
    isDesktop,
    isCompact: !isTablet,
    maxContentWidth,
    gutter,
    gap,
    innerWidth,
    productColumns,
    shopColumns,
    categoryColumns,
    productCardWidth,
    shopCardWidth,
    categoryItemWidth,
    /** Horizontal scroll for shops on phone; grid on tablet+ web. */
    useShopCarousel: shopColumns === 1,
    /** Category row scroll on phone; grid on tablet+ web. */
    useCategoryCarousel: !isWeb || !isTablet,
    /** Hide back/forward row in tab bar on large web. */
    showBrowseNav: isNative || width < BREAKPOINTS.desktop,
    useWebHeader: isWeb && isTablet,
  };
}

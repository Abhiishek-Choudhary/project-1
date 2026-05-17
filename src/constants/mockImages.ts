/**
 * Unique placeholder images per entity id (picsum — stable seed, always 200).
 * Use the product/store id as seed so each card gets a different photo.
 */
export function mockImage(seed: string | number, width = 400, height = 400): string {
  const id = encodeURIComponent(String(seed));
  return `https://picsum.photos/seed/freshdash-${id}/${width}/${height}`;
}

/** Hero / map assets (full Unsplash slugs verified to return 200). */
export const MOCK_UNSPLASH = {
  produce: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=400&fit=crop&auto=format',
  map: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&h=300&fit=crop&auto=format',
  scanner: mockImage('scanner-bg', 800, 1200),
} as const;

/** Match UI category labels to product.category values (e.g. "Dairy" → "Dairy & Eggs"). */
export function matchesCategory(productCategory: string, filter: string): boolean {
  const p = productCategory.toLowerCase().trim();
  const f = filter.toLowerCase().trim();
  if (!f) return true;
  if (p === f) return true;
  if (p.includes(f) || f.includes(p)) return true;

  const groups: Record<string, string[]> = {
    dairy: ['dairy', 'dairy & eggs', 'milk'],
    vegetables: ['vegetables', 'veggies', 'vegetable'],
    fruits: ['fruits', 'fruit'],
    staples: ['staples', 'grains', 'rice', 'pantry'],
    snacks: ['snacks', 'snack'],
    beverages: ['beverages', 'drinks', 'beverage'],
  };

  for (const aliases of Object.values(groups)) {
    const filterHit = aliases.some((a) => f === a || f.includes(a));
    const productHit = aliases.some((a) => p === a || p.includes(a));
    if (filterHit && productHit) return true;
  }

  return false;
}

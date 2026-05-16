export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: currency === 'INR' ? 0 : 2,
    maximumFractionDigits: currency === 'INR' ? 0 : 2,
  }).format(amount);
}

export function formatINR(amount: number): string {
  return formatCurrency(amount, 'INR');
}

export function formatRating(rating: number, count: number): string {
  const formatted =
    count >= 1000 ? `${(count / 1000).toFixed(1)}k` : String(count);
  return `${rating.toFixed(1)} ★ (${formatted})`;
}

export function formatDeliveryTime(min: number, max: number): string {
  return `${min}–${max} min`;
}

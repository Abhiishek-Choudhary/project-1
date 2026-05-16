import { useQuery } from '@tanstack/react-query';
import { storeService } from '../services/storeService';

export function useNearbyStores() {
  return useQuery({
    queryKey: ['stores', 'nearby'],
    queryFn: () => storeService.getNearbyStores(),
  });
}

export function useStoreProducts(storeId: string, category?: string) {
  return useQuery({
    queryKey: ['stores', storeId, 'products', category],
    queryFn: () => storeService.getStoreProducts(storeId, category),
    enabled: !!storeId,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => storeService.getProduct(id),
    enabled: !!id,
  });
}

export function useRelatedProducts(id: string) {
  return useQuery({
    queryKey: ['products', id, 'related'],
    queryFn: () => storeService.getRelatedProducts(id),
    enabled: !!id,
  });
}

export function useProductSearch(query: string) {
  return useQuery({
    queryKey: ['products', 'search', query],
    queryFn: () => storeService.searchProducts(query),
    enabled: query.length >= 2,
  });
}

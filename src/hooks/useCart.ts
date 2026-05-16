import { useCallback } from 'react';
import { useCartStore } from '../store/cartStore';
import { useToast } from '../contexts/ToastContext';
import type { Product } from '../types';

export function useCart() {
  const store = useCartStore();
  const { showToast } = useToast();

  const addToCart = useCallback(
    (product: Product, quantity = 1) => {
      store.addItem(product, quantity);
      showToast(`${product.name} added to cart`, 'success');
    },
    [store, showToast],
  );

  return { ...store, addToCart };
}

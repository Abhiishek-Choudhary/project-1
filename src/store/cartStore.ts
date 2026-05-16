import { create } from 'zustand';
import type { CartItem, Product } from '../types';
import { formatCurrency } from '../utils/format';

interface CartState {
  items: CartItem[];
  couponCode: string | null;
  couponDiscount: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setCoupon: (code: string | null, discount?: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getTotal: () => number;
  getFormattedTotal: () => string;
}

const TAX_RATE = 0.06;
const DELIVERY_FEE = 0;

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  couponCode: null,
  couponDiscount: 0,

  addItem: (product, quantity = 1) => {
    set((state) => {
      const existing = state.items.find((i) => i.productId === product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === product.id
              ? { ...i, quantity: i.quantity + quantity }
              : i,
          ),
        };
      }
      return {
        items: [...state.items, { productId: product.id, product, quantity }],
      };
    });
  },

  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((i) => i.productId !== productId),
    }));
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    set((state) => ({
      items: state.items.map((i) =>
        i.productId === productId ? { ...i, quantity } : i,
      ),
    }));
  },

  setCoupon: (code, discount = 0) => set({ couponCode: code, couponDiscount: discount }),

  clearCart: () => set({ items: [], couponCode: null, couponDiscount: 0 }),

  getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

  getSubtotal: () =>
    get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),

  getTotal: () => {
    const subtotal = get().getSubtotal();
    const taxes = subtotal * TAX_RATE;
    return subtotal + DELIVERY_FEE + taxes - get().couponDiscount;
  },

  getFormattedTotal: () => formatCurrency(get().getTotal()),
}));

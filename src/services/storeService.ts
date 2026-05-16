import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';
import { MOCK_PRODUCTS, MOCK_RELATED, MOCK_STORES, delay } from '../api/mockData';
import type { Product, Store } from '../types';

const USE_MOCK = true;

export const storeService = {
  async getNearbyStores(): Promise<Store[]> {
    if (USE_MOCK) {
      await delay();
      return MOCK_STORES;
    }
    const { data } = await apiClient.get<Store[]>(API_ENDPOINTS.stores.nearby);
    return data;
  },

  async getStoreProducts(storeId: string, category?: string): Promise<Product[]> {
    if (USE_MOCK) {
      await delay();
      return MOCK_PRODUCTS.filter(
        (p) => p.storeId === storeId && (!category || p.category === category),
      );
    }
    const { data } = await apiClient.get<Product[]>(API_ENDPOINTS.stores.products(storeId), {
      params: { category },
    });
    return data;
  },

  async getProduct(id: string): Promise<Product> {
    if (USE_MOCK) {
      await delay();
      const product = MOCK_PRODUCTS.find((p) => p.id === id);
      if (!product) throw new Error('Product not found');
      return product;
    }
    const { data } = await apiClient.get<Product>(API_ENDPOINTS.products.detail(id));
    return data;
  },

  async getRelatedProducts(id: string): Promise<Product[]> {
    if (USE_MOCK) {
      await delay(200);
      return MOCK_RELATED;
    }
    const { data } = await apiClient.get<Product[]>(API_ENDPOINTS.products.related(id));
    return data;
  },

  async searchProducts(query: string): Promise<Product[]> {
    if (USE_MOCK) {
      await delay();
      const q = query.toLowerCase();
      return MOCK_PRODUCTS.filter((p) => p.name.toLowerCase().includes(q));
    }
    const { data } = await apiClient.get<Product[]>(API_ENDPOINTS.products.search, {
      params: { q: query },
    });
    return data;
  },
};

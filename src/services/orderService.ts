import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';
import { MOCK_ORDERS, delay } from '../api/mockData';
import type { Order } from '../types';

const USE_MOCK = true;

export const orderService = {
  async getOrders(): Promise<Order[]> {
    if (USE_MOCK) {
      await delay();
      return MOCK_ORDERS;
    }
    const { data } = await apiClient.get<Order[]>(API_ENDPOINTS.orders.list);
    return data;
  },

  async getOrder(id: string): Promise<Order> {
    if (USE_MOCK) {
      await delay();
      const order = MOCK_ORDERS.find((o) => o.id === id);
      if (!order) throw new Error('Order not found');
      return order;
    }
    const { data } = await apiClient.get<Order>(API_ENDPOINTS.orders.detail(id));
    return data;
  },

  async createOrder(payload: Record<string, unknown>): Promise<Order> {
    if (USE_MOCK) {
      await delay(600);
      return MOCK_ORDERS[0]!;
    }
    const { data } = await apiClient.post<Order>(API_ENDPOINTS.orders.create, payload);
    return data;
  },
};

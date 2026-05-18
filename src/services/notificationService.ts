import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';
import { MOCK_NOTIFICATIONS, delay } from '../api/mockData';
import type { Notification } from '../types';

const USE_MOCK = true;

let mockNotifications: Notification[] = MOCK_NOTIFICATIONS.map((n) => ({ ...n }));

export const notificationService = {
  async list(): Promise<Notification[]> {
    if (USE_MOCK) {
      await delay(300);
      return [...mockNotifications].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }
    const { data } = await apiClient.get<Notification[]>(API_ENDPOINTS.notifications.list);
    return data;
  },

  async markRead(id: string): Promise<Notification> {
    if (USE_MOCK) {
      await delay(150);
      mockNotifications = mockNotifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      );
      const found = mockNotifications.find((n) => n.id === id);
      if (!found) throw new Error('Notification not found');
      return found;
    }
    const { data } = await apiClient.patch<Notification>(
      API_ENDPOINTS.notifications.markRead(id),
    );
    return data;
  },

  async markAllRead(): Promise<void> {
    if (USE_MOCK) {
      await delay(150);
      mockNotifications = mockNotifications.map((n) => ({ ...n, read: true }));
      return;
    }
    await apiClient.post(`${API_ENDPOINTS.notifications.list}/read-all`);
  },
};

/** Dev helper — simulates server push until backend emits `notification:new`. */
export function pushMockNotification(notification: Notification): void {
  mockNotifications = [notification, ...mockNotifications];
}

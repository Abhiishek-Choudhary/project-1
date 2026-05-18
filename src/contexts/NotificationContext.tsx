import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { NotificationType } from '../constants/enums';
import { useToast } from './ToastContext';
import { useSocket } from './SocketContext';
import { useAuthStore } from '../store/authStore';
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from '../hooks/useNotifications';
import { pushMockNotification } from '../services/notificationService';
import type { Notification } from '../types';

import { NOTIFICATIONS_QUERY_KEY } from '../hooks/useNotifications';

interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  refetch: () => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { showToast } = useToast();
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();
  const { data: notifications = [], isLoading, refetch } = useNotifications();
  const markReadMutation = useMarkNotificationRead();
  const markAllMutation = useMarkAllNotificationsRead();

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  const invalidate = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
  }, [queryClient]);

  const handleIncoming = useCallback(
    (payload: Notification) => {
      pushMockNotification(payload);
      invalidate();
      showToast(payload.title, 'info');
    },
    [invalidate, showToast],
  );

  useEffect(() => {
    if (!socket || !isAuthenticated) return;

    const onSocketNotification = (payload: Notification) => {
      handleIncoming(payload);
    };

    socket.on('notification:new', onSocketNotification);
    return () => {
      socket.off('notification:new', onSocketNotification);
    };
  }, [socket, isAuthenticated, handleIncoming]);

  useEffect(() => {
    if (!isAuthenticated || !isConnected) return;

    const timer = setTimeout(() => {
      const hasPromo = notifications.some((n) => n.id === 'n-promo-live');
      if (!hasPromo) {
        handleIncoming({
          id: `n-live-${Date.now()}`,
          type: NotificationType.Promo,
          title: '50% off your first order',
          body: 'Use code FRESH50 at checkout. Limited time offer!',
          read: false,
          createdAt: new Date().toISOString(),
          data: { screen: 'Home' },
        });
      }
    }, 8000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, isConnected, notifications, handleIncoming]);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      isLoading,
      refetch: () => void refetch(),
      markRead: (id: string) => markReadMutation.mutate(id),
      markAllRead: () => markAllMutation.mutate(),
    }),
    [
      notifications,
      unreadCount,
      isLoading,
      refetch,
      markReadMutation,
      markAllMutation,
    ],
  );

  return (
    <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
  );
}

export function useNotificationCenter(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotificationCenter must be used within NotificationProvider');
  }
  return ctx;
}

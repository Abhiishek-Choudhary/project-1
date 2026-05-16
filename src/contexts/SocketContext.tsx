import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { OrderStatus } from '../constants/enums';
import { useAuthStore } from '../store/authStore';

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL ?? 'http://localhost:3000';

interface OrderUpdatePayload {
  orderId: string;
  status: OrderStatus;
  message?: string;
}

interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  subscribeOrder: (orderId: string, cb: (payload: OrderUpdatePayload) => void) => () => void;
}

const SocketContext = createContext<SocketContextValue | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) return;

    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
    });

    socketRef.current = socket;
    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isAuthenticated]);

  const subscribeOrder = (
    orderId: string,
    cb: (payload: OrderUpdatePayload) => void,
  ) => {
    const socket = socketRef.current;
    if (!socket) return () => undefined;

    const event = `order:${orderId}:update`;
    socket.emit('subscribe:order', { orderId });
    socket.on(event, cb);

    return () => {
      socket.off(event, cb);
      socket.emit('unsubscribe:order', { orderId });
    };
  };

  return (
    <SocketContext.Provider
      value={{ socket: socketRef.current, isConnected, subscribeOrder }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket(): SocketContextValue {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocket must be used within SocketProvider');
  return ctx;
}

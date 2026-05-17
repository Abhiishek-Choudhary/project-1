import { Ionicons } from '@expo/vector-icons';
import { OrderStatus } from '../constants/enums';

export interface OrderStatusStyle {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  bg: string;
  text: string;
  isActive: boolean;
}

const STATUS_MAP: Record<OrderStatus, OrderStatusStyle> = {
  [OrderStatus.Pending]: {
    label: 'Pending',
    icon: 'time-outline',
    bg: '#FEF3C7',
    text: '#B45309',
    isActive: true,
  },
  [OrderStatus.Confirmed]: {
    label: 'Confirmed',
    icon: 'checkmark-circle-outline',
    bg: '#E0F2FE',
    text: '#0369A1',
    isActive: true,
  },
  [OrderStatus.Preparing]: {
    label: 'Preparing',
    icon: 'restaurant-outline',
    bg: '#FFF7ED',
    text: '#C2410C',
    isActive: true,
  },
  [OrderStatus.ReadyForPickup]: {
    label: 'Ready for pickup',
    icon: 'bag-check-outline',
    bg: '#EDE9FE',
    text: '#6D28D9',
    isActive: true,
  },
  [OrderStatus.OutForDelivery]: {
    label: 'Out for delivery',
    icon: 'bicycle-outline',
    bg: '#DCFCE7',
    text: '#166534',
    isActive: true,
  },
  [OrderStatus.Delivered]: {
    label: 'Delivered',
    icon: 'checkmark-done-outline',
    bg: '#E8F5EE',
    text: '#1B7A4E',
    isActive: false,
  },
  [OrderStatus.Cancelled]: {
    label: 'Cancelled',
    icon: 'close-circle-outline',
    bg: '#FEE2E2',
    text: '#DC2626',
    isActive: false,
  },
};

export function getOrderStatusStyle(status: OrderStatus): OrderStatusStyle {
  return STATUS_MAP[status] ?? STATUS_MAP[OrderStatus.Pending];
}

export function formatOrderStatus(status: OrderStatus): string {
  return getOrderStatusStyle(status).label;
}

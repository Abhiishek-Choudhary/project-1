import { OrderStatus } from '../constants/enums';
import type {
  DeliveryActiveOrder,
  DeliveryDashboardStats,
  DeliveryHotspot,
  DeliveryOrderDetail,
} from '../types';

export const MOCK_DELIVERY_STATS: DeliveryDashboardStats = {
  earningsToday: 142.5,
  earningsChange: 12,
  deliveriesCount: 14,
  completionRate: 100,
  timeOnline: '5h 24m',
  shiftEndsIn: '2h',
};

export const MOCK_DELIVERY_ACTIVE: DeliveryActiveOrder = {
  id: 'd-active-1',
  displayId: '9921',
  customerName: 'Michael Rodriguez',
  itemCount: 4,
  etaMinutes: 8,
  addressLine1: '452 Market Street, Apt 4B',
  addressLine2: 'San Francisco, CA 94103',
  mapImageUrl:
    'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&h=300&fit=crop',
};

export const MOCK_DELIVERY_HOTSPOTS: DeliveryHotspot[] = [
  { id: 'h1', name: 'Mission District', surgeBonus: 2.5 },
  { id: 'h2', name: 'SOMA', surgeBonus: 1.75 },
];

export const MOCK_DELIVERY_ORDER_DETAIL: DeliveryOrderDetail = {
  id: 'd2',
  displayId: 'FD-7721',
  estimatedMinutes: '12 - 18 Mins',
  distanceMiles: 3.2,
  mapImageUrl:
    'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&h=280&fit=crop',
  pickup: {
    storeName: 'Whole Foods Market',
    address: '1765 California St, San Francisco, CA 94109',
    phone: '+14155550100',
  },
  delivery: {
    customerName: 'Alex Rivera',
    address: '2240 Clay St, Apt 4B, San Francisco, CA 94115',
    instructions: 'Gate code is #1234. Leave at front door.',
  },
  items: [
    {
      id: 'i1',
      name: 'Organic Vine-Ripened Tomatoes',
      unit: '1 lb Bag',
      quantity: 1,
      imageUrl: 'https://images.unsplash.com/photo-1546093743?w=100&h=100&fit=crop',
    },
    {
      id: 'i2',
      name: 'Organic Baby Spinach',
      unit: '5 oz Container',
      quantity: 2,
      imageUrl: 'https://images.unsplash.com/photo-1576045058?w=100&h=100&fit=crop',
    },
    {
      id: 'i3',
      name: 'Horizon Organic Whole Milk',
      unit: '0.5 Gallon',
      quantity: 1,
      imageUrl: 'https://images.unsplash.com/photo-1563636619?w=100&h=100&fit=crop',
    },
  ],
  subtotal: 42.3,
  driverEarnings: 12.5,
  pickupConfirmed: false,
  status: OrderStatus.ReadyForPickup,
};

import { mockImage } from '../constants/mockImages';
import type { VendorInventoryItem, VendorRecentOrder, VendorStats } from '../types';

export const MOCK_VENDOR_STATS: VendorStats = {
  todayRevenue: 2482.5,
  revenueChange: 12.5,
  activeOrders: 24,
  inDelivery: 8,
};

export const MOCK_VENDOR_RECENT_ORDERS: VendorRecentOrder[] = [
  {
    id: 'ORD-9921',
    itemCount: 3,
    total: 42,
    timeAgo: 'Just now',
    status: 'new',
    statusLabel: 'NEW',
  },
  {
    id: 'ORD-9918',
    itemCount: 5,
    total: 128.5,
    timeAgo: '12 mins ago',
    status: 'preparing',
    statusLabel: 'PREPARING',
  },
  {
    id: 'ORD-9915',
    itemCount: 1,
    total: 12,
    timeAgo: '25 mins ago',
    status: 'on_way',
    statusLabel: 'ON WAY',
  },
];

export const MOCK_VENDOR_INVENTORY_ALERTS = [
  { id: 'p4', name: 'Organic Avocados', imageUrl: mockImage('p4', 200, 200), stockLeft: 5 },
  { id: 'm1', name: 'Farm Fresh Milk', imageUrl: mockImage('m1', 200, 200), stockLeft: 2 },
  { id: 'p1', name: 'Vine Tomatoes', imageUrl: mockImage('p1', 200, 200), stockLeft: 45 },
];

export const MOCK_VENDOR_INVENTORY: VendorInventoryItem[] = [
  {
    id: 'vi1',
    name: 'Organic Avocados',
    category: 'Vegetables',
    unit: '2 units',
    price: 4.5,
    imageUrl: mockImage('vi1', 200, 200),
    stockCount: 8,
    lowStockThreshold: 10,
    inStock: true,
    isLowStock: true,
    isSoldOut: false,
  },
  {
    id: 'vi2',
    name: 'Farm Fresh Milk',
    category: 'Dairy',
    unit: '1 litre',
    price: 3.99,
    imageUrl: mockImage('vi2', 200, 200),
    stockCount: 0,
    lowStockThreshold: 5,
    inStock: false,
    isLowStock: false,
    isSoldOut: true,
  },
  {
    id: 'vi3',
    name: 'Organic Baby Spinach',
    category: 'Vegetables',
    unit: '5 oz',
    price: 2.99,
    imageUrl: mockImage('vi3', 200, 200),
    stockCount: 24,
    lowStockThreshold: 10,
    inStock: true,
    isLowStock: false,
    isSoldOut: false,
  },
];

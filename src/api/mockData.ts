import { NotificationType, OrderStatus, ProductBadge, UserRole } from '../constants/enums';
import type {
  Address,
  CheckoutLineItem,
  CheckoutSummary,
  DeliveryAssignment,
  DeliveryPartner,
  DeliverySlot,
  Notification,
  Order,
  Product,
  Store,
  User,
  VendorProduct,
} from '../types';

const IMG = (id: number) => `https://images.unsplash.com/photo-${id}?w=400&h=400&fit=crop`;

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Alex Rivers',
  email: 'alex.rivers@freshdash.com',
  phone: '+1234567890',
  role: UserRole.User,
  avatarUrl: 'https://i.pravatar.cc/150?u=alexrivers',
};

export const MOCK_CHECKOUT_ADDRESS: Address = {
  id: 'a-checkout',
  label: 'Home',
  line1: '452, Silicon Valley Residency Block B, 4th Floor',
  line2: 'Electronic City Phase 1, Bangalore, Karnataka - 560100',
  city: 'Bangalore',
  state: 'Karnataka',
  zipCode: '560100',
  isDefault: true,
};

export const MOCK_DELIVERY_SLOTS: DeliverySlot[] = [
  { id: 'express', label: 'Today', sublabel: '15 - 20 Mins', isExpress: true },
  { id: 'slot1', label: 'Today', sublabel: '04:00 PM - 06:00 PM' },
  { id: 'slot2', label: 'Today', sublabel: '06:00 PM - 08:00 PM' },
  { id: 'slot3', label: 'Tomorrow', sublabel: '08:00 AM - 10:00 AM' },
];

export const MOCK_CHECKOUT_ITEMS: CheckoutLineItem[] = [
  {
    id: 'ci1',
    name: 'Organic Haas Avocados Pack of 2',
    imageUrl: IMG(1523042085174),
    price: 249,
  },
  {
    id: 'ci2',
    name: 'Fresh Strawberries 250g Box',
    imageUrl: IMG(1464969749031),
    price: 180,
  },
  {
    id: 'ci3',
    name: 'Farm Fresh Milk 1 Litre',
    imageUrl: IMG(1563636619),
    price: 75,
  },
];

export const MOCK_CHECKOUT_SUMMARY: CheckoutSummary = {
  itemTotal: 504,
  deliveryFee: 0,
  deliveryFeeStrikethrough: 40,
  taxes: 22.5,
  discount: 0,
  total: 526.5,
  couponCode: 'FRESH50',
};

export const MOCK_DELIVERY_PARTNER: DeliveryPartner = {
  id: 'dp1',
  name: 'Marcus Chen',
  avatarUrl: 'https://i.pravatar.cc/120?u=marcuschen',
  rating: 4.9,
  title: 'Your Delivery Hero',
};

export const MOCK_STORES: Store[] = [
  {
    id: 's1',
    name: 'Organic Market',
    imageUrl: IMG(1542838132),
    rating: 4.8,
    reviewCount: 1200,
    deliveryTimeMin: 12,
    deliveryTimeMax: 15,
    deliveryFee: 0,
    distanceKm: 1.2,
    categories: ['Vegetables', 'Fruits', 'Dairy & Eggs'],
    isOpen: true,
  },
  {
    id: 's2',
    name: 'Green Valley Mart',
    imageUrl: IMG(1604719313586),
    rating: 4.6,
    reviewCount: 890,
    deliveryTimeMin: 15,
    deliveryTimeMax: 20,
    deliveryFee: 1.99,
    distanceKm: 2.4,
    categories: ['Vegetables', 'Snacks', 'Beverages'],
    isOpen: true,
  },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    storeId: 's1',
    name: 'Roma Tomatoes',
    description: 'Juicy Roma tomatoes perfect for salads and sauces.',
    imageUrl: IMG(1546093743),
    price: 4.99,
    unit: '500g',
    category: 'Vegetables',
    badge: ProductBadge.Organic,
    inStock: true,
    stockCount: 50,
    tags: ['Organic', 'Local Farm'],
  },
  {
    id: 'p2',
    storeId: 's1',
    name: 'Dutch Carrots',
    description: 'Sweet and crunchy Dutch carrots.',
    imageUrl: IMG(1447174039416),
    price: 3.2,
    unit: '1 bunch',
    category: 'Vegetables',
    inStock: true,
    stockCount: 40,
  },
  {
    id: 'p3',
    storeId: 's1',
    name: 'Organic Broccoli',
    description: 'Fresh organic broccoli crowns.',
    imageUrl: IMG(1459416068),
    price: 2.1,
    originalPrice: 2.8,
    unit: 'per head',
    category: 'Vegetables',
    badge: ProductBadge.Sale,
    inStock: true,
    stockCount: 30,
  },
  {
    id: 'p4',
    storeId: 's1',
    name: 'Hass Avocado',
    description: 'Creamy Hass avocados, ripe and ready.',
    imageUrl: IMG(1523042085174),
    price: 2.5,
    unit: 'each',
    category: 'Vegetables',
    inStock: true,
    stockCount: 60,
  },
  {
    id: 'p5',
    storeId: 's1',
    name: 'Red Bell Pepper',
    description: 'Vibrant red bell peppers.',
    imageUrl: IMG(1563569622),
    price: 1.99,
    unit: 'each',
    category: 'Vegetables',
    inStock: true,
    stockCount: 45,
  },
  {
    id: 'p6',
    storeId: 's1',
    name: 'Baby Spinach',
    description: 'Tender baby spinach leaves.',
    imageUrl: IMG(1576045058),
    price: 3.99,
    unit: '200g',
    category: 'Vegetables',
    badge: ProductBadge.Organic,
    inStock: true,
    stockCount: 35,
  },
  {
    id: 'p7',
    storeId: 's1',
    name: 'Sweet Corn',
    description: 'Farm-fresh sweet corn.',
    imageUrl: IMG(1551754659),
    price: 0.99,
    unit: 'each',
    category: 'Vegetables',
    inStock: true,
    stockCount: 80,
  },
  {
    id: 'p8',
    storeId: 's1',
    name: 'Portobello Mushrooms',
    description: 'Large portobello mushroom caps.',
    imageUrl: IMG(1504674900247),
    price: 4.5,
    unit: '250g',
    category: 'Vegetables',
    inStock: true,
    stockCount: 25,
  },
  {
    id: 'p9',
    storeId: 's1',
    name: 'Fresh Organic Strawberries',
    description:
      'Hand-picked organic strawberries from local farms. Sweet, juicy, and packed with Vitamin C. Perfect for smoothies, desserts, or snacking.',
    imageUrl: IMG(1464969749031),
    price: 6.25,
    unit: '500g Box • Sustainably Farmed',
    category: 'Fruits',
    badge: ProductBadge.Organic,
    inStock: true,
    stockCount: 20,
    pricePerKg: 12.5,
    tags: ['Organic', 'Local Farm', 'Vitamin C'],
    nutrition: { calories: '160', fiber: '4g', sugar: '12g', vitaminC: '150%' },
  },
];

export const MOCK_RELATED: Product[] = [
  {
    id: 'r1',
    storeId: 's1',
    name: 'Whole Milk',
    description: 'Fresh whole milk',
    imageUrl: IMG(1563636619),
    price: 3.5,
    unit: '1L',
    category: 'Dairy & Eggs',
    inStock: true,
    stockCount: 100,
  },
  {
    id: 'r2',
    storeId: 's1',
    name: 'Organic Bananas',
    description: 'Organic bananas',
    imageUrl: IMG(1571771894018),
    price: 1.2,
    unit: 'bunch',
    category: 'Fruits',
    inStock: true,
    stockCount: 90,
  },
];

export const MOCK_CART_ITEMS = [
  {
    productId: 'p1',
    product: MOCK_PRODUCTS[0]!,
    quantity: 2,
  },
  {
    productId: 'p3',
    product: MOCK_PRODUCTS[2]!,
    quantity: 1,
  },
];

export const MOCK_ADDRESS: Address = {
  id: 'a1',
  label: 'Home',
  line1: 'Premium Urban Lofts, Apt 402',
  line2: '12th Ave, Midtown Commercial District, Metropolis',
  city: 'Metropolis',
  state: 'NY',
  zipCode: '10001',
  isDefault: true,
};

export const MOCK_ORDERS: Order[] = [
  {
    id: 'o1',
    displayId: 'FD-8291',
    storeId: 's1',
    storeName: 'Organic Market',
    items: MOCK_CART_ITEMS,
    status: OrderStatus.OutForDelivery,
    address: MOCK_ADDRESS,
    summary: { subtotal: 42.5, deliveryFee: 0, taxes: 2.45, discount: 0, total: 42.5 },
    createdAt: new Date().toISOString(),
    estimatedDelivery: '15-20 min',
    estimatedDeliveryWindow: '12:45 PM – 1:00 PM',
    deliveryPartner: MOCK_DELIVERY_PARTNER,
    isOnTime: true,
  },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: NotificationType.Order,
    title: 'Order on the way',
    body: 'Your order from Organic Market is out for delivery.',
    read: false,
    createdAt: new Date().toISOString(),
  },
];

export const MOCK_VENDOR_PRODUCTS: VendorProduct[] = MOCK_PRODUCTS.map((p, i) => ({
  ...p,
  sku: `SKU-${1000 + i}`,
  lowStockThreshold: 10,
}));

export const MOCK_DELIVERY_ASSIGNMENTS: DeliveryAssignment[] = [
  {
    id: 'd1',
    orderId: 'o1',
    storeName: 'Organic Market',
    customerAddress: 'Premium Urban Lofts, Apt 402',
    status: OrderStatus.ReadyForPickup,
    pickupConfirmed: false,
    deliveryConfirmed: false,
    earnings: 8.5,
  },
];

export const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

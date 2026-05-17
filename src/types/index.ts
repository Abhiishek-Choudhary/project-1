import type { UserRole, OrderStatus, ProductBadge, NotificationType } from '../constants/enums';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface Store {
  id: string;
  name: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  deliveryFee: number;
  distanceKm: number;
  categories: string[];
  isOpen: boolean;
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  brand?: string;
  description: string;
  imageUrl: string;
  price: number;
  originalPrice?: number;
  unit: string;
  category: string;
  badge?: ProductBadge;
  inStock: boolean;
  stockCount: number;
  tags?: string[];
  nutrition?: NutritionInfo;
  pricePerKg?: number;
}

export interface NutritionInfo {
  calories: string;
  fiber: string;
  sugar: string;
  vitaminC: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}

export interface Address {
  id: string;
  label: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export interface OrderSummary {
  subtotal: number;
  deliveryFee: number;
  taxes: number;
  discount: number;
  total: number;
}

export interface DeliveryPartner {
  id: string;
  name: string;
  avatarUrl: string;
  rating: number;
  title: string;
}

export interface Order {
  id: string;
  displayId?: string;
  storeId: string;
  storeName: string;
  items: CartItem[];
  status: OrderStatus;
  address: Address;
  summary: OrderSummary;
  createdAt: string;
  estimatedDelivery?: string;
  estimatedDeliveryWindow?: string;
  deliveryPartner?: DeliveryPartner;
  isOnTime?: boolean;
}

export interface CheckoutLineItem {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
}

export interface CheckoutSummary {
  itemTotal: number;
  deliveryFee: number;
  deliveryFeeStrikethrough?: number;
  taxes: number;
  discount: number;
  total: number;
  couponCode?: string;
}

export interface DeliverySlot {
  id: string;
  label: string;
  sublabel?: string;
  isExpress?: boolean;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  data?: Record<string, string>;
}

export interface VendorProduct extends Product {
  sku: string;
  lowStockThreshold: number;
}

export interface DeliveryAssignment {
  id: string;
  orderId: string;
  storeName: string;
  customerAddress: string;
  status: OrderStatus;
  pickupConfirmed: boolean;
  deliveryConfirmed: boolean;
  earnings: number;
}

export interface VendorStats {
  todayRevenue: number;
  revenueChange: number;
  activeOrders: number;
  inDelivery: number;
}

export interface VendorRecentOrder {
  id: string;
  itemCount: number;
  total: number;
  timeAgo: string;
  status: 'new' | 'preparing' | 'on_way';
  statusLabel: string;
}

export interface VendorInventoryItem {
  id: string;
  name: string;
  category: string;
  unit: string;
  price: number;
  imageUrl: string;
  stockCount: number;
  lowStockThreshold: number;
  inStock: boolean;
  isLowStock: boolean;
  isSoldOut: boolean;
}

export interface DeliveryDashboardStats {
  earningsToday: number;
  earningsChange: number;
  deliveriesCount: number;
  completionRate: number;
  timeOnline: string;
  shiftEndsIn: string;
}

export interface DeliveryActiveOrder {
  id: string;
  displayId: string;
  customerName: string;
  itemCount: number;
  etaMinutes: number;
  addressLine1: string;
  addressLine2: string;
  mapImageUrl: string;
}

export interface DeliveryHotspot {
  id: string;
  name: string;
  surgeBonus: number;
}

export interface DeliveryOrderItem {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  imageUrl: string;
}

export interface DeliveryOrderDetail {
  id: string;
  displayId: string;
  estimatedMinutes: string;
  distanceMiles: number;
  mapImageUrl: string;
  pickup: {
    storeName: string;
    address: string;
    phone: string;
  };
  delivery: {
    customerName: string;
    address: string;
    instructions: string;
  };
  items: DeliveryOrderItem[];
  subtotal: number;
  driverEarnings: number;
  pickupConfirmed: boolean;
  status: OrderStatus;
}

export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

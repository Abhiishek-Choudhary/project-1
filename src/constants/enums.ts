export enum UserRole {
  User = 'user',
  Vendor = 'vendor',
  DeliveryPartner = 'delivery_partner',
  Admin = 'admin',
}

export enum OrderStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  Preparing = 'preparing',
  ReadyForPickup = 'ready_for_pickup',
  OutForDelivery = 'out_for_delivery',
  Delivered = 'delivered',
  Cancelled = 'cancelled',
}

export enum ProductBadge {
  Organic = 'ORGANIC',
  Sale = 'SALE',
}

export enum NotificationType {
  Order = 'order',
  Delivery = 'delivery',
  Promo = 'promo',
  System = 'system',
}

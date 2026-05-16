export const AuthRoutes = {
  Login: 'Login',
  Signup: 'Signup',
  OtpVerification: 'OtpVerification',
} as const;

export const UserTabRoutes = {
  Home: 'Home',
  Search: 'Search',
  Orders: 'Orders',
  Profile: 'Profile',
} as const;

export const UserStackRoutes = {
  MainTabs: 'MainTabs',
  StoreProducts: 'StoreProducts',
  ProductDetail: 'ProductDetail',
  Cart: 'Cart',
  Checkout: 'Checkout',
  AddressList: 'AddressList',
  AddressForm: 'AddressForm',
  OrderTracking: 'OrderTracking',
  Notifications: 'Notifications',
  CategoryBrowse: 'CategoryBrowse',
} as const;

export const VendorRoutes = {
  Dashboard: 'VendorDashboard',
  Inventory: 'VendorInventory',
  ProductForm: 'VendorProductForm',
  Orders: 'VendorOrders',
  Earnings: 'VendorEarnings',
} as const;

export const DeliveryRoutes = {
  Dashboard: 'DeliveryDashboard',
  Deliveries: 'DeliveryDeliveries',
  DeliveryDetail: 'DeliveryDetail',
} as const;

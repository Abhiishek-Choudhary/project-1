export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
    verifyOtp: '/auth/verify-otp',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    me: '/auth/me',
  },
  stores: {
    list: '/stores',
    nearby: '/stores/nearby',
    detail: (id: string) => `/stores/${id}`,
    products: (id: string) => `/stores/${id}/products`,
  },
  products: {
    detail: (id: string) => `/products/${id}`,
    search: '/products/search',
    related: (id: string) => `/products/${id}/related`,
  },
  cart: {
    get: '/cart',
    sync: '/cart/sync',
  },
  orders: {
    list: '/orders',
    create: '/orders',
    detail: (id: string) => `/orders/${id}`,
    track: (id: string) => `/orders/${id}/track`,
  },
  addresses: {
    list: '/addresses',
    create: '/addresses',
    update: (id: string) => `/addresses/${id}`,
    delete: (id: string) => `/addresses/${id}`,
  },
  notifications: {
    list: '/notifications',
    markRead: (id: string) => `/notifications/${id}/read`,
  },
  vendor: {
    dashboard: '/vendor/dashboard',
    products: '/vendor/products',
    product: (id: string) => `/vendor/products/${id}`,
    orders: '/vendor/orders',
    earnings: '/vendor/earnings',
  },
  delivery: {
    dashboard: '/delivery/dashboard',
    assignments: '/delivery/assignments',
    confirmPickup: (id: string) => `/delivery/assignments/${id}/pickup`,
    confirmDelivery: (id: string) => `/delivery/assignments/${id}/deliver`,
  },
} as const;

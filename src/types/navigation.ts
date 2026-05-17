import type { NavigatorScreenParams } from '@react-navigation/native';
import type { UserRole } from '../constants/enums';
import type { Product, Store } from './index';

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  OtpVerification: { phone: string; isSignup?: boolean; role?: UserRole };
};

export type UserTabParamList = {
  Home: undefined;
  Search: undefined;
  Orders: undefined;
  Profile: undefined;
};

export type UserStackParamList = {
  MainTabs: NavigatorScreenParams<UserTabParamList>;
  StoreProducts: { store: Store };
  ProductDetail: { product: Product };
  Cart: undefined;
  Checkout: undefined;
  AddressList: undefined;
  AddressForm: { addressId?: string };
  OrderTracking: { orderId: string };
  Notifications: undefined;
  CategoryBrowse: { category: string };
  ProductScanner: undefined;
};

export type VendorTabParamList = {
  VendorDashboard: undefined;
  VendorOrders: undefined;
  VendorInventory: undefined;
  VendorAnalytics: undefined;
};

export type VendorStackParamList = {
  VendorMainTabs: NavigatorScreenParams<VendorTabParamList>;
  VendorProductForm: { productId?: string };
};

export type DeliveryTabParamList = {
  DeliveryDashboard: undefined;
  DeliveryEarnings: undefined;
  DeliveryHistory: undefined;
  DeliveryProfile: undefined;
};

export type DeliveryStackParamList = {
  DeliveryMainTabs: NavigatorScreenParams<DeliveryTabParamList>;
  DeliveryOrderDetail: { assignmentId: string };
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  UserApp: NavigatorScreenParams<UserStackParamList>;
  VendorApp: NavigatorScreenParams<VendorStackParamList>;
  DeliveryApp: NavigatorScreenParams<DeliveryStackParamList>;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export interface LoginFormData {
  phone: string;
}

export interface SignupFormData {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
}

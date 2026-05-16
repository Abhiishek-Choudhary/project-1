import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { UserStackParamList } from '../types/navigation';
import { UserTabNavigator } from './UserTabNavigator';
import { StoreProductsScreen } from '../screens/user/StoreProductsScreen';
import { ProductDetailScreen } from '../screens/user/ProductDetailScreen';
import { CartScreen } from '../screens/user/CartScreen';
import { CheckoutScreen } from '../screens/user/CheckoutScreen';
import { AddressListScreen } from '../screens/user/AddressListScreen';
import { OrderTrackingScreen } from '../screens/user/OrderTrackingScreen';
import { NotificationsScreen } from '../screens/user/NotificationsScreen';
import { CategoryBrowseScreen } from '../screens/user/CategoryBrowseScreen';

const Stack = createNativeStackNavigator<UserStackParamList>();

export function UserNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={UserTabNavigator} />
      <Stack.Screen name="StoreProducts" component={StoreProductsScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="AddressList" component={AddressListScreen} />
      <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="CategoryBrowse" component={CategoryBrowseScreen} />
    </Stack.Navigator>
  );
}

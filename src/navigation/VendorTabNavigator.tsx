import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RoleTabBar, VENDOR_TAB_CONFIG } from '../components/layout/RoleTabBar';
import type { VendorTabParamList } from '../types/navigation';
import { VendorDashboardScreen } from '../screens/vendor/VendorDashboardScreen';
import { VendorOrdersScreen } from '../screens/vendor/VendorOrdersScreen';
import { VendorInventoryScreen } from '../screens/vendor/VendorInventoryScreen';
import { VendorAnalyticsScreen } from '../screens/vendor/VendorAnalyticsScreen';

const Tab = createBottomTabNavigator<VendorTabParamList>();

export function VendorTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <RoleTabBar {...props} config={VENDOR_TAB_CONFIG} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="VendorDashboard" component={VendorDashboardScreen} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="VendorOrders" component={VendorOrdersScreen} options={{ title: 'Orders' }} />
      <Tab.Screen name="VendorInventory" component={VendorInventoryScreen} options={{ title: 'Inventory' }} />
      <Tab.Screen name="VendorAnalytics" component={VendorAnalyticsScreen} options={{ title: 'Analytics' }} />
    </Tab.Navigator>
  );
}

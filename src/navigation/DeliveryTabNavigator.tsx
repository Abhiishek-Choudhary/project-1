import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RoleTabBar, DELIVERY_TAB_CONFIG } from '../components/layout/RoleTabBar';
import type { DeliveryTabParamList } from '../types/navigation';
import { DeliveryDashboardScreen } from '../screens/delivery/DeliveryDashboardScreen';
import { DeliveryEarningsScreen } from '../screens/delivery/DeliveryEarningsScreen';
import { DeliveryHistoryScreen } from '../screens/delivery/DeliveryHistoryScreen';
import { DeliveryProfileScreen } from '../screens/delivery/DeliveryProfileScreen';

const Tab = createBottomTabNavigator<DeliveryTabParamList>();

export function DeliveryTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <RoleTabBar {...props} config={DELIVERY_TAB_CONFIG} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="DeliveryDashboard" component={DeliveryDashboardScreen} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="DeliveryEarnings" component={DeliveryEarningsScreen} options={{ title: 'Earnings' }} />
      <Tab.Screen name="DeliveryHistory" component={DeliveryHistoryScreen} options={{ title: 'History' }} />
      <Tab.Screen name="DeliveryProfile" component={DeliveryProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

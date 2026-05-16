import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { DeliveryStackParamList } from '../types/navigation';
import { DeliveryTabNavigator } from './DeliveryTabNavigator';
import { DeliveryOrderDetailScreen } from '../screens/delivery/DeliveryOrderDetailScreen';

const Stack = createNativeStackNavigator<DeliveryStackParamList>();

export function DeliveryNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DeliveryMainTabs" component={DeliveryTabNavigator} />
      <Stack.Screen name="DeliveryOrderDetail" component={DeliveryOrderDetailScreen} />
    </Stack.Navigator>
  );
}

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { VendorStackParamList } from '../types/navigation';
import { VendorTabNavigator } from './VendorTabNavigator';
import { VendorProductFormScreen } from '../screens/vendor/VendorProductFormScreen';

const Stack = createNativeStackNavigator<VendorStackParamList>();

export function VendorNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="VendorMainTabs" component={VendorTabNavigator} />
      <Stack.Screen name="VendorProductForm" component={VendorProductFormScreen} />
    </Stack.Navigator>
  );
}

import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Loader } from '../components/ui/Loader';
import { UserRole } from '../constants/enums';
import { useTheme } from '../contexts/ThemeContext';
import { useAuthStore } from '../store/authStore';
import type { RootStackParamList } from '../types/navigation';
import { AuthNavigator } from './AuthNavigator';
import { UserNavigator } from './UserNavigator';
import { VendorNavigator } from './VendorNavigator';
import { DeliveryNavigator } from './DeliveryNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const { colors } = useTheme();
  const { user, isAuthenticated, isLoading, hydrate } = useAuthStore();

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  if (isLoading) {
    return <Loader fullScreen />;
  }

  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        dark: false,
        colors: {
          ...DefaultTheme.colors,
          primary: colors.primary,
          background: colors.background,
          card: colors.surface,
          text: colors.text,
          border: colors.border,
          notification: colors.accent,
        },
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : user?.role === UserRole.Vendor ? (
          <Stack.Screen name="VendorApp" component={VendorNavigator} />
        ) : user?.role === UserRole.DeliveryPartner ? (
          <Stack.Screen name="DeliveryApp" component={DeliveryNavigator} />
        ) : (
          <Stack.Screen name="UserApp" component={UserNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

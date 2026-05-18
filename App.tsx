import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { setupWebDocument } from './src/utils/webSetup';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AppNavigator } from './src/navigation/AppNavigator';
import { LanguageProvider } from './src/contexts/LanguageContext';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { ToastProvider } from './src/contexts/ToastContext';
import { ModalProvider } from './src/contexts/ModalContext';
import { SocketProvider } from './src/contexts/SocketContext';
import { NotificationProvider } from './src/contexts/NotificationContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const { isDark } = useTheme();
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <AppNavigator />
    </>
  );
}

export default function App() {
  useEffect(() => {
    setupWebDocument();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <LanguageProvider>
              <ToastProvider>
                <ModalProvider>
                  <SocketProvider>
                    <NotificationProvider>
                      <AppContent />
                    </NotificationProvider>
                  </SocketProvider>
                </ModalProvider>
              </ToastProvider>
            </LanguageProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

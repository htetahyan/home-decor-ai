import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Toaster } from 'sonner-native';

import { AppNavigator } from './src/navigation';
import { initializeRevenueCat } from './src/payment';
import { ClerkProvider } from './src/auth/ClerkProvider';

export default function App() {
  useEffect(() => {
    // Initialize RevenueCat on app start
    // Pass a user ID if you have an authenticated user
    initializeRevenueCat().catch((error) => {
      console.error('Failed to initialize RevenueCat:', error);
    });
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <ClerkProvider>
          <AppNavigator />
        </ClerkProvider>
        <Toaster
          position="top-center"
          richColors
          closeButton
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

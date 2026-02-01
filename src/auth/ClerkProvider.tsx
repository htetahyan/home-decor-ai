import React from 'react';
import { ClerkProvider as ClerkExpoProvider } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';

// Secure token cache for Clerk
const tokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return await SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error('Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env');
}

export const ClerkProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkExpoProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      {children}
    </ClerkExpoProvider>
  );
};

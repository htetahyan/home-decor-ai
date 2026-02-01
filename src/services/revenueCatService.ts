import Purchases, { CustomerInfo, PurchasesPackage } from 'react-native-purchases';
import { Platform } from 'react-native';
import { API_KEYS, REVENUECAT_PRODUCTS } from '../config/constants';

let isInitialized = false;

// Initialize RevenueCat
export async function initializeRevenueCat(): Promise<void> {
    if (isInitialized) return;

    try {
        const apiKey = API_KEYS.REVENUECAT_API_KEY;

        if (!apiKey) {
            console.warn('RevenueCat API key not configured');
            return;
        }

        Purchases.configure({ apiKey });
        isInitialized = true;
        console.log('RevenueCat initialized successfully');
    } catch (error) {
        console.error('Failed to initialize RevenueCat:', error);
    }
}

// Check if user has premium access
export async function checkPremiumStatus(): Promise<boolean> {
    try {
        if (!isInitialized) {
            await initializeRevenueCat();
        }

        const customerInfo = await Purchases.getCustomerInfo();
        return customerInfo.entitlements.active[REVENUECAT_PRODUCTS.entitlement] !== undefined;
    } catch (error) {
        console.error('Error checking premium status:', error);
        return false;
    }
}

// Get available subscription packages
export async function getSubscriptionPackages(): Promise<PurchasesPackage[]> {
    try {
        if (!isInitialized) {
            await initializeRevenueCat();
        }

        const offerings = await Purchases.getOfferings();

        if (offerings.current && offerings.current.availablePackages.length > 0) {
            return offerings.current.availablePackages;
        }

        return [];
    } catch (error) {
        console.error('Error fetching packages:', error);
        return [];
    }
}

// Purchase subscription
export async function purchasePackage(pkg: PurchasesPackage): Promise<{ success: boolean; customerInfo?: CustomerInfo; error?: string }> {
    try {
        if (!isInitialized) {
            await initializeRevenueCat();
        }

        const { customerInfo } = await Purchases.purchasePackage(pkg);

        const isPremium = customerInfo.entitlements.active[REVENUECAT_PRODUCTS.entitlement] !== undefined;

        return {
            success: isPremium,
            customerInfo,
        };
    } catch (error: any) {
        if (error.userCancelled) {
            return { success: false, error: 'Purchase cancelled' };
        }
        console.error('Purchase error:', error);
        return { success: false, error: error.message || 'Purchase failed' };
    }
}

// Restore purchases
export async function restorePurchases(): Promise<{ success: boolean; isPremium: boolean; error?: string }> {
    try {
        if (!isInitialized) {
            await initializeRevenueCat();
        }

        const customerInfo = await Purchases.restorePurchases();
        const isPremium = customerInfo.entitlements.active[REVENUECAT_PRODUCTS.entitlement] !== undefined;

        return { success: true, isPremium };
    } catch (error: any) {
        console.error('Restore error:', error);
        return { success: false, isPremium: false, error: error.message || 'Restore failed' };
    }
}

// Get customer info
export async function getCustomerInfo(): Promise<CustomerInfo | null> {
    try {
        if (!isInitialized) {
            await initializeRevenueCat();
        }

        return await Purchases.getCustomerInfo();
    } catch (error) {
        console.error('Error getting customer info:', error);
        return null;
    }
}

// Set user ID for RevenueCat (call after user authentication)
export async function identifyUser(userId: string): Promise<void> {
    try {
        if (!isInitialized) {
            await initializeRevenueCat();
        }

        await Purchases.logIn(userId);
    } catch (error) {
        console.error('Error identifying user:', error);
    }
}

// Logout from RevenueCat
export async function logoutRevenueCat(): Promise<void> {
    try {
        if (!isInitialized) return;
        await Purchases.logOut();
    } catch (error) {
        console.error('Error logging out from RevenueCat:', error);
    }
}

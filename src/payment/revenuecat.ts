/**
 * RevenueCat Configuration
 * 
 * This file contains the core RevenueCat configuration and initialization.
 * API Key: test_BhFIDFiPtakgOduTxLokRwBTNrw
 * 
 * Products:
 * - monthly: Monthly subscription
 * - yearly: Yearly subscription  
 * - lifetime: Lifetime purchase
 * 
 * Entitlements:
 * - AI Contract Analyzer: Premium AI features
 */

import { Platform } from 'react-native';
import Purchases, {
    LOG_LEVEL,
    CustomerInfo,
    PurchasesOffering,
    PurchasesPackage,
    PRODUCT_CATEGORY,
} from 'react-native-purchases';

// ============================================================================
// CONFIGURATION
// ============================================================================

export const REVENUECAT_CONFIG = {
    // API Keys (use the same key for both platforms in test mode)
    API_KEY_IOS: 'test_BhFIDFiPtakgOduTxLokRwBTNrw',
    API_KEY_ANDROID: 'test_BhFIDFiPtakgOduTxLokRwBTNrw',

    // Entitlement Identifiers (must match RevenueCat dashboard)
    ENTITLEMENTS: {
        AI_CONTRACT_ANALYZER: 'AI Contract Analyzer',
    },

    // Product Identifiers (must match App Store/Play Store product IDs)
    PRODUCTS: {
        MONTHLY: 'monthly',
        YEARLY: 'yearly',
        LIFETIME: 'lifetime',
    },

    // Offering Identifier (default offering in RevenueCat)
    DEFAULT_OFFERING: 'default',
} as const;

// ============================================================================
// INITIALIZATION
// ============================================================================

let isConfigured = false;

/**
 * Initialize RevenueCat SDK
 * Call this once when the app starts (e.g., in App.tsx)
 * 
 * @param appUserID - Optional user ID for identifying users across devices
 */
export async function initializeRevenueCat(appUserID?: string): Promise<void> {
    if (isConfigured) {
        console.log('[RevenueCat] Already configured');
        return;
    }

    try {
        // Set log level (use VERBOSE for development, ERROR for production)
        if (__DEV__) {
            Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
        } else {
            Purchases.setLogLevel(LOG_LEVEL.ERROR);
        }

        // Get platform-specific API key
        const apiKey = Platform.OS === 'ios'
            ? REVENUECAT_CONFIG.API_KEY_IOS
            : REVENUECAT_CONFIG.API_KEY_ANDROID;

        // Configure RevenueCat
        await Purchases.configure({
            apiKey,
            appUserID: appUserID || undefined,
        });

        isConfigured = true;
        console.log('[RevenueCat] Successfully configured');
    } catch (error) {
        console.error('[RevenueCat] Configuration error:', error);
        throw error;
    }
}

// ============================================================================
// USER IDENTIFICATION
// ============================================================================

/**
 * Login a user with their unique ID
 * This allows syncing purchases across devices
 * 
 * @param userID - Unique user identifier (e.g., Supabase user ID)
 */
export async function loginUser(userID: string): Promise<CustomerInfo> {
    try {
        const { customerInfo } = await Purchases.logIn(userID);
        console.log('[RevenueCat] User logged in:', userID);
        return customerInfo;
    } catch (error) {
        console.error('[RevenueCat] Login error:', error);
        throw error;
    }
}

/**
 * Logout the current user
 * Creates a new anonymous user
 */
export async function logoutUser(): Promise<CustomerInfo> {
    try {
        const customerInfo = await Purchases.logOut();
        console.log('[RevenueCat] User logged out');
        return customerInfo;
    } catch (error) {
        console.error('[RevenueCat] Logout error:', error);
        throw error;
    }
}

// ============================================================================
// CUSTOMER INFO
// ============================================================================

/**
 * Get current customer info
 * Contains subscription status, entitlements, etc.
 */
export async function getCustomerInfo(): Promise<CustomerInfo> {
    try {
        const customerInfo = await Purchases.getCustomerInfo();
        return customerInfo;
    } catch (error) {
        console.error('[RevenueCat] Error getting customer info:', error);
        throw error;
    }
}

/**
 * Add a listener for customer info changes
 * This is called whenever the subscription status changes
 * 
 * @param listener - Callback function with updated customer info
 * @returns Cleanup function to remove the listener
 */
export function addCustomerInfoUpdateListener(
    listener: (info: CustomerInfo) => void
): () => void {
    Purchases.addCustomerInfoUpdateListener(listener);

    return () => {
        Purchases.removeCustomerInfoUpdateListener(listener);
    };
}

// ============================================================================
// ENTITLEMENT CHECKING
// ============================================================================

/**
 * Check if user has access to AI Contract Analyzer
 * This is the main entitlement check for premium features
 */
export async function hasAIContractAnalyzerAccess(): Promise<boolean> {
    try {
        const customerInfo = await getCustomerInfo();
        return customerInfo.entitlements.active[REVENUECAT_CONFIG.ENTITLEMENTS.AI_CONTRACT_ANALYZER] !== undefined;
    } catch (error) {
        console.error('[RevenueCat] Error checking entitlement:', error);
        return false;
    }
}

/**
 * Check if user has a specific entitlement
 * 
 * @param entitlementID - The entitlement identifier to check
 */
export async function hasEntitlement(entitlementID: string): Promise<boolean> {
    try {
        const customerInfo = await getCustomerInfo();
        return customerInfo.entitlements.active[entitlementID] !== undefined;
    } catch (error) {
        console.error('[RevenueCat] Error checking entitlement:', error);
        return false;
    }
}

/**
 * Get all active entitlements
 */
export async function getActiveEntitlements(): Promise<string[]> {
    try {
        const customerInfo = await getCustomerInfo();
        return Object.keys(customerInfo.entitlements.active);
    } catch (error) {
        console.error('[RevenueCat] Error getting entitlements:', error);
        return [];
    }
}

// ============================================================================
// OFFERINGS & PRODUCTS
// ============================================================================

export interface OfferingDetails {
    offering: PurchasesOffering | null;
    monthly: PurchasesPackage | null;
    yearly: PurchasesPackage | null;
    lifetime: PurchasesPackage | null;
}

/**
 * Get current offerings (products available for purchase)
 */
export async function getOfferings(): Promise<OfferingDetails> {
    try {
        const offerings = await Purchases.getOfferings();
        const currentOffering = offerings.current;

        if (!currentOffering) {
            console.warn('[RevenueCat] No current offering found');
            return {
                offering: null,
                monthly: null,
                yearly: null,
                lifetime: null,
            };
        }

        // Find specific packages
        const monthly = currentOffering.monthly ||
            currentOffering.availablePackages.find(p =>
                p.identifier === REVENUECAT_CONFIG.PRODUCTS.MONTHLY ||
                p.packageType === 'MONTHLY'
            ) || null;

        const yearly = currentOffering.annual ||
            currentOffering.availablePackages.find(p =>
                p.identifier === REVENUECAT_CONFIG.PRODUCTS.YEARLY ||
                p.packageType === 'ANNUAL'
            ) || null;

        const lifetime = currentOffering.lifetime ||
            currentOffering.availablePackages.find(p =>
                p.identifier === REVENUECAT_CONFIG.PRODUCTS.LIFETIME ||
                p.packageType === 'LIFETIME'
            ) || null;

        return {
            offering: currentOffering,
            monthly,
            yearly,
            lifetime,
        };
    } catch (error) {
        console.error('[RevenueCat] Error getting offerings:', error);
        throw error;
    }
}

// ============================================================================
// PURCHASES
// ============================================================================

export interface PurchaseResult {
    success: boolean;
    customerInfo: CustomerInfo | null;
    error?: string;
}

/**
 * Purchase a specific package
 * 
 * @param pkg - The package to purchase
 */
export async function purchasePackage(pkg: PurchasesPackage): Promise<PurchaseResult> {
    try {
        const { customerInfo } = await Purchases.purchasePackage(pkg);

        // Check if the purchase grants AI Contract Analyzer access
        const hasAccess = customerInfo.entitlements.active[REVENUECAT_CONFIG.ENTITLEMENTS.AI_CONTRACT_ANALYZER] !== undefined;

        console.log('[RevenueCat] Purchase successful, has access:', hasAccess);

        return {
            success: true,
            customerInfo,
        };
    } catch (error: any) {
        // Handle user cancellation
        if (error.userCancelled) {
            console.log('[RevenueCat] User cancelled purchase');
            return {
                success: false,
                customerInfo: null,
                error: 'cancelled',
            };
        }

        console.error('[RevenueCat] Purchase error:', error);
        return {
            success: false,
            customerInfo: null,
            error: error.message || 'Purchase failed',
        };
    }
}

/**
 * Purchase the monthly subscription
 */
export async function purchaseMonthly(): Promise<PurchaseResult> {
    const { monthly } = await getOfferings();
    if (!monthly) {
        return {
            success: false,
            customerInfo: null,
            error: 'Monthly package not available',
        };
    }
    return purchasePackage(monthly);
}

/**
 * Purchase the yearly subscription
 */
export async function purchaseYearly(): Promise<PurchaseResult> {
    const { yearly } = await getOfferings();
    if (!yearly) {
        return {
            success: false,
            customerInfo: null,
            error: 'Yearly package not available',
        };
    }
    return purchasePackage(yearly);
}

/**
 * Purchase the lifetime access
 */
export async function purchaseLifetime(): Promise<PurchaseResult> {
    const { lifetime } = await getOfferings();
    if (!lifetime) {
        return {
            success: false,
            customerInfo: null,
            error: 'Lifetime package not available',
        };
    }
    return purchasePackage(lifetime);
}

/**
 * Restore previous purchases
 */
export async function restorePurchases(): Promise<PurchaseResult> {
    try {
        const customerInfo = await Purchases.restorePurchases();
        const hasAccess = customerInfo.entitlements.active[REVENUECAT_CONFIG.ENTITLEMENTS.AI_CONTRACT_ANALYZER] !== undefined;

        console.log('[RevenueCat] Restore successful, has access:', hasAccess);

        return {
            success: hasAccess,
            customerInfo,
        };
    } catch (error: any) {
        console.error('[RevenueCat] Restore error:', error);
        return {
            success: false,
            customerInfo: null,
            error: error.message || 'Restore failed',
        };
    }
}

// ============================================================================
// SUBSCRIPTION STATUS
// ============================================================================

export interface SubscriptionStatus {
    isActive: boolean;
    hasAIContractAnalyzer: boolean;
    activeSubscription: string | null;
    expirationDate: Date | null;
    willRenew: boolean;
}

/**
 * Get detailed subscription status
 */
export async function getSubscriptionStatus(): Promise<SubscriptionStatus> {
    try {
        const customerInfo = await getCustomerInfo();
        const aiEntitlement = customerInfo.entitlements.active[REVENUECAT_CONFIG.ENTITLEMENTS.AI_CONTRACT_ANALYZER];

        let activeSubscription: string | null = null;
        let expirationDate: Date | null = null;
        let willRenew = false;

        if (aiEntitlement) {
            activeSubscription = aiEntitlement.productIdentifier;
            expirationDate = aiEntitlement.expirationDate
                ? new Date(aiEntitlement.expirationDate)
                : null;
            willRenew = aiEntitlement.willRenew;
        }

        return {
            isActive: aiEntitlement !== undefined,
            hasAIContractAnalyzer: aiEntitlement !== undefined,
            activeSubscription,
            expirationDate,
            willRenew,
        };
    } catch (error) {
        console.error('[RevenueCat] Error getting subscription status:', error);
        return {
            isActive: false,
            hasAIContractAnalyzer: false,
            activeSubscription: null,
            expirationDate: null,
            willRenew: false,
        };
    }
}

// ============================================================================
// PROMOTIONAL OFFERS (iOS)
// ============================================================================

/**
 * Get promotional offer for a product (iOS only)
 * Requires setup in App Store Connect
 */
export async function getPromotionalOffer(
    pkg: PurchasesPackage,
    discountIdentifier: string
): Promise<any | null> {
    if (Platform.OS !== 'ios') {
        console.warn('[RevenueCat] Promotional offers are iOS only');
        return null;
    }

    try {
        const discount = pkg.product.discounts?.find(
            d => d.identifier === discountIdentifier
        );

        if (!discount) {
            console.warn('[RevenueCat] Discount not found:', discountIdentifier);
            return null;
        }

        const promoOffer = await Purchases.getPromotionalOffer(
            pkg.product,
            discount
        );

        return promoOffer;
    } catch (error) {
        console.error('[RevenueCat] Error getting promotional offer:', error);
        return null;
    }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
    Purchases,
    CustomerInfo,
    PurchasesOffering,
    PurchasesPackage,
    LOG_LEVEL,
};
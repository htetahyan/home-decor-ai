/**
 * RevenueCat Payment Module
 * 
 * Central export for all RevenueCat functionality.
 * 
 * Setup Instructions:
 * 1. Install packages: npm install react-native-purchases react-native-purchases-ui
 * 2. Import and call initializeRevenueCat() in App.tsx
 * 3. Use hooks or functions to check access and present paywalls
 * 
 * API keys: EXPO_PUBLIC_REVENUECAT_IOS_KEY, EXPO_PUBLIC_REVENUECAT_ANDROID_KEY,
 * or EXPO_PUBLIC_REVENUECAT_API_KEY as a shared fallback.
 * Entitlement: AI Contract Analyzer
 * Products: monthly, yearly, lifetime
 */

// Configuration & Core
export {
    REVENUECAT_CONFIG,
    initializeRevenueCat,
    loginUser,
    logoutUser,
    getCustomerInfo,
    addCustomerInfoUpdateListener,
    hasAIContractAnalyzerAccess,
    hasEntitlement,
    getActiveEntitlements,
    getOfferings,
    purchasePackage,
    purchaseMonthly,
    purchaseYearly,
    purchaseLifetime,
    restorePurchases,
    getSubscriptionStatus,
    getPromotionalOffer,
    Purchases,
    LOG_LEVEL,
} from './revenuecat';
export type {
    CustomerInfo,
    PurchasesOffering,
    PurchasesPackage,
    OfferingDetails,
    PurchaseResult,
    SubscriptionStatus,
} from './revenuecat';

// Paywall
export {
    presentPaywall,
    presentPaywallForOffering,
    presentPaywallIfNeeded,
    PAYWALL_RESULT,
} from './paywall';
export type { PaywallResult } from './paywall';

// Customer Center
export {
    presentCustomerCenter,
    isCustomerCenterAvailable,
} from './customerCenter';

// React Hooks
export {
    useCustomerInfo,
    useSubscription,
    usePaywall,
    useOfferings,
    usePremiumAccess,
} from './hooks';

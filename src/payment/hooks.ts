/**
 * React Hooks for RevenueCat Integration
 * 
 * Provides easy-to-use hooks for subscription status and paywall presentation.
 */

import { useState, useEffect, useCallback } from 'react';
import {
    CustomerInfo,
    getCustomerInfo,
    addCustomerInfoUpdateListener,
    hasAIContractAnalyzerAccess,
    getSubscriptionStatus,
    SubscriptionStatus,
    getOfferings,
    OfferingDetails,
} from './revenuecat';
import { presentPaywall, presentPaywallIfNeeded, PaywallResult } from './paywall';

// ============================================================================
// USE CUSTOMER INFO HOOK
// ============================================================================

interface UseCustomerInfoResult {
    customerInfo: CustomerInfo | null;
    loading: boolean;
    error: Error | null;
    refresh: () => Promise<void>;
}

/**
 * Hook to get and listen for customer info updates
 */
export function useCustomerInfo(): UseCustomerInfoResult {
    const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const refresh = useCallback(async () => {
        try {
            setLoading(true);
            const info = await getCustomerInfo();
            setCustomerInfo(info);
            setError(null);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Initial fetch
        refresh();

        // Subscribe to updates
        const cleanup = addCustomerInfoUpdateListener((info) => {
            setCustomerInfo(info);
        });

        return cleanup;
    }, [refresh]);

    return { customerInfo, loading, error, refresh };
}

// ============================================================================
// USE SUBSCRIPTION STATUS HOOK
// ============================================================================

interface UseSubscriptionResult {
    status: SubscriptionStatus;
    loading: boolean;
    error: Error | null;
    isPremium: boolean;
    refresh: () => Promise<void>;
}

/**
 * Hook to get subscription status with automatic updates
 */
export function useSubscription(): UseSubscriptionResult {
    const [status, setStatus] = useState<SubscriptionStatus>({
        isActive: false,
        hasAIContractAnalyzer: false,
        activeSubscription: null,
        expirationDate: null,
        willRenew: false,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const refresh = useCallback(async () => {
        try {
            setLoading(true);
            const subscriptionStatus = await getSubscriptionStatus();
            setStatus(subscriptionStatus);
            setError(null);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Initial fetch
        refresh();

        // Subscribe to customer info updates
        const cleanup = addCustomerInfoUpdateListener(() => {
            refresh();
        });

        return cleanup;
    }, [refresh]);

    return {
        status,
        loading,
        error,
        isPremium: status.hasAIContractAnalyzer,
        refresh
    };
}

// ============================================================================
// USE PAYWALL HOOK
// ============================================================================

interface UsePaywallResult {
    showPaywall: () => Promise<PaywallResult>;
    showPaywallIfNeeded: () => Promise<PaywallResult>;
    isPresentingPaywall: boolean;
    lastResult: PaywallResult | null;
}

/**
 * Hook for presenting paywalls
 */
export function usePaywall(): UsePaywallResult {
    const [isPresentingPaywall, setIsPresentingPaywall] = useState(false);
    const [lastResult, setLastResult] = useState<PaywallResult | null>(null);

    const showPaywall = useCallback(async () => {
        setIsPresentingPaywall(true);
        try {
            const result = await presentPaywall();
            setLastResult(result);
            return result;
        } finally {
            setIsPresentingPaywall(false);
        }
    }, []);

    const showPaywallIfNeeded = useCallback(async () => {
        setIsPresentingPaywall(true);
        try {
            const result = await presentPaywallIfNeeded();
            setLastResult(result);
            return result;
        } finally {
            setIsPresentingPaywall(false);
        }
    }, []);

    return { showPaywall, showPaywallIfNeeded, isPresentingPaywall, lastResult };
}

// ============================================================================
// USE OFFERINGS HOOK
// ============================================================================

interface UseOfferingsResult {
    offerings: OfferingDetails | null;
    loading: boolean;
    error: Error | null;
    refresh: () => Promise<void>;
}

/**
 * Hook to get available offerings/products
 */
export function useOfferings(): UseOfferingsResult {
    const [offerings, setOfferings] = useState<OfferingDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const refresh = useCallback(async () => {
        try {
            setLoading(true);
            const offeringsData = await getOfferings();
            setOfferings(offeringsData);
            setError(null);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return { offerings, loading, error, refresh };
}

// ============================================================================
// USE PREMIUM ACCESS HOOK
// ============================================================================

interface UsePremiumAccessResult {
    hasAccess: boolean;
    loading: boolean;
    checkAccess: () => Promise<boolean>;
}

/**
 * Simple hook for checking premium access
 */
export function usePremiumAccess(): UsePremiumAccessResult {
    const [hasAccess, setHasAccess] = useState(false);
    const [loading, setLoading] = useState(true);

    const checkAccess = useCallback(async () => {
        try {
            setLoading(true);
            const access = await hasAIContractAnalyzerAccess();
            setHasAccess(access);
            return access;
        } catch {
            setHasAccess(false);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAccess();

        // Subscribe to updates
        const cleanup = addCustomerInfoUpdateListener(() => {
            checkAccess();
        });

        return cleanup;
    }, [checkAccess]);

    return { hasAccess, loading, checkAccess };
}

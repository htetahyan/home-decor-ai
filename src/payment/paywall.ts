/**
 * RevenueCat Paywall Integration
 * 
 * This file provides paywall presentation using RevenueCat UI.
 * Paywalls are designed in the RevenueCat Dashboard.
 */

import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';
import { CustomerInfo, PurchasesPackage } from 'react-native-purchases';
import {
    getOfferings,
    getCustomerInfo,
    hasAIContractAnalyzerAccess,
    REVENUECAT_CONFIG
} from './revenuecat';

// ============================================================================
// PAYWALL RESULTS
// ============================================================================

export interface PaywallResult {
    success: boolean;
    result: PAYWALL_RESULT;
    customerInfo?: CustomerInfo;
    error?: string;
}

// ============================================================================
// PRESENT PAYWALL (USING REVENUECAT DASHBOARD DESIGN)
// ============================================================================

/**
 * Present the default paywall configured in RevenueCat Dashboard
 * This uses RevenueCat's remote paywall templates.
 * 
 * Make sure to configure a Paywall in the RevenueCat Dashboard first:
 * https://app.revenuecat.com/paywalls
 */
export async function presentPaywall(): Promise<PaywallResult> {
    try {
        // Check if user already has access
        const hasAccess = await hasAIContractAnalyzerAccess();
        if (hasAccess) {
            console.log('[Paywall] User already has access');
            return {
                success: true,
                result: PAYWALL_RESULT.PURCHASED,
            };
        }

        // Present the RevenueCat paywall
        const paywallResult = await RevenueCatUI.presentPaywall();

        console.log('[Paywall] Result:', paywallResult);

        switch (paywallResult) {
            case PAYWALL_RESULT.PURCHASED:
            case PAYWALL_RESULT.RESTORED:
                const customerInfo = await getCustomerInfo();
                return {
                    success: true,
                    result: paywallResult,
                    customerInfo,
                };

            case PAYWALL_RESULT.CANCELLED:
                return {
                    success: false,
                    result: paywallResult,
                    error: 'User cancelled',
                };

            case PAYWALL_RESULT.NOT_PRESENTED:
                return {
                    success: false,
                    result: paywallResult,
                    error: 'Paywall not presented',
                };

            case PAYWALL_RESULT.ERROR:
                return {
                    success: false,
                    result: paywallResult,
                    error: 'Paywall error',
                };

            default:
                return {
                    success: false,
                    result: paywallResult,
                    error: 'Unknown result',
                };
        }
    } catch (error: any) {
        console.error('[Paywall] Error presenting paywall:', error);
        return {
            success: false,
            result: PAYWALL_RESULT.ERROR,
            error: error.message || 'Failed to present paywall',
        };
    }
}

/**
 * Present paywall for a specific offering
 * Use when you have multiple offerings configured in RevenueCat
 * 
 * Note: The SDK fetches offerings automatically. This presents the paywall
 * with whatever the current offering is set to in RevenueCat dashboard.
 * For offering-specific paywalls, configure them in the RevenueCat dashboard.
 */
export async function presentPaywallForOffering(): Promise<PaywallResult> {
    try {
        // Present the default paywall (offerings are configured in RevenueCat dashboard)
        const paywallResult = await RevenueCatUI.presentPaywall();

        switch (paywallResult) {
            case PAYWALL_RESULT.PURCHASED:
            case PAYWALL_RESULT.RESTORED:
                const customerInfo = await getCustomerInfo();
                return {
                    success: true,
                    result: paywallResult,
                    customerInfo,
                };
            default:
                return {
                    success: false,
                    result: paywallResult,
                };
        }
    } catch (error: any) {
        console.error('[Paywall] Error presenting paywall:', error);
        return {
            success: false,
            result: PAYWALL_RESULT.ERROR,
            error: error.message,
        };
    }
}

/**
 * Present paywall if user doesn't have required entitlement
 * 
 * @param requiredEntitlement - The entitlement ID that grants access
 */
export async function presentPaywallIfNeeded(
    requiredEntitlement: string = REVENUECAT_CONFIG.ENTITLEMENTS.AI_CONTRACT_ANALYZER
): Promise<PaywallResult> {
    try {
        const customerInfo = await getCustomerInfo();
        const hasEntitlement = customerInfo.entitlements.active[requiredEntitlement] !== undefined;

        if (hasEntitlement) {
            console.log('[Paywall] User already has entitlement:', requiredEntitlement);
            return {
                success: true,
                result: PAYWALL_RESULT.PURCHASED,
                customerInfo,
            };
        }

        // User doesn't have access, present paywall
        return await presentPaywall();
    } catch (error: any) {
        console.error('[Paywall] Error:', error);
        return {
            success: false,
            result: PAYWALL_RESULT.ERROR,
            error: error.message,
        };
    }
}

// ============================================================================
// PAYWALL FOOTER (FOR CUSTOM UI)
// ============================================================================

/**
 * Get paywall footer component for custom UI implementation
 * Use this when you want to create a custom paywall design but use
 * RevenueCat's purchase buttons at the bottom.
 * 
 * Note: This requires using RevenueCatUI's Footer components in JSX.
 * See PaywallFooterComponent.tsx for implementation.
 */
export { PAYWALL_RESULT };
/**
 * RevenueCat Customer Center
 * 
 * Customer Center allows users to manage their subscriptions directly in the app.
 * Includes cancellation flows, subscription management, and support.
 * 
 * Documentation: https://www.revenuecat.com/docs/tools/customer-center
 */

import RevenueCatUI from 'react-native-purchases-ui';

// ============================================================================
// CUSTOMER CENTER
// ============================================================================

/**
 * Present the Customer Center
 * Allows users to:
 * - View subscription status
 * - Cancel subscription
 * - Change plans
 * - Get support
 * - View billing history
 */
export async function presentCustomerCenter(): Promise<void> {
    try {
        // RevenueCat Customer Center presentation
        // Note: Requires Customer Center to be enabled in RevenueCat Dashboard
        await RevenueCatUI.presentCustomerCenter();
        console.log('[CustomerCenter] Presented successfully');
    } catch (error: any) {
        console.error('[CustomerCenter] Error presenting:', error);
        throw error;
    }
}

/**
 * Check if Customer Center is available
 * Customer Center might not be available on all SDK versions
 */
export function isCustomerCenterAvailable(): boolean {
    // Check if the method exists
    return typeof RevenueCatUI.presentCustomerCenter === 'function';
}

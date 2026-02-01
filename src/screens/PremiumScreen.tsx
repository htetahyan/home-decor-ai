import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import { theme } from '../styles/theme';
import { useAppStore } from '../store/appStore';
import { purchasePackage, restorePurchases, getSubscriptionPackages } from '../services/revenueCatService';

const { width } = Dimensions.get('window');

// Benefits comparison data
const benefits = [
    { name: 'Daily Redesigns', free: '3', premium: '∞', premiumIcon: true },
    { name: 'AI Styles', free: 'Basic', premium: 'Advanced', premiumIcon: false },
    { name: 'Watermark', free: '✓', premium: '✗', premiumIcon: false },
    { name: 'Processing', free: 'Standard', premium: '⚡ Fast', premiumIcon: false },
];

// Premium features
const premiumFeatures = [
    { id: '4k', icon: 'HQ', label: '4K Render Quality' },
    { id: 'colors', icon: '🎨', label: 'Exclusive Colors' },
];

export const PremiumScreen: React.FC = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const { setPremiumStatus } = useAppStore();

    const [isLoading, setIsLoading] = useState(false);
    const [isRestoring, setIsRestoring] = useState(false);

    const handlePurchase = async () => {
        setIsLoading(true);
        try {
            const packages = await getSubscriptionPackages();
            if (packages.length > 0) {
                const result = await purchasePackage(packages[0]);
                if (result.success) {
                    setPremiumStatus(true);
                    navigation.goBack();
                }
            } else {
                // Demo mode - just grant premium for testing
                setPremiumStatus(true);
                navigation.goBack();
            }
        } catch (error) {
            console.error('Purchase failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRestore = async () => {
        setIsRestoring(true);
        try {
            const result = await restorePurchases();
            if (result.isPremium) {
                setPremiumStatus(true);
                navigation.goBack();
            } else {
                alert('No purchases to restore');
            }
        } catch (error) {
            console.error('Restore failed:', error);
        } finally {
            setIsRestoring(false);
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.closeIcon}>✕</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Go Premium</Text>
                <TouchableOpacity onPress={handleRestore} disabled={isRestoring}>
                    <Text style={styles.restoreText}>
                        {isRestoring ? 'Restoring...' : 'Restore'}
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Hero Image */}
                <View style={styles.heroContainer}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800' }}
                        style={styles.heroImage}
                        resizeMode="cover"
                    />
                    <View style={styles.heroBadge}>
                        <Text style={styles.heroBadgeIcon}>✨</Text>
                        <Text style={styles.heroBadgeText}>AI Redesigned</Text>
                    </View>
                </View>

                {/* Title */}
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Unlock Your</Text>
                    <Text style={styles.titleGreen}>Dream Home</Text>
                    <Text style={styles.subtitle}>
                        Join thousands of users creating stunning{'\n'}spaces with our advanced AI tools.
                    </Text>
                </View>

                {/* Benefits Comparison */}
                <View style={styles.benefitsCard}>
                    <View style={styles.benefitsHeader}>
                        <Text style={styles.benefitsLabel}>BENEFITS</Text>
                        <Text style={styles.benefitsFree}>Free</Text>
                        <Text style={styles.benefitsPremium}>Premium</Text>
                    </View>

                    {benefits.map((benefit, index) => (
                        <View key={index} style={styles.benefitRow}>
                            <Text style={styles.benefitName}>{benefit.name}</Text>
                            <Text style={styles.benefitFreeValue}>{benefit.free}</Text>
                            <View style={styles.benefitPremiumValue}>
                                {benefit.premiumIcon ? (
                                    <Text style={styles.infinityIcon}>∞</Text>
                                ) : (
                                    <Text style={styles.premiumValue}>{benefit.premium}</Text>
                                )}
                            </View>
                        </View>
                    ))}
                </View>

                {/* Premium Features */}
                <View style={styles.featuresRow}>
                    {premiumFeatures.map((feature) => (
                        <View key={feature.id} style={styles.featureCard}>
                            <View style={styles.featureIconContainer}>
                                <Text style={styles.featureIcon}>{feature.icon}</Text>
                            </View>
                            <Text style={styles.featureLabel}>{feature.label}</Text>
                        </View>
                    ))}
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Bottom CTA */}
            <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
                <TouchableOpacity
                    style={styles.purchaseButton}
                    onPress={handlePurchase}
                    disabled={isLoading}
                >
                    <LinearGradient
                        colors={theme.colors.gradientPrimary}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.purchaseButtonGradient}
                    >
                        <Text style={styles.purchaseButtonText}>
                            {isLoading ? 'Processing...' : 'Go Premium · $4.99/mo →'}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>

                <View style={styles.legalLinks}>
                    <TouchableOpacity>
                        <Text style={styles.legalLink}>PRIVACY POLICY</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text style={styles.legalLink}>TERMS OF USE</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.sm,
    },
    closeButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeIcon: {
        fontSize: 20,
        color: theme.colors.textSecondary,
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: theme.colors.text,
    },
    restoreText: {
        fontSize: 15,
        color: theme.colors.textSecondary,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    heroContainer: {
        marginHorizontal: theme.spacing.lg,
        height: 200,
        borderRadius: theme.borderRadius.xl,
        overflow: 'hidden',
        marginBottom: theme.spacing.xl,
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    heroBadge: {
        position: 'absolute',
        top: theme.spacing.md,
        right: theme.spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.full,
    },
    heroBadgeIcon: {
        fontSize: 12,
        marginRight: 4,
    },
    heroBadgeText: {
        color: theme.colors.white,
        fontSize: 12,
        fontWeight: '600',
    },
    titleContainer: {
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.xl,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: theme.colors.text,
    },
    titleGreen: {
        fontSize: 28,
        fontWeight: '700',
        color: theme.colors.primary,
        marginBottom: theme.spacing.sm,
    },
    subtitle: {
        fontSize: 15,
        color: theme.colors.textMuted,
        textAlign: 'center',
        lineHeight: 22,
    },
    benefitsCard: {
        marginHorizontal: theme.spacing.lg,
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.lg,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    benefitsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        marginBottom: theme.spacing.md,
    },
    benefitsLabel: {
        flex: 1,
        fontSize: 11,
        fontWeight: '600',
        color: theme.colors.textMuted,
        letterSpacing: 0.5,
    },
    benefitsFree: {
        width: 70,
        textAlign: 'center',
        fontSize: 13,
        color: theme.colors.textSecondary,
        fontWeight: '500',
    },
    benefitsPremium: {
        width: 90,
        textAlign: 'center',
        fontSize: 13,
        color: theme.colors.primary,
        fontWeight: '600',
    },
    benefitRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: theme.spacing.sm,
    },
    benefitName: {
        flex: 1,
        fontSize: 14,
        color: theme.colors.text,
    },
    benefitFreeValue: {
        width: 70,
        textAlign: 'center',
        fontSize: 13,
        color: theme.colors.textMuted,
    },
    benefitPremiumValue: {
        width: 90,
        alignItems: 'center',
    },
    infinityIcon: {
        fontSize: 18,
        color: theme.colors.primary,
    },
    premiumValue: {
        fontSize: 13,
        color: theme.colors.text,
        fontWeight: '500',
    },
    featuresRow: {
        flexDirection: 'row',
        paddingHorizontal: theme.spacing.lg,
        gap: theme.spacing.md,
    },
    featureCard: {
        flex: 1,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        alignItems: 'center',
    },
    featureIconContainer: {
        width: 48,
        height: 48,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    featureIcon: {
        fontSize: 20,
    },
    featureLabel: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.md,
        backgroundColor: theme.colors.background,
    },
    purchaseButton: {
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        marginBottom: theme.spacing.md,
    },
    purchaseButtonGradient: {
        paddingVertical: theme.spacing.md + 2,
        alignItems: 'center',
    },
    purchaseButtonText: {
        color: theme.colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    legalLinks: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: theme.spacing.xl,
    },
    legalLink: {
        fontSize: 11,
        color: theme.colors.textMuted,
        letterSpacing: 0.5,
    },
});

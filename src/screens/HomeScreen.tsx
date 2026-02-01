import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
    StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { theme } from '../styles/theme';
import { RootStackParamList } from '../navigation/types';
import { useAppStore } from '../store/appStore';

const { width } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Sample data for Recent Redesigns
const recentRedesigns = [
    { id: '1', title: 'Living Room', time: '2 hours ago', style: 'MODERN', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400' },
    { id: '2', title: 'Master Bedroom', time: 'Yesterday', style: 'BOHO', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400' },
];

// Sample data for Trending Styles
const trendingStyles = [
    { id: '1', name: 'Scandi', subtitle: 'Clean & Functional', image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400', popular: false },
    { id: '2', name: 'Japandi', subtitle: 'Peaceful Zen', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', popular: true },
    { id: '3', name: 'Mid-Century', subtitle: 'Retro Vibes', image: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=400', popular: false },
    { id: '4', name: 'Industrial', subtitle: 'Raw & Edgy', image: 'https://images.unsplash.com/photo-1560448075-bb485b067938?w=400', popular: false },
];

export const HomeScreen: React.FC = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<NavigationProp>();
    const { isPremium, redesignsUsed, redesignsLimit } = useAppStore();
    const [isLoading, setIsLoading] = useState(false);

    const handleUploadPhoto = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            alert('Permission to access gallery is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            navigation.navigate('AIAnalysis', { imageUri: result.assets[0].uri });
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>👤</Text>
                        </View>
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.welcomeText}>Welcome back</Text>
                            <Text style={styles.userName}>Alex Morgan</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.notificationButton}>
                        <Text style={styles.notificationIcon}>🔔</Text>
                    </TouchableOpacity>
                </View>

                {/* Hero Banner */}
                <View style={styles.heroBanner}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800' }}
                        style={styles.heroImage}
                        resizeMode="cover"
                    />
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.6)']}
                        style={styles.heroOverlay}
                    >
                        <Text style={styles.heroTitle}>Transform your space</Text>
                        <Text style={styles.heroSubtitle}>Use AI to reimagine your room instantly.</Text>
                    </LinearGradient>
                </View>

                {/* New Feature Card */}
                <View style={styles.featureCard}>
                    <View style={styles.featureLeft}>
                        <Text style={styles.featureLabel}>NEW FEATURE</Text>
                        <Text style={styles.featureText}>Try our new{'\n'}"Industrial Chic"{'\n'}model</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.uploadButton}
                        onPress={handleUploadPhoto}
                    >
                        <LinearGradient
                            colors={theme.colors.gradientPrimary}
                            style={styles.uploadButtonGradient}
                        >
                            <Text style={styles.uploadButtonIcon}>📷</Text>
                            <Text style={styles.uploadButtonText}>Upload Photo</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* Recent Redesigns */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Redesigns</Text>
                        <TouchableOpacity>
                            <Text style={styles.sectionLink}>View All</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.horizontalScroll}
                    >
                        {recentRedesigns.map((item) => (
                            <TouchableOpacity key={item.id} style={styles.redesignCard}>
                                <Image
                                    source={{ uri: item.image }}
                                    style={styles.redesignImage}
                                    resizeMode="cover"
                                />
                                <View style={styles.redesignBadge}>
                                    <Text style={styles.redesignBadgeText}>{item.style}</Text>
                                </View>
                                <View style={styles.redesignInfo}>
                                    <Text style={styles.redesignTitle}>{item.title}</Text>
                                    <Text style={styles.redesignTime}>{item.time}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Trending Styles */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Trending Styles</Text>

                    <View style={styles.stylesGrid}>
                        {trendingStyles.map((style) => (
                            <TouchableOpacity
                                key={style.id}
                                style={styles.styleCard}
                                onPress={() => navigation.navigate('Styles' as any)}
                            >
                                <Image
                                    source={{ uri: style.image }}
                                    style={styles.styleImage}
                                    resizeMode="cover"
                                />
                                <LinearGradient
                                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                                    style={styles.styleOverlay}
                                >
                                    {style.popular && (
                                        <View style={styles.popularBadge}>
                                            <Text style={styles.popularBadgeText}>POPULAR</Text>
                                        </View>
                                    )}
                                    <Text style={styles.styleName}>{style.name}</Text>
                                    <Text style={styles.styleSubtitle}>{style.subtitle}</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Premium Banner (for free users) */}
                {!isPremium && (
                    <TouchableOpacity
                        style={styles.premiumBanner}
                        onPress={() => navigation.navigate('Premium')}
                    >
                        <LinearGradient
                            colors={theme.colors.gradientPrimary}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.premiumBannerGradient}
                        >
                            <View>
                                <Text style={styles.premiumBannerTitle}>Go Premium ✨</Text>
                                <Text style={styles.premiumBannerSubtitle}>
                                    {redesignsLimit - redesignsUsed} of {redesignsLimit} free redesigns left
                                </Text>
                            </View>
                            <Text style={styles.premiumArrow}>→</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                )}

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: theme.colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 20,
    },
    headerTextContainer: {
        marginLeft: theme.spacing.sm,
    },
    welcomeText: {
        fontSize: 12,
        color: theme.colors.textSecondary,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text,
    },
    notificationButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: theme.colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationIcon: {
        fontSize: 20,
    },
    heroBanner: {
        marginHorizontal: theme.spacing.lg,
        height: 180,
        borderRadius: theme.borderRadius.xl,
        overflow: 'hidden',
        marginBottom: theme.spacing.lg,
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        padding: theme.spacing.lg,
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: theme.colors.white,
        marginBottom: 4,
    },
    heroSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
    },
    featureCard: {
        marginHorizontal: theme.spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.lg,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    featureLeft: {
        flex: 1,
    },
    featureLabel: {
        fontSize: 10,
        fontWeight: '600',
        color: theme.colors.textMuted,
        letterSpacing: 1,
        marginBottom: 4,
    },
    featureText: {
        fontSize: 14,
        color: theme.colors.text,
        lineHeight: 20,
    },
    uploadButton: {
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
    },
    uploadButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: theme.spacing.sm + 4,
        paddingHorizontal: theme.spacing.md,
    },
    uploadButtonIcon: {
        fontSize: 16,
        marginRight: 6,
    },
    uploadButtonText: {
        color: theme.colors.white,
        fontWeight: '600',
        fontSize: 14,
    },
    section: {
        marginBottom: theme.spacing.lg,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.colors.text,
    },
    sectionLink: {
        fontSize: 14,
        color: theme.colors.primary,
        fontWeight: '500',
    },
    horizontalScroll: {
        paddingHorizontal: theme.spacing.lg,
        gap: theme.spacing.md,
    },
    redesignCard: {
        width: (width - 64) / 2,
        marginRight: theme.spacing.md,
    },
    redesignImage: {
        width: '100%',
        height: 150,
        borderRadius: theme.borderRadius.lg,
        backgroundColor: theme.colors.surface,
    },
    redesignBadge: {
        position: 'absolute',
        top: theme.spacing.sm,
        right: theme.spacing.sm,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: theme.borderRadius.sm,
    },
    redesignBadgeText: {
        fontSize: 10,
        fontWeight: '600',
        color: theme.colors.white,
        letterSpacing: 0.5,
    },
    redesignInfo: {
        marginTop: theme.spacing.sm,
    },
    redesignTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text,
    },
    redesignTime: {
        fontSize: 12,
        color: theme.colors.textMuted,
        marginTop: 2,
    },
    stylesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: theme.spacing.lg,
        gap: theme.spacing.md,
    },
    styleCard: {
        width: (width - 48 - 16) / 2,
        height: 120,
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
    },
    styleImage: {
        width: '100%',
        height: '100%',
    },
    styleOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        padding: theme.spacing.md,
    },
    popularBadge: {
        position: 'absolute',
        top: theme.spacing.sm,
        right: theme.spacing.sm,
        backgroundColor: theme.colors.secondary,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    popularBadgeText: {
        fontSize: 8,
        fontWeight: '700',
        color: theme.colors.white,
        letterSpacing: 0.5,
    },
    styleName: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.white,
    },
    styleSubtitle: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.8)',
    },
    premiumBanner: {
        marginHorizontal: theme.spacing.lg,
        borderRadius: theme.borderRadius.xl,
        overflow: 'hidden',
    },
    premiumBannerGradient: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing.lg,
    },
    premiumBannerTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.white,
    },
    premiumBannerSubtitle: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 2,
    },
    premiumArrow: {
        fontSize: 24,
        color: theme.colors.white,
    },
});

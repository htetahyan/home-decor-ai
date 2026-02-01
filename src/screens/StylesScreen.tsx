import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    TextInput,
    Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

import { theme } from '../styles/theme';
import { RootStackParamList } from '../navigation/types';
import { DESIGN_STYLES } from '../config/constants';

const { width } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Filter categories
const filterCategories = ['All', 'Modern', 'Classic', 'Boho', 'Minimal'];

// Trending styles with images
const trendingStyles = [
    {
        id: 'japandi',
        name: 'Japandi',
        description: 'Japanese rustic minimalism meets Scandinavian functionality. Clean...',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
        isHot: true,
    },
    {
        id: 'industrial',
        name: 'Industrial',
        description: 'Raw materials and metal accents...',
        image: 'https://images.unsplash.com/photo-1560448075-bb485b067938?w=400',
        isHot: false,
    },
];

// All style options
const allStyles = [
    { id: 'scandinavian', name: 'Scandinavian', subtitle: 'Functional & clean', image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400' },
    { id: 'minimalist', name: 'Minimalist', subtitle: 'Less is more', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400' },
    { id: 'bohemian', name: 'Bohemian', subtitle: 'Eclectic & colorful', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400' },
    { id: 'mid_century', name: 'Mid-Century', subtitle: 'Retro vibes', image: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=400' },
    { id: 'farmhouse', name: 'Farmhouse', subtitle: 'Cozy & modern', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400' },
    { id: 'traditional', name: 'Traditional', subtitle: 'Timeless elegance', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400' },
];

export const StylesScreen: React.FC = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<NavigationProp>();
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [selectedStyle, setSelectedStyle] = useState<string | null>('scandinavian');
    const [searchQuery, setSearchQuery] = useState('');

    // Filter styles based on search query
    const filteredStyles = useMemo(() => {
        return allStyles.filter(style => {
            const matchesSearch = style.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                style.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = selectedFilter === 'All' ||
                style.name.toLowerCase().includes(selectedFilter.toLowerCase());
            return matchesSearch && matchesFilter;
        });
    }, [searchQuery, selectedFilter]);

    // Filter trending styles based on search
    const filteredTrending = useMemo(() => {
        if (!searchQuery) return trendingStyles;
        return trendingStyles.filter(style =>
            style.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    const handleGenerateRoom = async () => {
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
            navigation.navigate('AIAnalysis', { 
                imageUri: result.assets[0].uri,
                style: selectedStyle 
            });
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Choose a Style</Text>
                <TouchableOpacity style={styles.moreButton}>
                    <Text style={styles.moreIcon}>•••</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search styles..."
                        placeholderTextColor={theme.colors.textMuted}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Filter Chips */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterContainer}
                >
                    {filterCategories.map((filter) => (
                        <TouchableOpacity
                            key={filter}
                            style={[
                                styles.filterChip,
                                selectedFilter === filter && styles.filterChipActive,
                            ]}
                            onPress={() => setSelectedFilter(filter)}
                        >
                            <Text style={[
                                styles.filterText,
                                selectedFilter === filter && styles.filterTextActive,
                            ]}>
                                {filter}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Trending Now Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Trending Now</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAllLink}>See all</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.trendingScroll}
                    >
                        {filteredTrending.map((style) => (
                            <View key={style.id} style={styles.trendingCard}>
                                <Image
                                    source={{ uri: style.image }}
                                    style={styles.trendingImage}
                                    resizeMode="cover"
                                />
                                <View style={styles.trendingInfo}>
                                    <View style={styles.trendingHeader}>
                                        <Text style={styles.trendingName}>{style.name}</Text>
                                        {style.isHot && (
                                            <View style={styles.hotBadge}>
                                                <Text style={styles.hotBadgeText}>HOT</Text>
                                            </View>
                                        )}
                                    </View>
                                    <Text style={styles.trendingDescription} numberOfLines={2}>
                                        {style.description}
                                    </Text>
                                    <TouchableOpacity style={styles.tryButton}>
                                        <Text style={styles.tryButtonText}>Try {style.name}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* Explore Styles Grid */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Explore Styles</Text>

                    <View style={styles.stylesGrid}>
                        {filteredStyles.map((style) => (
                            <TouchableOpacity
                                key={style.id}
                                style={[
                                    styles.styleCard,
                                    selectedStyle === style.id && styles.styleCardSelected,
                                ]}
                                onPress={() => setSelectedStyle(style.id)}
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
                                    {selectedStyle === style.id && (
                                        <View style={styles.checkBadge}>
                                            <Text style={styles.checkIcon}>✓</Text>
                                        </View>
                                    )}
                                    <Text style={styles.styleName}>{style.name}</Text>
                                    <Text style={styles.styleSubtitle}>{style.subtitle}</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Bottom CTA */}
            <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
                <TouchableOpacity
                    style={styles.generateButton}
                    onPress={handleGenerateRoom}
                >
                    <LinearGradient
                        colors={['#6366F1', '#8B5CF6']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.generateButtonGradient}
                    >
                        <Text style={styles.generateButtonIcon}>✨</Text>
                        <Text style={styles.generateButtonText}>Generate Room</Text>
                    </LinearGradient>
                </TouchableOpacity>
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
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backIcon: {
        fontSize: 24,
        color: theme.colors.text,
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: theme.colors.text,
    },
    moreButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    moreIcon: {
        fontSize: 16,
        color: theme.colors.text,
        letterSpacing: -1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.md,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        paddingHorizontal: theme.spacing.md,
        height: 48,
    },
    searchIcon: {
        fontSize: 16,
        marginRight: theme.spacing.sm,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: theme.colors.text,
        outlineStyle: 'none', // Remove focus ring on web
    } as any,
    filterContainer: {
        paddingHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.lg,
        gap: theme.spacing.sm,
    },
    filterChip: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.full,
        backgroundColor: theme.colors.surface,
        marginRight: theme.spacing.sm,
    },
    filterChipActive: {
        backgroundColor: theme.colors.text,
    },
    filterText: {
        fontSize: 13,
        fontWeight: '500',
        color: theme.colors.textSecondary,
    },
    filterTextActive: {
        color: theme.colors.white,
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
        paddingHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    seeAllLink: {
        fontSize: 14,
        color: theme.colors.secondary,
        fontWeight: '500',
    },
    trendingScroll: {
        paddingHorizontal: theme.spacing.lg,
    },
    trendingCard: {
        width: 200,
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        marginRight: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    trendingImage: {
        width: '100%',
        height: 100,
        backgroundColor: theme.colors.surface,
    },
    trendingInfo: {
        padding: theme.spacing.md,
    },
    trendingHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    trendingName: {
        fontSize: 15,
        fontWeight: '600',
        color: theme.colors.text,
        marginRight: theme.spacing.sm,
    },
    hotBadge: {
        backgroundColor: theme.colors.surface,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    hotBadgeText: {
        fontSize: 9,
        fontWeight: '700',
        color: theme.colors.textSecondary,
        letterSpacing: 0.5,
    },
    trendingDescription: {
        fontSize: 12,
        color: theme.colors.textMuted,
        lineHeight: 16,
        marginBottom: theme.spacing.sm,
    },
    tryButton: {
        borderWidth: 1,
        borderColor: theme.colors.secondary,
        borderRadius: theme.borderRadius.md,
        paddingVertical: theme.spacing.sm,
        alignItems: 'center',
    },
    tryButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: theme.colors.secondary,
    },
    stylesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: theme.spacing.lg,
        gap: theme.spacing.md,
    },
    styleCard: {
        width: (width - 48 - 16) / 2,
        height: 140,
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    styleCardSelected: {
        borderColor: theme.colors.secondary,
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
    checkBadge: {
        position: 'absolute',
        top: theme.spacing.sm,
        right: theme.spacing.sm,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: theme.colors.secondary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkIcon: {
        color: theme.colors.white,
        fontSize: 14,
        fontWeight: 'bold',
    },
    styleName: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.white,
    },
    styleSubtitle: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.8)',
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
    generateButton: {
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
    },
    generateButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.md + 2,
    },
    generateButtonIcon: {
        fontSize: 18,
        marginRight: 8,
    },
    generateButtonText: {
        color: theme.colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
});

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '../styles/theme';
import { RootStackParamList } from '../navigation/types';
import { analyzeRoomImage, RoomAnalysis, SuggestedItem } from '../services/geminiService';

const { width } = Dimensions.get('window');
const IMAGE_HEIGHT = 180;

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'AIAnalysis'>;

// Icon mapping for categories
const getCategoryIcon = (category: string): keyof typeof Ionicons.glyphMap => {
    const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
        sofa: 'bed-outline',
        armchair: 'square-outline',
        coffee_table: 'tablet-landscape-outline',
        lamp: 'bulb-outline',
        rug: 'grid-outline',
        plant: 'leaf-outline',
        bookshelf: 'library-outline',
        artwork: 'image-outline',
        curtains: 'apps-outline',
        side_table: 'cube-outline',
    };
    return icons[category] || 'home-outline';
};

export const AIAnalysisScreen: React.FC = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<RouteProps>();
    const { imageUri, style: initialStyle } = route.params;

    const [isAnalyzing, setIsAnalyzing] = useState(true);
    const [analysis, setAnalysis] = useState<RoomAnalysis | null>(null);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [error, setError] = useState<string | null>(null);
    const [loadingStep, setLoadingStep] = useState(0);

    const loadingSteps = [
        { icon: 'camera-outline' as const, text: 'Processing image...' },
        { icon: 'scan-outline' as const, text: 'Detecting furniture...' },
        { icon: 'color-palette-outline' as const, text: 'Analyzing style...' },
        { icon: 'sparkles' as const, text: 'Generating suggestions...' },
    ];

    useEffect(() => {
        analyzeRoom();
    }, []);

    // Animate loading steps
    useEffect(() => {
        if (isAnalyzing) {
            const interval = setInterval(() => {
                setLoadingStep(prev => (prev + 1) % loadingSteps.length);
            }, 1500);
            return () => clearInterval(interval);
        }
    }, [isAnalyzing]);

    const analyzeRoom = async () => {
        setIsAnalyzing(true);
        setError(null);
        try {
            const result = await analyzeRoomImage(imageUri);
            setAnalysis(result);
            const autoSelected = new Set(
                result.suggestedAdditions
                    .filter(item => item.priority === 'high')
                    .map(item => item.id)
            );
            setSelectedItems(autoSelected);
        } catch (err) {
            console.error('Analysis failed:', err);
            setError('Failed to analyze image. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const toggleItem = (itemId: string) => {
        const newSelected = new Set(selectedItems);
        if (newSelected.has(itemId)) {
            newSelected.delete(itemId);
        } else {
            newSelected.add(itemId);
        }
        setSelectedItems(newSelected);
    };

    const handleRedesign = () => {
        if (analysis) {
            navigation.navigate('RedesignPreview', {
                imageUri,
                analysis,
                selectedItems: Array.from(selectedItems),
                style: initialStyle || analysis.overallStyle.toLowerCase(),
            });
        }
    };

    const getPriorityColor = (priority: string): string => {
        switch (priority) {
            case 'high': return '#22C55E';
            case 'medium': return '#F59E0B';
            case 'low': return '#94A3B8';
            default: return '#94A3B8';
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.headerBtn}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Analysis</Text>
                <TouchableOpacity
                    style={styles.headerBtn}
                    onPress={analyzeRoom}
                    disabled={isAnalyzing}
                >
                    <Ionicons name="refresh" size={20} color={theme.colors.text} />
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Room Image */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: imageUri }}
                        style={styles.roomImage}
                        resizeMode="cover"
                    />
                    {!isAnalyzing && analysis && (
                        <View style={styles.roomTypeBadge}>
                            <Text style={styles.roomTypeText}>
                                {analysis.roomType} • {analysis.overallStyle}
                            </Text>
                        </View>
                    )}
                    {isAnalyzing && (
                        <View style={styles.loadingOverlay}>
                            <View style={styles.loadingCard}>
                                <View style={styles.loadingIconContainer}>
                                    <Ionicons
                                        name={loadingSteps[loadingStep].icon}
                                        size={28}
                                        color={theme.colors.primary}
                                    />
                                </View>
                                <Text style={styles.loadingTitle}>AI Analysis</Text>
                                <Text style={styles.loadingText}>{loadingSteps[loadingStep].text}</Text>
                                <View style={styles.loadingDots}>
                                    {loadingSteps.map((_, i) => (
                                        <View
                                            key={i}
                                            style={[
                                                styles.loadingDot,
                                                i === loadingStep && styles.loadingDotActive
                                            ]}
                                        />
                                    ))}
                                </View>
                            </View>
                        </View>
                    )}
                </View>

                {/* Error */}
                {error && (
                    <View style={styles.errorContainer}>
                        <Ionicons name="alert-circle" size={20} color="#EF4444" />
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity style={styles.retryBtn} onPress={analyzeRoom}>
                            <Text style={styles.retryBtnText}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Detected Items - Compact Tags */}
                {analysis && analysis.currentFurniture.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="scan-outline" size={16} color={theme.colors.textSecondary} />
                            <Text style={styles.sectionLabel}>Detected</Text>
                        </View>
                        <View style={styles.tagRow}>
                            {analysis.currentFurniture.slice(0, 5).map((item, i) => (
                                <View key={i} style={styles.tag}>
                                    <Text style={styles.tagText}>{item}</Text>
                                </View>
                            ))}
                            {analysis.currentFurniture.length > 5 && (
                                <View style={styles.tag}>
                                    <Text style={styles.tagText}>+{analysis.currentFurniture.length - 5}</Text>
                                </View>
                            )}
                        </View>
                    </View>
                )}

                {/* AI Suggestions - Compact List */}
                {analysis && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="sparkles" size={16} color={theme.colors.primary} />
                            <Text style={styles.sectionLabel}>Suggestions</Text>
                            <Text style={styles.selectedBadge}>{selectedItems.size} selected</Text>
                        </View>

                        {analysis.suggestedAdditions.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={[
                                    styles.suggestionRow,
                                    selectedItems.has(item.id) && styles.suggestionRowSelected
                                ]}
                                onPress={() => toggleItem(item.id)}
                                activeOpacity={0.7}
                            >
                                <View style={[
                                    styles.iconBox,
                                    selectedItems.has(item.id) && styles.iconBoxSelected
                                ]}>
                                    <Ionicons
                                        name={getCategoryIcon(item.category)}
                                        size={18}
                                        color={selectedItems.has(item.id) ? theme.colors.primary : theme.colors.textSecondary}
                                    />
                                </View>
                                <View style={styles.suggestionContent}>
                                    <Text style={styles.suggestionTitle}>{item.label}</Text>
                                    <Text style={styles.suggestionMeta} numberOfLines={1}>
                                        {item.placement}
                                    </Text>
                                </View>
                                <View style={[
                                    styles.priorityDot,
                                    { backgroundColor: getPriorityColor(item.priority) }
                                ]} />
                                <View style={[
                                    styles.checkbox,
                                    selectedItems.has(item.id) && styles.checkboxSelected
                                ]}>
                                    {selectedItems.has(item.id) && (
                                        <Ionicons name="checkmark" size={14} color="#fff" />
                                    )}
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* Tips - Minimal */}
                {analysis && analysis.improvements.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="bulb-outline" size={16} color={theme.colors.textSecondary} />
                            <Text style={styles.sectionLabel}>Tips</Text>
                        </View>
                        {analysis.improvements.slice(0, 2).map((tip, i) => (
                            <Text key={i} style={styles.tipText}>• {tip}</Text>
                        ))}
                    </View>
                )}

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Bottom CTA */}
            <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
                <TouchableOpacity
                    style={[styles.ctaButton, (!analysis || selectedItems.size === 0) && styles.ctaDisabled]}
                    onPress={handleRedesign}
                    disabled={!analysis || selectedItems.size === 0}
                >
                    <LinearGradient
                        colors={theme.colors.gradientPrimary}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.ctaGradient}
                    >
                        <Ionicons name="sparkles" size={18} color="#fff" />
                        <Text style={styles.ctaText}>
                            Redesign ({selectedItems.size})
                        </Text>
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
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    headerBtn: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text,
    },
    scrollContent: {
        paddingBottom: 16,
    },
    imageContainer: {
        width: width,
        height: IMAGE_HEIGHT,
        position: 'relative',
    },
    roomImage: {
        width: '100%',
        height: '100%',
    },
    roomTypeBadge: {
        position: 'absolute',
        bottom: 8,
        left: 12,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    roomTypeText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '500',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.95)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingCard: {
        backgroundColor: theme.colors.background,
        paddingHorizontal: 32,
        paddingVertical: 24,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    loadingIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: theme.colors.primary + '15',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    loadingTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: 4,
    },
    loadingText: {
        fontSize: 13,
        color: theme.colors.textSecondary,
        marginBottom: 16,
    },
    loadingDots: {
        flexDirection: 'row',
        gap: 6,
    },
    loadingDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: theme.colors.border,
    },
    loadingDotActive: {
        backgroundColor: theme.colors.primary,
        width: 16,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        gap: 8,
    },
    errorText: {
        flex: 1,
        fontSize: 13,
        color: '#EF4444',
    },
    retryBtn: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    retryBtnText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    section: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 10,
    },
    sectionLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: theme.colors.textSecondary,
        flex: 1,
    },
    selectedBadge: {
        fontSize: 12,
        color: theme.colors.primary,
        fontWeight: '500',
    },
    tagRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    tag: {
        backgroundColor: theme.colors.surface,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 14,
    },
    tagText: {
        fontSize: 12,
        color: theme.colors.textSecondary,
    },
    suggestionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginBottom: 6,
        backgroundColor: theme.colors.surface,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    suggestionRowSelected: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.primary + '08',
    },
    iconBox: {
        width: 34,
        height: 34,
        borderRadius: 8,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconBoxSelected: {
        backgroundColor: theme.colors.primary + '15',
    },
    suggestionContent: {
        flex: 1,
        marginLeft: 10,
    },
    suggestionTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: theme.colors.text,
    },
    suggestionMeta: {
        fontSize: 11,
        color: theme.colors.textMuted,
        marginTop: 1,
    },
    priorityDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 10,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: theme.colors.border,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxSelected: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    tipText: {
        fontSize: 12,
        color: theme.colors.textMuted,
        marginTop: 4,
        lineHeight: 18,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        paddingTop: 12,
        backgroundColor: theme.colors.background,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },
    ctaButton: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    ctaDisabled: {
        opacity: 0.5,
    },
    ctaGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        gap: 8,
    },
    ctaText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
});

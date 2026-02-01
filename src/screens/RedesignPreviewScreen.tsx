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
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { toast } from 'sonner-native';

import { theme } from '../styles/theme';
import { RootStackParamList } from '../navigation/types';
import { saveToGallery, shareImage, uploadImage } from '../services/storageService';
import { generateRedesignedRoom, buildRedesignPrompt } from '../services/replicateService';
import { useAppStore } from '../store/appStore';
import { STORAGE_BUCKETS } from '../config/supabase';

const { width } = Dimensions.get('window');

type NavigationProp = any;
type RouteProps = RouteProp<RootStackParamList, 'RedesignPreview'>;

export const RedesignPreviewScreen: React.FC = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<RouteProps>();
    const { imageUri, analysis, selectedItems, style } = route.params;
    const { incrementRedesignsUsed } = useAppStore();

    const [isGenerating, setIsGenerating] = useState(true);
    const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [generationProgress, setGenerationProgress] = useState('Preparing...');

    useEffect(() => {
        generateRedesign();
    }, []);

    const generateRedesign = async () => {
        setIsGenerating(true);
        setError(null);
        setGenerationProgress('Uploading image...');

        try {
            // Step 1: Upload room image to get public URL
            const uploadResult = await uploadImage(
                imageUri,
                STORAGE_BUCKETS.ROOM_IMAGES,
                'temp-user' // TODO: Use actual user ID when auth is connected
            );

            if (!uploadResult.success || !uploadResult.url) {
                throw new Error(uploadResult.error || 'Failed to upload image');
            }

            setGenerationProgress('Generating redesign...');

            // Step 2: Get selected item labels
            const selectedItemLabels = analysis.suggestedAdditions
                .filter(item => selectedItems.includes(item.id))
                .map(item => item.label);

            // Step 3: Build prompt for AI
            const prompt = buildRedesignPrompt(
                analysis.roomType,
                style || analysis.overallStyle,
                selectedItemLabels,
                analysis.improvements
            );

            console.log('Generating with prompt:', prompt);

            // Step 4: Generate redesigned image
            const result = await generateRedesignedRoom(uploadResult.url, prompt);

            if (!result.success || !result.imageUrl) {
                throw new Error(result.error || 'Image generation failed');
            }

            setGeneratedImageUrl(result.imageUrl);
            incrementRedesignsUsed();
            toast.success('Redesign complete!');
        } catch (err: any) {
            console.error('Redesign generation failed:', err);
            setError(err.message || 'Failed to generate redesign');
            toast.error('Generation failed. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = async () => {
        if (!generatedImageUrl) {
            toast.error('No image to save');
            return;
        }

        setIsSaving(true);
        try {
            const result = await saveToGallery(generatedImageUrl);
            if (result.success) {
                toast.success('Image saved to gallery!');
            } else {
                toast.error(result.error || 'Failed to save');
            }
        } catch (err) {
            toast.error('Failed to save image');
        }
        setIsSaving(false);
    };

    const handleShare = async () => {
        if (generatedImageUrl) {
            await shareImage(generatedImageUrl);
        }
    };

    const handleRetry = () => {
        generateRedesign();
    };

    // Get the items that were selected for this redesign
    const redesignedItems = analysis.suggestedAdditions.filter(item =>
        selectedItems.includes(item.id)
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{analysis.roomType} Redesign</Text>
                <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
                    <Ionicons name="refresh" size={20} color={theme.colors.text} />
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Before/After Comparison */}
                <View style={styles.imagesContainer}>
                    {/* Before Image */}
                    <View style={styles.imageCard}>
                        <Text style={styles.imageLabel}>Before</Text>
                        <Image
                            source={{ uri: imageUri }}
                            style={styles.previewImage}
                            resizeMode="cover"
                        />
                    </View>

                    {/* After Image */}
                    <View style={styles.imageCard}>
                        <Text style={styles.imageLabel}>After</Text>
                        {isGenerating ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color={theme.colors.primary} />
                                <Text style={styles.loadingText}>{generationProgress}</Text>
                            </View>
                        ) : error ? (
                            <View style={styles.errorContainer}>
                                <Ionicons name="alert-circle" size={32} color="#EF4444" />
                                <Text style={styles.errorText}>{error}</Text>
                                <TouchableOpacity style={styles.retryButtonSmall} onPress={handleRetry}>
                                    <Text style={styles.retryButtonText}>Try Again</Text>
                                </TouchableOpacity>
                            </View>
                        ) : generatedImageUrl ? (
                            <Image
                                source={{ uri: generatedImageUrl }}
                                style={styles.previewImage}
                                resizeMode="cover"
                            />
                        ) : null}
                    </View>
                </View>

                {/* Style Info */}
                <View style={styles.styleInfo}>
                    <View style={styles.styleTextContainer}>
                        <Text style={styles.styleTitle}>{style || analysis.overallStyle} Style</Text>
                        <Text style={styles.styleSubtitle}>
                            {redesignedItems.length} items added • AI Generated
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.likeButton}
                        onPress={() => setIsLiked(!isLiked)}
                    >
                        <Ionicons
                            name={isLiked ? 'heart' : 'heart-outline'}
                            size={22}
                            color={isLiked ? '#EF4444' : theme.colors.textSecondary}
                        />
                    </TouchableOpacity>
                </View>

                {/* Items Added */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Items Added</Text>
                    <View style={styles.itemsList}>
                        {redesignedItems.map((item) => (
                            <View key={item.id} style={styles.itemChip}>
                                <Ionicons name="checkmark-circle" size={14} color={theme.colors.primary} />
                                <Text style={styles.itemLabel}>{item.label}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Tips Applied */}
                {analysis.improvements.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Improvements Applied</Text>
                        {analysis.improvements.slice(0, 2).map((tip, index) => (
                            <Text key={index} style={styles.tipText}>• {tip}</Text>
                        ))}
                    </View>
                )}

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Bottom Action Bar */}
            <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={handleShare}
                        disabled={!generatedImageUrl}
                    >
                        <Ionicons name="share-outline" size={22} color={theme.colors.text} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.saveButton, (!generatedImageUrl || isSaving) && styles.saveButtonDisabled]}
                        onPress={handleSave}
                        disabled={!generatedImageUrl || isSaving}
                    >
                        <LinearGradient
                            colors={theme.colors.gradientPrimary}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.saveButtonGradient}
                        >
                            <Ionicons name="download-outline" size={18} color="#fff" />
                            <Text style={styles.saveButtonText}>
                                {isSaving ? 'Saving...' : 'Save to Gallery'}
                            </Text>
                        </LinearGradient>
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
    retryButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    retryIcon: {
        fontSize: 20,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    imagesContainer: {
        paddingHorizontal: theme.spacing.lg,
        gap: theme.spacing.md,
        marginBottom: theme.spacing.lg,
    },
    imageCard: {
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        backgroundColor: theme.colors.surface,
    },
    imageLabel: {
        position: 'absolute',
        top: theme.spacing.sm,
        left: theme.spacing.sm,
        backgroundColor: 'rgba(0,0,0,0.6)',
        color: theme.colors.white,
        fontSize: 12,
        fontWeight: '600',
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 4,
        borderRadius: theme.borderRadius.full,
        zIndex: 10,
    },
    previewImage: {
        width: '100%',
        height: 200,
    },
    loadingContainer: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
    },
    loadingText: {
        marginTop: theme.spacing.md,
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
    errorContainer: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.md,
    },
    errorIcon: {
        fontSize: 32,
        marginBottom: theme.spacing.sm,
    },
    errorText: {
        fontSize: 14,
        color: '#EF4444',
        textAlign: 'center',
        marginBottom: theme.spacing.md,
    },
    retryButtonSmall: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.md,
    },
    retryButtonText: {
        color: theme.colors.white,
        fontWeight: '600',
    },
    styleInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.lg,
    },
    styleTextContainer: {
        flex: 1,
    },
    styleTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.colors.text,
        marginBottom: 2,
    },
    styleSubtitle: {
        fontSize: 13,
        color: theme.colors.primary,
    },
    likeButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: theme.colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
    },
    likeIcon: {
        fontSize: 22,
    },
    section: {
        paddingHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
    },
    itemsList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    itemChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: theme.borderRadius.full,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    itemIcon: {
        fontSize: 16,
        marginRight: 6,
    },
    itemLabel: {
        fontSize: 13,
        color: theme.colors.text,
    },
    tipText: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        marginTop: 4,
        lineHeight: 20,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.md,
        backgroundColor: theme.colors.background,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    iconButton: {
        width: 48,
        height: 48,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconButtonIcon: {
        fontSize: 20,
        color: theme.colors.text,
    },
    saveButton: {
        flex: 1,
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
    },
    saveButtonDisabled: {
        opacity: 0.5,
    },
    saveButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.md,
    },
    saveButtonIcon: {
        fontSize: 16,
        color: theme.colors.white,
        marginRight: theme.spacing.sm,
    },
    saveButtonText: {
        color: theme.colors.white,
        fontSize: 15,
        fontWeight: '600',
    },
});

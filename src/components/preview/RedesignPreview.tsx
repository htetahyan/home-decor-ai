import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import { theme } from '../../styles/theme';
import { RedesignResult } from '../../services/geminiService';
import { Button } from '../common/Button';
import { shareImage, saveToGallery } from '../../services/storageService';

interface RedesignPreviewProps {
    originalImageUri: string;
    redesignResult: RedesignResult;
    onReset: () => void;
}

const { width } = Dimensions.get('window');

export const RedesignPreview: React.FC<RedesignPreviewProps> = ({
    originalImageUri,
    redesignResult,
    onReset,
}) => {
    const [isSaving, setIsSaving] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const [saveMessage, setSaveMessage] = useState<string | null>(null);

    const handleSave = async () => {
        setIsSaving(true);
        setSaveMessage(null);

        const result = await saveToGallery(originalImageUri);

        if (result.success) {
            setSaveMessage('Saved to gallery!');
        } else {
            setSaveMessage(result.error || 'Failed to save');
        }

        setIsSaving(false);

        // Clear message after 3 seconds
        setTimeout(() => setSaveMessage(null), 3000);
    };

    const handleShare = async () => {
        setIsSharing(true);
        await shareImage(originalImageUri);
        setIsSharing(false);
    };

    return (
        <View style={styles.container}>
            {/* Image Preview */}
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: originalImageUri }}
                    style={styles.image}
                    resizeMode="cover"
                />

                {/* Style Badge */}
                <View style={styles.styleBadge}>
                    <Text style={styles.styleBadgeText}>
                        {redesignResult.styleApplied} Style
                    </Text>
                </View>
            </View>

            {/* Redesign Description */}
            <View style={styles.contentContainer}>
                <Text style={styles.sectionTitle}>✨ Redesign Suggestions</Text>

                <Text style={styles.description}>
                    {redesignResult.description}
                </Text>

                {/* Selected Items Summary */}
                <View style={styles.itemsSummary}>
                    <Text style={styles.itemsTitle}>Items to Add:</Text>
                    <View style={styles.itemsGrid}>
                        {redesignResult.selectedItems.map((item) => (
                            <View key={item.id} style={styles.itemChip}>
                                <Text style={styles.itemChipIcon}>{item.icon}</Text>
                                <Text style={styles.itemChipLabel}>{item.label}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Save Message */}
                {saveMessage && (
                    <View style={styles.messageContainer}>
                        <Text style={styles.messageText}>{saveMessage}</Text>
                    </View>
                )}

                {/* Action Buttons */}
                <View style={styles.actions}>
                    <Button
                        title="Save to Gallery"
                        onPress={handleSave}
                        loading={isSaving}
                        variant="primary"
                        style={styles.actionButton}
                    />

                    <Button
                        title="Share"
                        onPress={handleShare}
                        loading={isSharing}
                        variant="outline"
                        style={styles.actionButton}
                    />
                </View>

                <TouchableOpacity style={styles.resetButton} onPress={onReset}>
                    <Text style={styles.resetButtonText}>Start New Redesign</Text>
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
    imageContainer: {
        width: width,
        height: width * 0.75,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    styleBadge: {
        position: 'absolute',
        bottom: theme.spacing.md,
        left: theme.spacing.md,
        backgroundColor: theme.colors.primary,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.full,
    },
    styleBadgeText: {
        color: theme.colors.white,
        fontSize: 12,
        fontWeight: '600',
    },
    contentContainer: {
        flex: 1,
        padding: theme.spacing.lg,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
    },
    description: {
        fontSize: 15,
        color: theme.colors.textSecondary,
        lineHeight: 24,
        marginBottom: theme.spacing.lg,
    },
    itemsSummary: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.lg,
    },
    itemsTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
    },
    itemsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.xs,
    },
    itemChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.backgroundLight,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 6,
        borderRadius: theme.borderRadius.full,
        gap: 4,
    },
    itemChipIcon: {
        fontSize: 14,
    },
    itemChipLabel: {
        fontSize: 12,
        color: theme.colors.text,
        fontWeight: '500',
    },
    messageContainer: {
        backgroundColor: theme.colors.accent + '20',
        padding: theme.spacing.sm,
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.md,
    },
    messageText: {
        color: theme.colors.accent,
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
    },
    actions: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.md,
    },
    actionButton: {
        flex: 1,
    },
    resetButton: {
        alignItems: 'center',
        padding: theme.spacing.md,
    },
    resetButtonText: {
        color: theme.colors.textMuted,
        fontSize: 14,
        textDecorationLine: 'underline',
    },
});

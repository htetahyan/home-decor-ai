import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { theme } from '../../styles/theme';
import { DESIGN_STYLES } from '../../config/constants';

interface StyleSelectorProps {
    selectedStyle: string;
    onSelectStyle: (styleId: string) => void;
    isPremium: boolean;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({
    selectedStyle,
    onSelectStyle,
    isPremium,
}) => {
    const getStyleEmoji = (styleId: string): string => {
        const emojis: Record<string, string> = {
            modern: '🏢',
            scandinavian: '🌿',
            industrial: '🏭',
            bohemian: '🎨',
            minimalist: '⬜',
            traditional: '🏛️',
            mid_century: '🕰️',
            coastal: '🌊',
        };
        return emojis[styleId] || '🏠';
    };

    // Free users only get first 2 styles
    const availableStyles = isPremium ? DESIGN_STYLES : DESIGN_STYLES.slice(0, 2);
    const lockedStyles = isPremium ? [] : DESIGN_STYLES.slice(2);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Design Style</Text>
            <Text style={styles.subtitle}>
                {isPremium ? 'Choose your preferred aesthetic' : 'Upgrade for more styles'}
            </Text>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {availableStyles.map((style) => (
                    <TouchableOpacity
                        key={style.id}
                        style={[
                            styles.styleCard,
                            selectedStyle === style.id && styles.styleCardSelected,
                        ]}
                        onPress={() => onSelectStyle(style.id)}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.styleEmoji}>{getStyleEmoji(style.id)}</Text>
                        <Text style={styles.styleLabel}>{style.label}</Text>
                        <Text style={styles.styleDescription} numberOfLines={2}>
                            {style.description}
                        </Text>
                    </TouchableOpacity>
                ))}

                {lockedStyles.map((style) => (
                    <View key={style.id} style={[styles.styleCard, styles.styleCardLocked]}>
                        <View style={styles.lockOverlay}>
                            <Text style={styles.lockIcon}>🔒</Text>
                        </View>
                        <Text style={styles.styleEmoji}>{getStyleEmoji(style.id)}</Text>
                        <Text style={[styles.styleLabel, styles.textLocked]}>{style.label}</Text>
                        <Text style={[styles.styleDescription, styles.textLocked]} numberOfLines={2}>
                            {style.description}
                        </Text>
                        <View style={styles.premiumBadge}>
                            <Text style={styles.premiumText}>PRO</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: theme.spacing.md,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: 4,
        paddingHorizontal: theme.spacing.md,
    },
    subtitle: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.md,
        paddingHorizontal: theme.spacing.md,
    },
    scrollContent: {
        paddingHorizontal: theme.spacing.md,
        gap: theme.spacing.sm,
    },
    styleCard: {
        width: 140,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        borderWidth: 2,
        borderColor: 'transparent',
        marginRight: theme.spacing.sm,
        ...theme.shadows.small,
    },
    styleCardSelected: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.primary + '15',
    },
    styleCardLocked: {
        opacity: 0.6,
        position: 'relative',
    },
    lockOverlay: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        zIndex: 1,
    },
    lockIcon: {
        position: 'absolute',
        top: theme.spacing.sm,
        right: theme.spacing.sm,
        fontSize: 16,
    },
    styleEmoji: {
        fontSize: 32,
        marginBottom: theme.spacing.sm,
    },
    styleLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: 4,
    },
    styleDescription: {
        fontSize: 11,
        color: theme.colors.textSecondary,
        lineHeight: 14,
    },
    textLocked: {
        color: theme.colors.textMuted,
    },
    premiumBadge: {
        position: 'absolute',
        bottom: theme.spacing.sm,
        right: theme.spacing.sm,
        backgroundColor: theme.colors.secondary,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    premiumText: {
        fontSize: 8,
        fontWeight: '700',
        color: theme.colors.white,
    },
});

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../styles/theme';
import { SuggestedItem } from '../../services/geminiService';

interface FurnitureCheckboxProps {
    item: SuggestedItem;
    isSelected: boolean;
    onToggle: (itemId: string) => void;
}

export const FurnitureCheckbox: React.FC<FurnitureCheckboxProps> = ({
    item,
    isSelected,
    onToggle,
}) => {
    const getPriorityColor = () => {
        switch (item.priority) {
            case 'high':
                return theme.colors.accent;
            case 'medium':
                return theme.colors.warning;
            case 'low':
                return theme.colors.textMuted;
            default:
                return theme.colors.textSecondary;
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.container,
                isSelected && styles.containerSelected,
            ]}
            onPress={() => onToggle(item.id)}
            activeOpacity={0.7}
        >
            <View style={styles.header}>
                <View style={styles.iconContainer}>
                    <Text style={styles.icon}>{item.icon}</Text>
                </View>

                <View style={styles.info}>
                    <Text style={styles.label}>{item.label}</Text>
                    <Text style={styles.placement}>{item.placement}</Text>
                </View>

                <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                    {isSelected && <Text style={styles.checkmark}>✓</Text>}
                </View>
            </View>

            <Text style={styles.description} numberOfLines={2}>
                {item.description}
            </Text>

            <View style={styles.footer}>
                <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor() + '20' }]}>
                    <Text style={[styles.priorityText, { color: getPriorityColor() }]}>
                        {item.priority.toUpperCase()} PRIORITY
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.sm,
        borderWidth: 2,
        borderColor: 'transparent',
        ...theme.shadows.small,
    },
    containerSelected: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.primary + '10',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.backgroundLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        fontSize: 24,
    },
    info: {
        flex: 1,
        marginLeft: theme.spacing.sm,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: 2,
    },
    placement: {
        fontSize: 12,
        color: theme.colors.textSecondary,
    },
    checkbox: {
        width: 28,
        height: 28,
        borderRadius: theme.borderRadius.sm,
        borderWidth: 2,
        borderColor: theme.colors.border,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    checkboxSelected: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    checkmark: {
        color: theme.colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        lineHeight: 20,
        marginBottom: theme.spacing.sm,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    priorityBadge: {
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 4,
        borderRadius: theme.borderRadius.sm,
    },
    priorityText: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
});

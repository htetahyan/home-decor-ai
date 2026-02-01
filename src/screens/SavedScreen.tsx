import React from 'react';
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
import { theme } from '../styles/theme';

const { width } = Dimensions.get('window');

// Sample saved items
const savedItems = [
    { id: '1', title: 'Modern Living Room', style: 'Modern', date: 'Jan 28, 2026', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400' },
    { id: '2', title: 'Cozy Bedroom', style: 'Scandinavian', date: 'Jan 27, 2026', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400' },
    { id: '3', title: 'Home Office', style: 'Minimalist', date: 'Jan 25, 2026', image: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=400' },
    { id: '4', title: 'Kitchen Redesign', style: 'Industrial', date: 'Jan 24, 2026', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400' },
];

export const SavedScreen: React.FC = () => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Saved Designs</Text>
                <TouchableOpacity style={styles.sortButton}>
                    <Text style={styles.sortIcon}>⚙️</Text>
                </TouchableOpacity>
            </View>

            {/* Stats */}
            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{savedItems.length}</Text>
                    <Text style={styles.statLabel}>Saved</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>2</Text>
                    <Text style={styles.statLabel}>This Week</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>12</Text>
                    <Text style={styles.statLabel}>Total</Text>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Grid of saved items */}
                <View style={styles.grid}>
                    {savedItems.map((item) => (
                        <TouchableOpacity key={item.id} style={styles.savedCard}>
                            <Image
                                source={{ uri: item.image }}
                                style={styles.savedImage}
                                resizeMode="cover"
                            />
                            <View style={styles.savedOverlay}>
                                <TouchableOpacity style={styles.heartButton}>
                                    <Text style={styles.heartIcon}>❤️</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.savedInfo}>
                                <Text style={styles.savedTitle} numberOfLines={1}>{item.title}</Text>
                                <View style={styles.savedMeta}>
                                    <Text style={styles.savedStyle}>{item.style}</Text>
                                    <Text style={styles.savedDate}>{item.date}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {savedItems.length === 0 && (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>📁</Text>
                        <Text style={styles.emptyTitle}>No Saved Designs</Text>
                        <Text style={styles.emptyText}>
                            Your saved redesigns will appear here.{'\n'}Start by uploading a room photo!
                        </Text>
                    </View>
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: theme.colors.text,
    },
    sortButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sortIcon: {
        fontSize: 18,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.lg,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.lg,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: '700',
        color: theme.colors.text,
    },
    statLabel: {
        fontSize: 12,
        color: theme.colors.textMuted,
        marginTop: 4,
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: theme.colors.border,
    },
    scrollContent: {
        paddingHorizontal: theme.spacing.lg,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.md,
    },
    savedCard: {
        width: (width - 48 - 16) / 2,
        borderRadius: theme.borderRadius.lg,
        backgroundColor: theme.colors.white,
        overflow: 'hidden',
        ...theme.shadows.small,
    },
    savedImage: {
        width: '100%',
        height: 140,
        backgroundColor: theme.colors.surface,
    },
    savedOverlay: {
        position: 'absolute',
        top: 0,
        right: 0,
        padding: theme.spacing.sm,
    },
    heartButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    heartIcon: {
        fontSize: 14,
    },
    savedInfo: {
        padding: theme.spacing.sm,
    },
    savedTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: 4,
    },
    savedMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    savedStyle: {
        fontSize: 11,
        color: theme.colors.primary,
        fontWeight: '500',
    },
    savedDate: {
        fontSize: 10,
        color: theme.colors.textMuted,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 80,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: theme.spacing.md,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
    },
    emptyText: {
        fontSize: 14,
        color: theme.colors.textMuted,
        textAlign: 'center',
        lineHeight: 20,
    },
});

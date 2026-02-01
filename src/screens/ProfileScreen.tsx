import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { theme } from '../styles/theme';
import { useAppStore } from '../store/appStore';

const { width } = Dimensions.get('window');

interface RedesignItem {
    id: string;
    image: string;
    title: string;
}

interface AestheticTag {
    id: string;
    label: string;
}

export const ProfileScreen: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { isPremium } = useAppStore();

    const userData = {
        name: 'Alex Johnson',
        memberSince: '2023',
        redesignsCount: 24,
        stylesSaved: 156,
        subscription: isPremium ? 'Pro Plan Active' : 'Free Plan',
        nextBillingDate: 'Nov 24, 2024',
    };

    const myRedesigns: RedesignItem[] = [
        { id: '1', image: '', title: 'Modern Living Room' },
        { id: '2', image: '', title: 'Boho Bedroom' },
    ];

    const myAesthetics: AestheticTag[] = [
        { id: '1', label: '#Boho' },
        { id: '2', label: '#Modern' },
        { id: '3', label: '#Minimalist' },
        { id: '4', label: '#Industrial' },
        { id: '5', label: '#Biophilic' },
    ];

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Profile</Text>
                    <TouchableOpacity
                        style={styles.settingsButton}
                        onPress={() => navigation.navigate('Settings')}
                    >
                        <Ionicons name="settings-outline" size={24} color="#1F2937" />
                    </TouchableOpacity>
                </View>

                {/* Profile Avatar */}
                <View style={styles.avatarContainer}>
                    <View style={styles.avatarWrapper}>
                        <View style={styles.avatar}>
                            <Ionicons name="person" size={50} color="#9CA3AF" />
                        </View>
                        <TouchableOpacity style={styles.editAvatarButton}>
                            <Ionicons name="pencil" size={12} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* User Name */}
                <Text style={styles.userName}>{userData.name}</Text>

                {/* Premium Badge */}
                {isPremium && (
                    <View style={styles.premiumBadge}>
                        <Ionicons name="diamond" size={14} color="#fff" />
                        <Text style={styles.premiumBadgeText}>PREMIUM MEMBER</Text>
                    </View>
                )}

                {/* Member Since */}
                <Text style={styles.memberSince}>Member since {userData.memberSince}</Text>

                {/* Stats */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{userData.redesignsCount}</Text>
                        <Text style={styles.statLabel}>Redesigns</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{userData.stylesSaved}</Text>
                        <Text style={styles.statLabel}>Styles Saved</Text>
                    </View>
                </View>

                {/* My Room Redesigns */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>My Room Redesigns</Text>
                        <TouchableOpacity>
                            <Text style={styles.viewAllText}>View All</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.redesignsGrid}>
                        {myRedesigns.map((item) => (
                            <TouchableOpacity key={item.id} style={styles.redesignCard}>
                                <View style={styles.redesignImage}>
                                    <Ionicons name="image" size={40} color="#D1D5DB" />
                                </View>
                                <Text style={styles.redesignTitle}>{item.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* My Aesthetics */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>My Aesthetics</Text>
                        <TouchableOpacity>
                            <Ionicons name="pencil" size={18} color={theme.colors.primary} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.tagsContainer}>
                        {myAesthetics.map((tag) => (
                            <View key={tag.id} style={styles.tag}>
                                <Text style={styles.tagText}>{tag.label}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Subscription */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Subscription</Text>
                    <View style={styles.subscriptionCard}>
                        <View style={styles.subscriptionIcon}>
                            <Ionicons name="shield-checkmark" size={24} color={theme.colors.primary} />
                        </View>
                        <View style={styles.subscriptionInfo}>
                            <Text style={styles.subscriptionPlan}>{userData.subscription}</Text>
                            {isPremium && (
                                <Text style={styles.subscriptionDate}>
                                    Next billing date: {userData.nextBillingDate}
                                </Text>
                            )}
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('Premium')}>
                            <Text style={styles.manageText}>Manage</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.bottomPadding} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 60,
        paddingBottom: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    settingsButton: {
        position: 'absolute',
        right: 16,
        top: 60,
    },
    avatarContainer: {
        alignItems: 'center',
        marginTop: 8,
    },
    avatarWrapper: {
        position: 'relative',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: theme.colors.primary,
    },
    editAvatarButton: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    userName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1F2937',
        textAlign: 'center',
        marginTop: 16,
    },
    premiumBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        alignSelf: 'center',
        marginTop: 8,
        gap: 6,
    },
    premiumBadgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#fff',
    },
    memberSince: {
        fontSize: 14,
        color: '#9CA3AF',
        textAlign: 'center',
        marginTop: 8,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
        marginHorizontal: 40,
        backgroundColor: '#F8FAFB',
        borderRadius: 16,
        paddingVertical: 20,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1F2937',
    },
    statLabel: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: '#E5E7EB',
    },
    section: {
        paddingHorizontal: 16,
        marginTop: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    viewAllText: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.primary,
    },
    redesignsGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    redesignCard: {
        flex: 1,
    },
    redesignImage: {
        height: 120,
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    redesignTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1F2937',
        marginTop: 8,
        textAlign: 'center',
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tag: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
    },
    tagText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1F2937',
    },
    subscriptionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFB',
        borderRadius: 16,
        padding: 16,
        marginTop: 12,
    },
    subscriptionIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#E8F8EE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    subscriptionInfo: {
        flex: 1,
        marginLeft: 12,
    },
    subscriptionPlan: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    subscriptionDate: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    manageText: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.primary,
    },
    bottomPadding: {
        height: 100,
    },
});

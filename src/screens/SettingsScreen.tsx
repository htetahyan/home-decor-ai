import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Switch,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../styles/theme';
import { useAppStore } from '../store/appStore';

interface SettingItem {
    id: string;
    icon: keyof typeof Ionicons.glyphMap;
    iconBgColor: string;
    label: string;
    value?: string;
    hasToggle?: boolean;
    toggleValue?: boolean;
    onToggle?: (value: boolean) => void;
    onPress?: () => void;
}

export const SettingsScreen: React.FC = () => {
    const navigation = useNavigation();
    const { isPremium } = useAppStore();
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);

    const handleLogout = () => {
        Alert.alert(
            'Log Out',
            'Are you sure you want to log out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Log Out',
                    style: 'destructive',
                    onPress: () => {
                        // Handle logout logic
                        console.log('Logging out...');
                    }
                },
            ]
        );
    };

    const accountSettings: SettingItem[] = [
        {
            id: 'edit_profile',
            icon: 'person',
            iconBgColor: '#E8F8EE',
            label: 'Edit Profile',
            onPress: () => console.log('Edit Profile'),
        },
        {
            id: 'subscription',
            icon: 'star',
            iconBgColor: '#E8F8EE',
            label: 'Subscription Plan',
            value: isPremium ? 'Premium' : 'Free',
            onPress: () => navigation.navigate('Premium' as never),
        },
    ];

    const preferenceSettings: SettingItem[] = [
        {
            id: 'notifications',
            icon: 'notifications',
            iconBgColor: '#E8F8EE',
            label: 'Notifications',
            onPress: () => console.log('Notifications'),
        },
        {
            id: 'dark_mode',
            icon: 'moon',
            iconBgColor: '#E8EEF8',
            label: 'Dark Mode',
            hasToggle: true,
            toggleValue: darkMode,
            onToggle: setDarkMode,
        },
    ];

    const aboutSettings: SettingItem[] = [
        {
            id: 'privacy',
            icon: 'lock-closed',
            iconBgColor: '#E8F8EE',
            label: 'Privacy Policy',
            onPress: () => console.log('Privacy Policy'),
        },
        {
            id: 'terms',
            icon: 'document-text',
            iconBgColor: '#FFF3E8',
            label: 'Terms of Service',
            onPress: () => console.log('Terms of Service'),
        },
    ];

    const renderSettingItem = (item: SettingItem, isLast: boolean) => (
        <TouchableOpacity
            key={item.id}
            style={[styles.settingItem, !isLast && styles.settingItemBorder]}
            onPress={item.onPress}
            disabled={item.hasToggle}
        >
            <View style={[styles.iconContainer, { backgroundColor: item.iconBgColor }]}>
                <Ionicons name={item.icon} size={20} color={theme.colors.primary} />
            </View>
            <Text style={styles.settingLabel}>{item.label}</Text>
            <View style={styles.settingRight}>
                {item.value && (
                    <Text style={styles.settingValue}>{item.value}</Text>
                )}
                {item.hasToggle ? (
                    <Switch
                        value={item.toggleValue}
                        onValueChange={item.onToggle}
                        trackColor={{ false: '#E5E7EB', true: theme.colors.primaryLight }}
                        thumbColor={item.toggleValue ? theme.colors.primary : '#fff'}
                    />
                ) : (
                    <Ionicons name="chevron-forward" size={20} color="#C4C4C4" />
                )}
            </View>
        </TouchableOpacity>
    );

    const renderSection = (title: string, items: SettingItem[]) => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.sectionCard}>
                {items.map((item, index) => renderSettingItem(item, index === items.length - 1))}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {renderSection('ACCOUNT', accountSettings)}
                {renderSection('PREFERENCES', preferenceSettings)}
                {renderSection('ABOUT & LEGAL', aboutSettings)}

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                {/* Version */}
                <Text style={styles.versionText}>Version 1.0.2</Text>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFB',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 60,
        paddingBottom: 16,
        backgroundColor: '#fff',
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    headerRight: {
        width: 40,
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 24,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B7280',
        marginBottom: 12,
        letterSpacing: 0.5,
    },
    sectionCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    settingItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    settingLabel: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        color: '#1F2937',
    },
    settingRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    settingValue: {
        fontSize: 14,
        color: '#9CA3AF',
    },
    logoutButton: {
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#EF4444',
    },
    versionText: {
        textAlign: 'center',
        fontSize: 14,
        color: '#9CA3AF',
        marginTop: 24,
        marginBottom: 40,
    },
});

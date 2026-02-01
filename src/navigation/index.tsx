import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList, MainTabParamList } from './types';
import { theme } from '../styles/theme';

// Screens
import { HomeScreen } from '../screens/HomeScreen';
import { SavedScreen } from '../screens/SavedScreen';
import { StylesScreen } from '../screens/StylesScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { AIAnalysisScreen } from '../screens/AIAnalysisScreen';
import { RedesignPreviewScreen } from '../screens/RedesignPreviewScreen';
import { PremiumScreen } from '../screens/PremiumScreen';
import { CameraScreen } from '../screens/CameraScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { SignInScreen } from '../screens/SignInScreen';
import { SignUpScreen } from '../screens/SignUpScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Tab Icons Component using Ionicons
const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => {
    const icons: Record<string, string> = {
        Home: 'home',
        Explore: 'search',
        Create: 'add',
        Saved: 'heart',
        Profile: 'person',
    };

    const iconName = focused ? icons[name] : `${icons[name]}-outline`;

    return (
        <Ionicons
            name={iconName as any}
            size={24}
            color={focused ? theme.colors.primary : theme.colors.textMuted}
        />
    );
};

// Create Button (center tab)
const CreateButton = ({ onPress }: { onPress: () => void }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.createButtonContainer}>
            <View style={styles.createButton}>
                <Ionicons name="add" size={28} color="#fff" />
            </View>
        </TouchableOpacity>
    );
};

// Main Tab Navigator
function MainTabNavigator() {
    const insets = useSafeAreaInsets();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    height: 70 + insets.bottom,
                    paddingTop: 10,
                    paddingBottom: insets.bottom + 10,
                    backgroundColor: theme.colors.white,
                    borderTopWidth: 1,
                    borderTopColor: theme.colors.border,
                },
                tabBarShowLabel: true,
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '500',
                    marginTop: 4,
                },
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.textMuted,
                tabBarIcon: ({ focused }) => (
                    <TabIcon name={route.name} focused={focused} />
                ),
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{ tabBarLabel: 'Home' }}
            />
            <Tab.Screen
                name="Explore"
                component={StylesScreen}
                options={{ tabBarLabel: 'Explore' }}
            />
            <Tab.Screen
                name="Create"
                component={HomeScreen}
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        e.preventDefault();
                        // Navigate to Camera screen using the parent navigator
                        navigation.getParent()?.navigate('Camera');
                    },
                })}
                options={{
                    tabBarLabel: '',
                    tabBarButton: (props) => (
                        <CreateButton onPress={props.onPress as () => void} />
                    ),
                }}
            />
            <Tab.Screen
                name="Saved"
                component={SavedScreen}
                options={{ tabBarLabel: 'Saved' }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ tabBarLabel: 'Profile' }}
            />
        </Tab.Navigator>
    );
}

// Root Stack Navigator
export function AppNavigator() {
    const { isSignedIn, isLoaded } = useAuth();
    const insets = useSafeAreaInsets();

    if (!isLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: theme.colors.background },
                }}
            >
                {isSignedIn ? (
                    // Authenticated Stack
                    <>
                        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
                        <Stack.Screen
                            name="Camera"
                            component={CameraScreen}
                            options={{
                                animation: 'slide_from_bottom',
                                presentation: 'fullScreenModal',
                            }}
                        />
                        <Stack.Screen
                            name="AIAnalysis"
                            component={AIAnalysisScreen}
                            options={{
                                animation: 'slide_from_right',
                            }}
                        />
                        <Stack.Screen
                            name="RedesignPreview"
                            component={RedesignPreviewScreen}
                            options={{
                                animation: 'slide_from_right',
                            }}
                        />
                        <Stack.Screen
                            name="Premium"
                            component={PremiumScreen}
                            options={{
                                animation: 'slide_from_bottom',
                                presentation: 'modal',
                            }}
                        />
                        <Stack.Screen
                            name="Settings"
                            component={SettingsScreen}
                            options={{
                                animation: 'slide_from_right',
                            }}
                        />
                    </>
                ) : (
                    // Non-Authenticated Stack
                    <>
                        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                        <Stack.Screen name="SignUp" component={SignUpScreen} />
                        <Stack.Screen name="SignIn" component={SignInScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    createButtonContainer: {
        top: -20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    createButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
        ...theme.shadows.large,
    },
});

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { toast } from 'sonner-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { theme } from '../styles/theme';
import { generateGuestUsername, upsertUser } from '../database';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export const SignUpScreen = () => {
    const { isLoaded, signUp, setActive } = useSignUp();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [pendingVerification, setPendingVerification] = useState(false);
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const onSignUpPress = async () => {
        if (!isLoaded || !emailAddress || !password) {
            toast.error('Please fill in all fields');
            return;
        }

        setIsLoading(true);
        try {
            await signUp.create({
                emailAddress,
                password,
            });

            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
            setPendingVerification(true);
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2));
            const errorMessage = err.errors?.[0]?.message || 'Sign up failed';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const onPressVerify = async () => {
        if (!isLoaded || !code) {
            toast.error('Please enter the verification code');
            return;
        }

        setIsLoading(true);
        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            });

            if (completeSignUp.status === 'complete') {
                await setActive({ session: completeSignUp.createdSessionId });

                // Sync user to Supabase with auto-generated username
                const generatedUsername = generateGuestUsername();
                const clerkUserId = completeSignUp.createdUserId;
                if (clerkUserId) {
                    await upsertUser({
                        clerk_id: clerkUserId,
                        username: generatedUsername,
                        email: emailAddress,
                    });
                }
                // Navigation is automatic via auth state
            } else {
                console.error(JSON.stringify(completeSignUp, null, 2));
                toast.error('Verification incomplete. Please try again.');
            }
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2));
            const errorMessage = err.errors?.[0]?.message || 'Verification failed';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Verification screen
    if (pendingVerification) {
        return (
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                    <View style={styles.header}>
                        <Text style={styles.title}>Verify Email</Text>
                        <Text style={styles.subtitle}>Enter the 6-digit code sent to {emailAddress}</Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Verification Code</Text>
                            <TextInput
                                value={code}
                                placeholder="Enter 6-digit code"
                                placeholderTextColor={theme.colors.textMuted}
                                onChangeText={setCode}
                                keyboardType="number-pad"
                                style={styles.input}
                                maxLength={6}
                            />
                        </View>

                        <TouchableOpacity
                            onPress={onPressVerify}
                            disabled={isLoading || code.length < 6}
                            style={[styles.buttonContainer, code.length < 6 && styles.buttonDisabled]}
                            activeOpacity={0.7}
                        >
                            <LinearGradient
                                colors={[theme.colors.primary, '#16A34A']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.gradient}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="#fff" size="small" />
                                ) : (
                                    <Text style={styles.buttonText}>Verify Email</Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setPendingVerification(false)}
                            style={styles.backLink}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.linkText}>← Back to Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }

    // Sign up form
    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Sign up to start redesigning your space</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            autoCapitalize="none"
                            value={emailAddress}
                            placeholder="Enter your email"
                            placeholderTextColor={theme.colors.textMuted}
                            onChangeText={setEmailAddress}
                            style={styles.input}
                            keyboardType="email-address"
                            autoComplete="email"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Password</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                value={password}
                                placeholder="Create a password"
                                placeholderTextColor={theme.colors.textMuted}
                                secureTextEntry={!showPassword}
                                onChangeText={setPassword}
                                style={[styles.input, styles.passwordInput]}
                                autoComplete="new-password"
                            />
                            <TouchableOpacity
                                style={styles.eyeButton}
                                onPress={() => setShowPassword(!showPassword)}
                                activeOpacity={0.7}
                            >
                                <Ionicons
                                    name={showPassword ? "eye-off" : "eye"}
                                    size={20}
                                    color={theme.colors.textMuted}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={onSignUpPress}
                        disabled={isLoading || !emailAddress || !password}
                        style={[styles.buttonContainer, (!emailAddress || !password) && styles.buttonDisabled]}
                        activeOpacity={0.7}
                    >
                        <LinearGradient
                            colors={[theme.colors.primary, '#16A34A']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.gradient}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" size="small" />
                            ) : (
                                <Text style={styles.buttonText}>Sign Up</Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('SignIn')} activeOpacity={0.7}>
                            <Text style={styles.linkText}> Log In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        flexGrow: 1,
        padding: 24,
    },
    header: {
        marginTop: 40,
        marginBottom: 40,
    },
    backButton: {
        marginBottom: 20,
        padding: 8,
        marginLeft: -8,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: theme.colors.textMuted,
    },
    form: {
        gap: 20,
    },
    inputContainer: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        color: theme.colors.text,
        backgroundColor: '#fff',
    },
    passwordContainer: {
        position: 'relative',
    },
    passwordInput: {
        paddingRight: 50,
    },
    eyeButton: {
        position: 'absolute',
        right: 16,
        top: 15,
    },
    buttonContainer: {
        marginTop: 10,
        borderRadius: 12,
        overflow: 'hidden',
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    gradient: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    footerText: {
        color: theme.colors.textMuted,
        fontSize: 14,
    },
    linkText: {
        color: theme.colors.primary,
        fontWeight: 'bold',
        fontSize: 14,
    },
    backLink: {
        alignItems: 'center',
        marginTop: 10,
    },
});

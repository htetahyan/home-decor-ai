import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../styles/theme';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
    style?: ViewStyle;
    textStyle?: TextStyle;
    gradient?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    icon,
    style,
    textStyle,
    gradient = true,
}) => {
    const isDisabled = disabled || loading;

    const getSizeStyles = (): ViewStyle => {
        switch (size) {
            case 'small':
                return { paddingVertical: 8, paddingHorizontal: 16 };
            case 'large':
                return { paddingVertical: 18, paddingHorizontal: 32 };
            default:
                return { paddingVertical: 14, paddingHorizontal: 24 };
        }
    };

    const getTextSize = (): TextStyle => {
        switch (size) {
            case 'small':
                return { fontSize: 14 };
            case 'large':
                return { fontSize: 18 };
            default:
                return { fontSize: 16 };
        }
    };

    const getVariantStyles = (): ViewStyle => {
        switch (variant) {
            case 'secondary':
                return { backgroundColor: theme.colors.secondary };
            case 'outline':
                return {
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderColor: theme.colors.primary,
                };
            case 'ghost':
                return { backgroundColor: 'transparent' };
            default:
                return { backgroundColor: theme.colors.primary };
        }
    };

    const getTextColor = (): string => {
        switch (variant) {
            case 'outline':
                return theme.colors.primary;
            case 'ghost':
                return theme.colors.primary;
            default:
                return theme.colors.white;
        }
    };

    const buttonStyles: ViewStyle[] = [
        styles.button,
        getSizeStyles(),
        !gradient && getVariantStyles(),
        isDisabled && styles.disabled,
        style,
    ].filter(Boolean) as ViewStyle[];

    const content = (
        <>
            {loading ? (
                <ActivityIndicator color={getTextColor()} size="small" />
            ) : (
                <>
                    {icon && <>{icon}</>}
                    <Text
                        style={[
                            styles.text,
                            getTextSize(),
                            { color: getTextColor() },
                            icon ? styles.textWithIcon : undefined,
                            textStyle,
                        ].filter(Boolean)}
                    >
                        {title}
                    </Text>
                </>
            )}
        </>
    );

    if (gradient && (variant === 'primary' || variant === 'secondary')) {
        const gradientColors = variant === 'primary'
            ? theme.colors.gradientPrimary
            : theme.colors.gradientSecondary;

        return (
            <TouchableOpacity
                onPress={onPress}
                disabled={isDisabled}
                activeOpacity={0.8}
                style={[isDisabled && styles.disabled]}
            >
                <LinearGradient
                    colors={gradientColors as any}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.button, getSizeStyles(), style]}
                >
                    {content}
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.8}
            style={buttonStyles}
        >
            {content}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: theme.borderRadius.lg,
        ...theme.shadows.medium,
    },
    text: {
        fontWeight: '600',
        textAlign: 'center',
    },
    textWithIcon: {
        marginLeft: 8,
    },
    disabled: {
        opacity: 0.5,
    },
});

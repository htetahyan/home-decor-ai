// Light Theme configuration matching design mockups
export const theme = {
    colors: {
        // Primary palette - Green accent
        primary: '#22C55E',
        primaryLight: '#4ADE80',
        primaryDark: '#16A34A',

        // Secondary palette
        secondary: '#6366F1',
        secondaryLight: '#818CF8',
        secondaryDark: '#4F46E5',

        // Accent colors
        accent: '#22C55E',
        accentLight: '#86EFAC',
        accentDark: '#15803D',

        // Background colors (light theme)
        background: '#FFFFFF',
        backgroundLight: '#F9FAFB',
        backgroundCard: '#FFFFFF',
        surface: '#F3F4F6',
        surfaceLight: '#F9FAFB',

        // Text colors
        text: '#111827',
        textSecondary: '#6B7280',
        textMuted: '#9CA3AF',
        textLight: '#D1D5DB',

        // Status colors
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',

        // Premium colors
        premiumGold: '#F59E0B',
        premiumText: '#22C55E',

        // Gradients
        gradientPrimary: ['#22C55E', '#16A34A'] as [string, string],
        gradientSecondary: ['#6366F1', '#8B5CF6'] as [string, string],
        gradientPremium: ['#22C55E', '#10B981'] as [string, string],

        // Other
        border: '#E5E7EB',
        borderLight: '#F3F4F6',
        divider: '#E5E7EB',
        overlay: 'rgba(0, 0, 0, 0.5)',
        white: '#FFFFFF',
        black: '#000000',

        // Toggle switch colors
        toggleActive: '#22C55E',
        toggleInactive: '#E5E7EB',
        toggleGradient: ['#22C55E', '#FCD34D'] as [string, string],
    },

    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
    },

    borderRadius: {
        xs: 4,
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24,
        xxl: 32,
        full: 9999,
    },

    typography: {
        h1: {
            fontSize: 28,
            fontWeight: '700' as const,
            lineHeight: 36,
        },
        h2: {
            fontSize: 22,
            fontWeight: '600' as const,
            lineHeight: 28,
        },
        h3: {
            fontSize: 18,
            fontWeight: '600' as const,
            lineHeight: 24,
        },
        body: {
            fontSize: 16,
            fontWeight: '400' as const,
            lineHeight: 24,
        },
        bodySmall: {
            fontSize: 14,
            fontWeight: '400' as const,
            lineHeight: 20,
        },
        caption: {
            fontSize: 12,
            fontWeight: '400' as const,
            lineHeight: 16,
        },
        button: {
            fontSize: 16,
            fontWeight: '600' as const,
            lineHeight: 24,
        },
        label: {
            fontSize: 11,
            fontWeight: '600' as const,
            lineHeight: 14,
            letterSpacing: 0.5,
        },
    },

    shadows: {
        small: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
        },
        medium: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3,
        },
        large: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.12,
            shadowRadius: 16,
            elevation: 6,
        },
    },
};

export type Theme = typeof theme;

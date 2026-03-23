export const COLORS = {
    primary: '#10B981',
    primaryDark: '#065F46',
    primaryLight: '#34D399',
    primaryGlow: 'rgba(16, 185, 129, 0.15)',

    secondary: '#0EA5E9',
    secondaryDark: '#0369A1',

    accent: '#F59E0B',
    accentLight: '#FCD34D',

    background: '#0F172A',
    backgroundLight: '#1E293B',
    backgroundCard: '#1E293B',
    surface: '#334155',
    surfaceLight: '#475569',

    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',

    white: '#FFFFFF',
    black: '#000000',

    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',

    border: 'rgba(148, 163, 184, 0.15)',
    overlay: 'rgba(15, 23, 42, 0.8)',
    glassBg: 'rgba(30, 41, 59, 0.85)',
    glassStroke: 'rgba(148, 163, 184, 0.1)',
};

export const GRADIENTS = {
    primary: ['#10B981', '#059669', '#047857'],
    hero: ['#0F172A', '#1E293B', '#0F172A'],
    card: ['rgba(30, 41, 59, 0.9)', 'rgba(15, 23, 42, 0.95)'],
    accent: ['#F59E0B', '#D97706'],
    blue: ['#3B82F6', '#2563EB'],
    green: ['#10B981', '#059669'],
};

export const FONTS = {
    light: 'System',
    regular: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
};

export const SIZES = {
    // Global sizes
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,

    // Font sizes
    fontXs: 10,
    fontSm: 12,
    fontMd: 14,
    fontLg: 16,
    fontXl: 20,
    fontXxl: 24,
    fontTitle: 28,
    fontHero: 36,

    // Border radius
    radiusSm: 8,
    radiusMd: 12,
    radiusLg: 16,
    radiusXl: 24,
    radiusFull: 999,

    // Icon sizes
    iconSm: 16,
    iconMd: 20,
    iconLg: 24,
    iconXl: 32,
};

export const SHADOWS = {
    small: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    large: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    glow: {
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
};

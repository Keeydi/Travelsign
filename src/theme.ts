export type ThemeShape = {
  colors: {
    primary: string;
    primaryDark: string;
    primaryLight: string;
    background: string;
    backgroundLight: string;
    card: string;
    cardLight: string;
    textPrimary: string;
    textSecondary: string;
    accent: string;
    accentLight: string;
    danger: string;
    border: string;
    muted: string;
    gradient: { start: string; end: string };
  };
  shapes: { cardRadius: number; buttonRadius: number; inputRadius: number; logoRadius: number };
  spacing: { xs: number; sm: number; md: number; lg: number; xl: number; xxl: number };
  typography: { regular: string; medium: string; semibold: string; bold: string };
  shadow: {
    card: object;
    button: object;
    logo: object;
  };
};

export const lightTheme: ThemeShape = {
  colors: {
    primary: '#2563EB',
    primaryDark: '#1D4ED8',
    primaryLight: '#3B82F6',
    background: '#FFFFFF',
    backgroundLight: '#F8FAFC',
    card: '#FFFFFF',
    cardLight: '#F1F5F9',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    accent: '#0EA5E9',
    accentLight: '#38BDF8',
    danger: '#EF4444',
    border: '#E2E8F0',
    muted: '#CBD5E1',
    gradient: { start: '#2563EB', end: '#3B82F6' },
  },
  shapes: { cardRadius: 24, buttonRadius: 16, inputRadius: 16, logoRadius: 32 },
  spacing: { xs: 6, sm: 10, md: 16, lg: 24, xl: 32, xxl: 48 },
  typography: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
  },
  shadow: {
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
    },
    button: {
      shadowColor: '#2563EB',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    logo: {
      shadowColor: '#2563EB',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 3,
    },
  },
};

export const darkTheme: ThemeShape = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    background: '#0F172A',
    backgroundLight: '#1E293B',
    card: '#1E293B',
    cardLight: '#334155',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    border: '#334155',
    muted: '#64748B',
  },
  shadow: {
    ...lightTheme.shadow,
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 4,
    },
  },
};

/** Default export for backward compatibility; use useTheme() when theme can change (e.g. dark mode). */
export const theme = lightTheme;



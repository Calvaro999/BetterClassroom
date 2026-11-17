export const maroonPalette = {
  primary: '#9F1239',       // Granate principal elegante
  primaryDark: '#881337',   // Granate oscuro
  primaryLight: '#FFE4E6',  // Granate sutil para selección
  primaryAccent: '#BE123C', // Granate vivo
};

export interface AppThemeColors {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  primaryAccent: string;
  mode: 'light' | 'dark';
  background: string;
  surface: string;
  surfaceCard: string;
  surfaceVariant: string;
  border: string;
  borderDark: string;
  text: string;
  textMuted: string;
  textLight: string;
  white: string;
  danger: string;
  dangerLight: string;
  success: string;
  successLight: string;
  deskBg: string;
  deskBorder: string;
  deskChair: string;
}

export const lightColors: AppThemeColors = {
  ...maroonPalette,
  mode: 'light',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceCard: '#FFFFFF',
  surfaceVariant: '#F1F5F9',
  border: '#E2E8F0',
  borderDark: '#CBD5E1',
  text: '#0F172A',
  textMuted: '#64748B',
  textLight: '#94A3B8',
  white: '#FFFFFF',
  danger: '#E11D48',
  dangerLight: '#FFE4E6',
  success: '#059669',
  successLight: '#D1FAE5',
  deskBg: '#F8FAFC',
  deskBorder: '#E2E8F0',
  deskChair: '#94A3B8',
};

export const darkColors: AppThemeColors = {
  ...maroonPalette,
  mode: 'dark',
  background: '#0B0F19',
  surface: '#111827',
  surfaceCard: '#1F2937',
  surfaceVariant: '#1E293B',
  border: '#374151',
  borderDark: '#4B5563',
  text: '#F8FAFC',
  textMuted: '#94A3B8',
  textLight: '#64748B',
  white: '#FFFFFF',
  danger: '#FB7185',
  dangerLight: '#881337',
  success: '#34D399',
  successLight: '#064E3B',
  deskBg: '#1E293B',
  deskBorder: '#374151',
  deskChair: '#475569',
};

export const theme = {
  colors: lightColors,
  borderRadius: {
    sm: 6,
    md: 10,
    lg: 16,
    full: 9999,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
};

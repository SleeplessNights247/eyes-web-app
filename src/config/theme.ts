export const theme = {
  dark: {
    background: '#0D0D0D',
    surface: '#1A1A1A',
    textPrimary: '#FFFFFF',
    textSecondary: '#B0BEC5',
    textTertiary: '#666666',
    divider: '#222222',
    inactive: '#333333',
  },
  light: {
    background: '#F5F7FA',
    surface: '#FFFFFF',
    textPrimary: '#1A1A1A',
    textSecondary: '#5F6368',
    textTertiary: '#9AA0A6',
    divider: '#E0E0E0',
    inactive: '#DADCE0',
  },
  accent: '#2196F3',
  danger: '#E53935',
  warning: '#FFA726',
  success: '#43A047',
} as const;

export type ThemeMode = 'light' | 'dark' | 'system';

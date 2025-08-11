// theme.js
// A simple object to define the application's theme, including colors, typography, and spacing.

const theme = {
  colors: {
    primary: '#4f46e5', // A deep indigo
    secondary: '#10b981', // A bright teal
    accent: '#f43f5e', // A rose color
    background: '#f9fafb', // Light gray background
    surface: '#ffffff', // White surface for cards and containers
    text: {
      primary: '#1f2937', // Dark gray for main text
      secondary: '#6b7280', // Medium gray for secondary text
      muted: '#9ca3af', // Light gray for muted text
    },
    border: '#e5e7eb', // Light gray for borders
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h1: {
      fontSize: '2.25rem', // 36px
      fontWeight: '700', // bold
    },
    h2: {
      fontSize: '1.5rem', // 24px
      fontWeight: '600', // semi-bold
    },
    body: {
      fontSize: '1rem', // 16px
      fontWeight: '400', // regular
    },
  },
  spacing: {
    xs: '0.25rem', // 4px
    sm: '0.5rem', // 8px
    md: '1rem', // 16px
    lg: '1.5rem', // 24px
    xl: '2rem', // 32px
  },
  borderRadius: {
    sm: '0.25rem', // 4px
    md: '0.5rem', // 8px
    lg: '0.75rem', // 12px
    xl: '1rem', // 16px
  },
};

export default theme;

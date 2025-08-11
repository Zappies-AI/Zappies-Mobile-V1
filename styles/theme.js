// ./styles/theme.js
// Centralized theme file for the app's colors and styling.

export const Spacing = {
  small: 8,
  medium: 16,
  large: 24,
  xlarge: 32,
};

export const Typography = {
  header: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: 20,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
};

export const Themes = {
  light: {
    primary: '#FF8C00', // A warm orange
    secondary: '#FFB84D', // A lighter orange for highlights
    background: '#FDF4E3', // A very light cream/off-white background
    card: '#FFFFFF', // White for cards and containers
    text: '#3E2723', // Dark brown for body text
    subtext: '#8D6E63', // Lighter brown for secondary text
    accent: '#FFD700', // A nice gold for accent colors
    error: '#B71C1C', // A deep red for error messages
    border: '#D7CCC8', // Light brown for borders
    modeToggleIcon: 'moon-outline',
  },
  dark: {
    primary: '#FF8C00', // A warm orange
    secondary: '#FFB84D', // A lighter orange for highlights
    background: '#1C1C1E', // A dark gray background
    card: '#2C2C2E', // A slightly lighter dark gray for cards
    text: '#EFEFEF', // Off-white for body text
    subtext: '#AEAEB2', // Light gray for secondary text
    accent: '#FFD700', // A nice gold for accent colors
    error: '#CF6679', // A soft red for error messages
    border: '#48484A', // Dark gray for borders
    modeToggleIcon: 'sunny-outline',
  },
};


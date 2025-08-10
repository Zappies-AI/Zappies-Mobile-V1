// Centralized theme file for the app's colors and styling.

export const Colors = {
  primary: '#007AFF', // A vibrant blue for buttons and accents
  secondary: '#5AC8FA', // A lighter blue for highlights
  background: '#F0F4F8', // A very light gray background
  card: '#FFFFFF', // White for cards and containers
  text: '#1C1C1C', // Dark gray for body text
  subtext: '#8E8E93', // Lighter gray for secondary text
  accent: '#FFD700', // A nice gold for accent colors
  error: '#FF3B30', // A red for error messages
  border: '#E0E0E0', // Light gray for borders
};

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
    color: Colors.text,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
  },
  body: {
    fontSize: 16,
    color: Colors.text,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.subtext,
  },
};
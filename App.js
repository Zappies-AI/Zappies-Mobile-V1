// This is the main entry point of the app.

import 'react-native-gesture-handler'; // Required for React Navigation.
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStackScreens from './navigation/AuthStack';
import AppTabsScreens from './navigation/AppTabs';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Main App component that decides which navigation stack to show.
function App() {
  const { session, loading } = useContext(AuthContext);

  if (loading) {
    // Show nothing while the session is being checked. The splash screen is visible.
    return null;
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      {/* Conditionally render the auth or main app navigator. */}
      {session ? <AppTabsScreens /> : <AuthStackScreens />}
    </NavigationContainer>
  );
}

// Export the AuthProvider and ThemeProvider wrapper as the default component.
export default function AppWrapper() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  );
}

//App.js
// This is the main entry point of the app.

import 'react-native-gesture-handler'; // Required for React Navigation.
import React, { useState, useEffect, createContext, useContext } from 'react';
import { View, ActivityIndicator, StyleSheet, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AuthStackScreens from './navigation/AuthStack';
import AppTabsScreens from './navigation/AppTabs';
import { supabase } from './supabase/client';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

// Prevent the "Setting a timer..." warning in Expo.
LogBox.ignoreAllLogs();

// Context to share the user's authentication session across the app.
const AuthContext = createContext();

// Auth provider component to manage the user session.
const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      // Get the initial user session from Supabase.
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
      // Hide the splash screen after the session check is complete.
      await SplashScreen.hideAsync();
    };

    // Keep the splash screen visible until the session is checked.
    SplashScreen.preventAutoHideAsync();
    fetchSession();

    // Listen for changes in the authentication state (e.g., login, logout).
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    // Clean up the listener when the component unmounts.
    return () => {
      if (authListener) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

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

// Export the AuthProvider wrapper as the default component.
export default function AppWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}


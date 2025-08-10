// This file manages the user authentication session using Supabase.

import React, { useState, useEffect, createContext } from 'react';
import { createClient } from '@supabase/supabase-js';
import * as SplashScreen from 'expo-splash-screen';

// IMPORTANT: Replace these with your actual Supabase credentials.
// You can find these in your Supabase project dashboard under Settings -> API.
const supabaseUrl = 'https://kyaaknsamvocksxzbasz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5YWFrbnNhbXZvY2tzeHpiYXN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NDA3ODUsImV4cCI6MjA3MDQxNjc4NX0.Iv8rOwIvtvkkmgazE5z0caGHSf1WLo_VVx74PonyObk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
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

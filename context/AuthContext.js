// ./context/AuthContext.js  
// This file sets up a React Context to manage and share the user's authentication session.  
// It listens for auth state changes from the master Supabase client.  

import React, { createContext, useState, useEffect } from 'react';  
import { masterSupabase } from '../supabase/masterClient'; // Import the master Supabase client  

// Create the context  
export const AuthContext = createContext();  

// This component will wrap your entire app and provide the session data.  
export const AuthProvider = ({ children }) => {  
  const [session, setSession] = useState(null);  
  const [loading, setLoading] = useState(true);  

  useEffect(() => {  
    // This listener watches for changes in the authentication state (e.g., sign in, sign out).  
    const { data: { subscription } } = masterSupabase.auth.onAuthStateChange((_event, session) => {  
      setSession(session);  
      setLoading(false);  
    });  

    // Clean up the subscription when the component unmounts.  
    return () => subscription.unsubscribe();  
  }, []);  

  // We provide the session and the masterSupabase client to the rest of the application.  
  return (  
    <AuthContext.Provider value={{ session, masterSupabase, loading }}>  
      {children}  
    </AuthContext.Provider>  
  );  
};

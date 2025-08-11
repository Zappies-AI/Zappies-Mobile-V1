// ./screens/main/DashboardScreen.js
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { masterSupabase } from '../../supabase/masterClient';
import { AuthContext } from '../../context/AuthContext';

export function DashboardScreen() {
  const { session } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleSignOut = async () => {
    await masterSupabase.auth.signOut();
  };

  const fetchBotAnalytics = useCallback(async () => {
    if (!session || !session.user) {
      setError("User session not found.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    const userId = session.user.id;

    try {
      // Step 1: Fetch the bot's credentials from the master database
      // Using maybeSingle() to handle cases where 0 or 1 rows are returned.
      // If more than one row is returned, maybeSingle() throws an error.
      const { data: botCredentials, error: credentialsError } = await masterSupabase
        .from('bots') 
        .select('supabase_url, supabase_anon_key')
        .eq('user_id', userId)
        .maybeSingle();

      if (credentialsError) {
        if (credentialsError.code === '22P05') {
            setError("Error: Multiple bots found for your user ID. Please check the 'bots' table in your master database and remove duplicates.");
        } else {
            throw credentialsError;
        }
      }

      if (!botCredentials) {
          setError("No bot found for this user. Please ensure a bot is linked to your account in the master database.");
          setLoading(false);
          return;
      }

      // Step 2: Create a dynamic Supabase client for the specific bot's database
      const botSupabase = createClient(botCredentials.supabase_url, botCredentials.supabase_anon_key);

      // Step 3: Fetch the company_id from the bot's database
      const { data: companyData, error: companyError } = await botSupabase
        .from('companies') 
        .select('id')
        .maybeSingle(); // Using maybeSingle() for safety
      
      if (companyError) {
        if (companyError.code === '22P05') {
            setError("Error: Multiple companies found in the bot's database. Please check the 'companies' table and remove duplicates.");
        } else {
            throw companyError;
        }
      }

      if (!companyData || !companyData.id) {
          setError("Could not find company ID for this bot. Please check the bot's 'companies' table.");
          setLoading(false);
          return;
      }

      const companyId = companyData.id;

      // Step 4: Fetch bot statistics from the bot's database using the company_id
      const { data: botStats, error: statsError } = await botSupabase
        .from('bot_statistics') 
        .select('*')
        .eq('company_id', companyId)
        .maybeSingle(); // Using maybeSingle() for safety

      if (statsError) {
        if (statsError.code === '22P05') {
            setError("Error: Multiple statistic entries found for this company. Please check the 'bot_statistics' table and remove duplicates.");
        } else {
            throw statsError;
        }
      }

      if (!botStats) {
          setError("No bot statistics found for this company.");
          setLoading(false);
          return;
      }

      // Step 5: Count total conversations from the bot's database
      const { count: conversationsCount, error: conversationsError } = await botSupabase
        .from('conversations')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', companyId);

      if (conversationsError) {
        throw conversationsError;
      }

      // Combine the fetched data into a single state object
      setDashboardData({
        totalMessages: botStats.total_messages,
        totalRecipients: botStats.total_recipients,
        totalConversions: botStats.total_conversions,
        avgResponseTime: botStats.avg_response_time_ms,
        totalConversations: conversationsCount,
        userId: userId,
      });

    } catch (e) {
      console.error('Error fetching dashboard data:', e.message);
      setError(`Failed to load data: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchBotAnalytics();
  }, [fetchBotAnalytics]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading Dashboard...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchBotAnalytics}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!dashboardData) {
      return (
        <View style={styles.errorContainer}>
            <Text style={styles.errorText}>No dashboard data found for this user.</Text>
        </View>
      );
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageHeader}>Dashboard</Text>

        <Text style={styles.pageSubHeader}>User ID: {dashboardData.userId}</Text>
        <Text style={styles.dataText}>Total Messages: {dashboardData.totalMessages}</Text>
        <Text style={styles.dataText}>Total Recipients: {dashboardData.totalRecipients}</Text>
        <Text style={styles.dataText}>Total Conversions: {dashboardData.totalConversions}</Text>
        <Text style={styles.dataText}>Average Response Time: {dashboardData.avgResponseTime}ms</Text>
        <Text style={styles.dataText}>Total Conversations: {dashboardData.totalConversations}</Text>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>View Leads</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Stylesheet ---
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  pageHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  pageSubHeader: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  dataText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 20,
    alignSelf: 'flex-start',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  signOutButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 40,
    alignSelf: 'center',
  },
  signOutButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  retryButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007AFF',
    borderRadius: 20,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

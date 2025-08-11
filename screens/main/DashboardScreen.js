// ./screens/main/DashboardScreen.js
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { masterSupabase } from '../../supabase/masterClient';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import { Spacing, Typography } from '../../styles/theme';

export function DashboardScreen({ navigation }) {
  const { session } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const handleSignOut = async () => {
    setShowSignOutModal(false);
    await masterSupabase.auth.signOut();
  };

  const confirmSignOut = () => {
    setShowSignOutModal(true);
  };

  const setupRealtimeListeners = useCallback(async () => {
    if (!session || !session.user) {
      setError("User session not found.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
     
    const userId = session.user.id;

    let botSupabase = null;
    let companyId = null;

    try {
      // Step 1: Fetch the bot's credentials from the master database
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
      botSupabase = createClient(botCredentials.supabase_url, botCredentials.supabase_anon_key);

      // Step 3: Fetch the company_id from the bot's database
      const { data: companyData, error: companyError } = await botSupabase
        .from('companies')  
        .select('id')
        .maybeSingle();
       
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

      companyId = companyData.id;

      // Initial data fetch
      const [botStatsResponse, conversationsCountResponse] = await Promise.all([
        botSupabase.from('bot_statistics').select('*').eq('company_id', companyId).maybeSingle(),
        botSupabase.from('conversations').select('*', { count: 'exact', head: true }).eq('company_id', companyId),
      ]);
      
      const { data: botStats, error: statsError } = botStatsResponse;
      const { count: conversationsCount, error: conversationsError } = conversationsCountResponse;

      if (statsError || conversationsError) {
          throw statsError || conversationsError;
      }

      // Initialize with fetched data or zeros
      setDashboardData({
        totalMessages: botStats?.total_messages || 0,
        totalRecipients: botStats?.total_recipients || 0,
        totalConversions: botStats?.total_conversions || 0,
        avgResponseTime: botStats?.avg_response_time_ms || 0,
        totalConversations: conversationsCount || 0,
        userId: userId,
      });

      setLoading(false);

      // --- Start of Real-time Listeners ---

      // Listener for `bot_statistics` updates
      const statsSubscription = botSupabase
        .channel('public:bot_statistics')
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'bot_statistics', filter: `company_id=eq.${companyId}` },
          (payload) => {
            console.log('Realtime update received for bot_statistics:', payload);
            setDashboardData(prevData => ({
              ...prevData,
              totalMessages: payload.new.total_messages,
              totalRecipients: payload.new.total_recipients,
              totalConversions: payload.new.total_conversions,
              avgResponseTime: payload.new.avg_response_time_ms,
            }));
          }
        )
        .subscribe();
        
      // Listener for `conversations` inserts to update the count
      const conversationsSubscription = botSupabase
        .channel('public:conversations')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'conversations', filter: `company_id=eq.${companyId}` },
          () => {
            console.log('Realtime INSERT received for conversations.');
            setDashboardData(prevData => ({
              ...prevData,
              totalConversations: (prevData.totalConversations || 0) + 1,
            }));
          }
        )
        .subscribe();

      // Return a cleanup function
      return () => {
        botSupabase.removeChannel(statsSubscription);
        botSupabase.removeChannel(conversationsSubscription);
      };

    } catch (e) {
      console.error('Error in setting up real-time listeners:', e.message);
      setError(`Failed to set up real-time listeners: ${e.message}`);
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    // Call the async function to set up listeners
    const cleanupPromise = setupRealtimeListeners();

    // The useEffect cleanup function will be the return value of setupRealtimeListeners
    return () => {
      cleanupPromise.then(cleanup => {
        if (typeof cleanup === 'function') {
          cleanup();
        }
      });
    };
  }, [setupRealtimeListeners]);

  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      flexGrow: 1,
      padding: Spacing.medium,
    },
    pageHeader: {
      ...Typography.header,
      color: theme.text,
      marginBottom: Spacing.large,
    },
    pageSubHeader: {
      ...Typography.body,
      color: theme.subtext,
      marginBottom: Spacing.large,
    },
    cardContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: Spacing.large,
    },
    statCard: {
      backgroundColor: theme.card,
      padding: Spacing.medium,
      borderRadius: 12,
      marginBottom: Spacing.medium,
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
      width: '48%',
    },
    statTitle: {
      ...Typography.body,
      color: theme.subtext,
      marginBottom: Spacing.small,
    },
    statValue: {
      ...Typography.subHeader,
      color: theme.primary,
    },
    actionButton: {
      backgroundColor: theme.primary,
      paddingVertical: Spacing.medium,
      paddingHorizontal: Spacing.large,
      borderRadius: 25,
      marginTop: Spacing.large,
      alignSelf: 'center',
      width: '100%',
    },
    actionButtonText: {
      color: theme.card,
      ...Typography.subHeader,
      textAlign: 'center',
    },
    signOutButton: {
      backgroundColor: theme.error,
      paddingVertical: Spacing.medium,
      paddingHorizontal: Spacing.large,
      borderRadius: 25,
      marginTop: Spacing.large,
      alignSelf: 'center',
      width: '100%',
    },
    signOutButtonText: {
      color: theme.card,
      ...Typography.subHeader,
      textAlign: 'center',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.background,
    },
    loadingText: {
      marginTop: Spacing.medium,
      ...Typography.body,
      color: theme.subtext,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.background,
      padding: Spacing.large,
    },
    errorText: {
      ...Typography.body,
      color: theme.error,
      textAlign: 'center',
    },
    retryButton: {
      marginTop: Spacing.medium,
      paddingVertical: Spacing.small,
      paddingHorizontal: Spacing.medium,
      backgroundColor: theme.primary,
      borderRadius: 20,
    },
    retryButtonText: {
      color: theme.card,
      ...Typography.label,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalCard: {
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: Spacing.large,
      width: '80%',
      alignItems: 'center',
    },
    modalTitle: {
      ...Typography.subHeader,
      color: theme.text,
      marginBottom: Spacing.medium,
      textAlign: 'center',
    },
    modalButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    modalButton: {
      flex: 1,
      paddingVertical: Spacing.small,
      paddingHorizontal: Spacing.medium,
      borderRadius: 20,
      marginHorizontal: Spacing.small,
      alignItems: 'center',
    },
    modalButtonText: {
      ...Typography.label,
      fontWeight: 'bold',
    },
    signOutModalButton: {
      backgroundColor: theme.error,
    },
    cancelModalButton: {
      backgroundColor: theme.subtext,
    },
    signOutModalButtonText: {
      color: theme.card,
    },
    cancelModalButtonText: {
      color: theme.card,
    },
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>Loading Dashboard...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => window.location.reload()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const {
    totalMessages = 0,
    totalRecipients = 0,
    totalConversions = 0,
    avgResponseTime = 0,
    totalConversations = 0,
    userId,
  } = dashboardData || {};

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageHeader}>Dashboard</Text>

        <Text style={styles.pageSubHeader}>User ID: {userId}</Text>

        <View style={styles.cardContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statTitle}>Total Messages</Text>
            <Text style={styles.statValue}>{totalMessages}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statTitle}>Total Recipients</Text>
            <Text style={styles.statValue}>{totalRecipients}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statTitle}>Total Conversions</Text>
            <Text style={styles.statValue}>{totalConversions}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statTitle}>Avg Response Time</Text>
            <Text style={styles.statValue}>{avgResponseTime}s</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statTitle}>Total Conversations</Text>
            <Text style={styles.statValue}>{totalConversations}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>View Leads</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Bot Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Chat Flow</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Analytics</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signOutButton} onPress={confirmSignOut}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Confirmation Modal for Sign Out */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showSignOutModal}
        onRequestClose={() => setShowSignOutModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Are you sure you want to sign out?</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelModalButton]}
                onPress={() => setShowSignOutModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.signOutModalButton]}
                onPress={handleSignOut}
              >
                <Text style={[styles.modalButtonText, styles.signOutModalButtonText]}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

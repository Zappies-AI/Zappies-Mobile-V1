import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { masterSupabase } from '../../supabase/masterClient';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import { Spacing, Typography } from '../../styles/theme';
import { Ionicons } from '@expo/vector-icons';

export function LeadsPageScreen() {
  const { session } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // This function fetches the leads data from the bot's database.
  const fetchLeads = useCallback(async () => {
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
      const { data: botCredentials, error: credentialsError } = await masterSupabase
        .from('bots')  
        .select('supabase_url, supabase_anon_key')
        .eq('user_id', userId)
        .maybeSingle();

      if (credentialsError) throw credentialsError;

      if (!botCredentials) {
          setError("No bot found for this user. Please ensure a bot is linked to your account.");
          setLoading(false);
          return;
      }

      // Step 2: Create a dynamic Supabase client for the specific bot's database
      const botSupabase = createClient(botCredentials.supabase_url, botCredentials.supabase_anon_key);

      // Step 3: Fetch all whatsapp_users from the bot's database
      const { data: leadsData, error: leadsError } = await botSupabase
        .from('whatsapp_users')  
        .select('*');
       
      if (leadsError) throw leadsError;

      setLeads(leadsData || []);
      setLoading(false);
      setRefreshing(false);
    } catch (e) {
      console.error('Error fetching leads:', e.message);
      setError(`Failed to fetch leads: ${e.message}`);
      setLoading(false);
      setRefreshing(false);
    }
  }, [session]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Handle manual refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchLeads();
  }, [fetchLeads]);

  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: theme.background,
    },
    pageHeader: {
      ...Typography.header,
      color: theme.text,
      marginBottom: Spacing.large,
      paddingHorizontal: Spacing.medium,
      marginTop: Spacing.large,
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
    scrollView: {
      flex: 1,
    },
    leadItem: {
      backgroundColor: theme.card,
      padding: Spacing.medium,
      borderRadius: 12,
      marginHorizontal: Spacing.medium,
      marginBottom: Spacing.medium,
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
      flexDirection: 'row',
      alignItems: 'center',
    },
    leadIcon: {
      marginRight: Spacing.medium,
    },
    leadDetails: {
      flex: 1,
    },
    leadName: {
      ...Typography.subHeader,
      color: theme.text,
    },
    leadPhoneNumber: {
      ...Typography.body,
      color: theme.subtext,
    },
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>Loading Leads...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchLeads}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Text style={styles.pageHeader}>Leads</Text>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
          />
        }
      >
        {leads.length > 0 ? (
          leads.map((lead) => (
            <TouchableOpacity key={lead.id} style={styles.leadItem} onPress={() => { /* Handle lead item press */ }}>
              <View style={styles.leadIcon}>
                <Ionicons name="person-circle" size={48} color={theme.primary} />
              </View>
              <View style={styles.leadDetails}>
                {/* Assuming 'name' or 'display_name' is available, otherwise just use the number */}
                <Text style={styles.leadName}>{lead.phone_number}</Text>
                <Text style={styles.leadPhoneNumber}>Last Active: {new Date(lead.last_active).toLocaleDateString()}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.large }}>
            <Text style={{ ...Typography.body, color: theme.subtext, textAlign: 'center' }}>No leads found yet.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

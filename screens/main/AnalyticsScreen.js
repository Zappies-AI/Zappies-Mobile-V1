import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { masterSupabase } from '../../supabase/masterClient';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import { Spacing, Typography } from '../../styles/theme';
import { LineChart } from 'react-native-chart-kit';

export function AnalyticsScreen() {
  const { session } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState('chart'); // 'chart' or 'list'

  const fetchAnalyticsData = useCallback(async () => {
    if (!session || !session.user) {
      setError("User session not found.");
      setLoading(false);
      setRefreshing(false);
      return;
    }

    if (!refreshing) {
      setLoading(true);
    }
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

      if (credentialsError) throw credentialsError;

      if (!botCredentials) {
          setError("No bot found for this user. Please ensure a bot is linked to your account in the master database.");
          setLoading(false);
          setRefreshing(false);
          return;
      }

      // Step 2: Create a dynamic Supabase client for the specific bot's database
      botSupabase = createClient(botCredentials.supabase_url, botCredentials.supabase_anon_key);

      // Step 3: Fetch the company_id from the bot's database
      const { data: companyData, error: companyError } = await botSupabase
        .from('companies')  
        .select('id')
        .maybeSingle();
       
      if (companyError) throw companyError;

      if (!companyData || !companyData.id) {
          setError("Could not find company ID for this bot. Please check the bot's 'companies' table.");
          setLoading(false);
          setRefreshing(false);
          return;
      }

      companyId = companyData.id;

      // Step 4: Fetch all necessary analytics data from the bot's database
      const { data: botStats, error: statsError } = await botSupabase
        .from('bot_statistics')
        .select('*')
        .eq('company_id', companyId)
        .maybeSingle();
      
      // Step 5: Fetch the most recent conversations and the related user's name
      const { data: conversations, error: conversationsError } = await botSupabase
        .from('conversations')
        // Using a join to fetch the whatsapp_users' name
        .select('*, whatsapp_users(name)')
        .eq('company_id', companyId)
        .order('started_at', { ascending: false })
        .limit(5);

      // Step 6: Fetch conversations from the last 30 days to calculate the trend client-side
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: trendData, error: trendError } = await botSupabase
        .from('conversations')
        .select('started_at')
        .eq('company_id', companyId)
        .gte('started_at', thirtyDaysAgo.toISOString());

      if (statsError || conversationsError || trendError) {
          throw statsError || conversationsError || trendError;
      }

      // Process conversation trend data
      const dailyCounts = trendData.reduce((acc, convo) => {
        const date = new Date(convo.started_at).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      const conversationTrendData = Object.keys(dailyCounts).map(date => ({
        date: date,
        count: dailyCounts[date],
      })).sort((a, b) => new Date(a.date) - new Date(b.date));
      
      setAnalyticsData({
        totalMessages: botStats?.total_messages || 0,
        totalRecipients: botStats?.total_recipients || 0,
        totalConversions: botStats?.total_conversions || 0,
        avgResponseTime: botStats?.avg_response_time_ms || 0,
        totalConversations: botStats?.total_conversations || 0,
        recentConversations: conversations || [],
        conversationTrend: conversationTrendData || [],
        userId: userId,
      });

      setLoading(false);
      setRefreshing(false);
    } catch (e) {
      console.error('Error fetching analytics data:', e.message);
      setError(`Failed to fetch analytics data: ${e.message}`);
      setLoading(false);
      setRefreshing(false);
    }
  }, [session, refreshing]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  const getChartData = () => {
    const dates = analyticsData.conversationTrend.map(d => {
      const date = new Date(d.date);
      return `${date.getDate()}/${date.getMonth() + 1}`; // Format as Day/Month
    });
    const counts = analyticsData.conversationTrend.map(d => d.count);
    return {
      labels: dates,
      datasets: [
        {
          data: counts,
          color: (opacity = 1) => theme.primary,
          strokeWidth: 2,
        },
      ],
    };
  };

  const chartConfig = {
    backgroundGradientFrom: theme.card,
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: theme.card,
    backgroundGradientToOpacity: 1,
    color: (opacity = 1) => theme.subtext,
    labelColor: (opacity = 1) => theme.text,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollViewContent: {
      flexGrow: 1,
      padding: Spacing.medium,
    },
    pageHeader: {
      ...Typography.header,
      color: theme.text,
      marginBottom: Spacing.large,
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
    toggleContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: Spacing.large,
    },
    toggleButton: {
      paddingVertical: Spacing.small,
      paddingHorizontal: Spacing.medium,
      backgroundColor: theme.card,
      borderRadius: 20,
      marginHorizontal: Spacing.small,
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    activeToggleButton: {
      backgroundColor: theme.primary,
    },
    toggleButtonText: {
      ...Typography.label,
      color: theme.text,
    },
    activeToggleButtonText: {
      color: theme.card,
    },
    chartContainer: {
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: Spacing.medium,
      marginBottom: Spacing.large,
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    chartTitle: {
      ...Typography.subHeader,
      color: theme.text,
      marginBottom: Spacing.medium,
    },
    chartNoDataText: {
      ...Typography.body,
      color: theme.subtext,
      textAlign: 'center',
      paddingVertical: Spacing.large,
    },
    recentConversationsTitle: {
      ...Typography.subHeader,
      color: theme.text,
      marginBottom: Spacing.medium,
    },
    conversationCard: {
      backgroundColor: theme.card,
      padding: Spacing.medium,
      borderRadius: 12,
      marginBottom: Spacing.small,
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    conversationId: {
      ...Typography.label,
      color: theme.subtext,
    },
    conversationTimestamp: {
      ...Typography.small,
      color: theme.subtext,
    },
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>Loading Analytics...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchAnalyticsData}>
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
    recentConversations = [],
    conversationTrend = [],
  } = analyticsData || {};

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
          />
        }
      >
        <Text style={styles.pageHeader}>Analytics</Text>
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
            <Text style={styles.statValue}>{avgResponseTime}ms</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statTitle}>Total Conversations</Text>
            <Text style={styles.statValue}>{totalConversations}</Text>
          </View>
        </View>

        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[styles.toggleButton, viewMode === 'chart' && styles.activeToggleButton]}
            onPress={() => setViewMode('chart')}
          >
            <Text style={[styles.toggleButtonText, viewMode === 'chart' && styles.activeToggleButtonText]}>
              Chart
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleButton, viewMode === 'list' && styles.activeToggleButton]}
            onPress={() => setViewMode('list')}
          >
            <Text style={[styles.toggleButtonText, viewMode === 'list' && styles.activeToggleButtonText]}>
              Recent
            </Text>
          </TouchableOpacity>
        </View>

        {viewMode === 'chart' && (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Daily Conversations Trend (Last 30 days)</Text>
            {conversationTrend.length > 0 ? (
              <LineChart
                data={getChartData()}
                width={Dimensions.get('window').width - Spacing.medium * 2} // from react-native
                height={220}
                chartConfig={chartConfig}
                bezier
              />
            ) : (
              <Text style={styles.chartNoDataText}>No conversation data available for the last 30 days.</Text>
            )}
          </View>
        )}

        {viewMode === 'list' && (
          <View>
            <Text style={styles.recentConversationsTitle}>Recent Conversations</Text>
            {recentConversations.length > 0 ? (
              recentConversations.map((convo, index) => (
                <View key={convo.id} style={styles.conversationCard}>
                  <Text style={styles.conversationId}>Whatsapp Username: {convo.whatsapp_users.name}</Text>
                  <Text style={styles.conversationTimestamp}>
                    Timestamp: {new Date(convo.started_at).toLocaleString()}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.chartNoDataText}>No recent conversations found.</Text>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

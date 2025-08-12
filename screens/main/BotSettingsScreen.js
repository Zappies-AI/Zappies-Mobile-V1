import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { masterSupabase } from '../../supabase/masterClient';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import { Spacing, Typography } from '../../styles/theme';
import { Ionicons } from '@expo/vector-icons';

export function BotSettingsScreen() {
  const { session } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const [botSettings, setBotSettings] = useState({
    name: '',
    aiModel: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // This function fetches the bot's settings directly from the master database
  const fetchBotSettings = useCallback(async () => {
    if (!session || !session.user) {
      setError("User session not found.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const userId = session.user.id;

    try {
      // Fetch the bot settings from the 'bots' table in the master database
      const { data: settingsData, error: settingsError } = await masterSupabase
        .from('bots')
        .select('name, ai_model')
        .eq('user_id', userId)
        .maybeSingle();

      if (settingsError) throw settingsError;

      if (settingsData) {
        setBotSettings({
          name: settingsData.name,
          aiModel: settingsData.ai_model,
        });
      } else {
        // If settings don't exist, we can initialize them with default values
        setBotSettings({ name: 'y Bot', aiModel: 'gemini-2.5-flash-preview' });
      }
      setLoading(false);
    } catch (e) {
      console.error('Error fetching bot settings:', e.message);
      setError(`Failed to fetch settings: ${e.message}`);
      setLoading(false);
    }
  }, [session]);

  // Function to handle saving the updated bot settings
  const handleSaveSettings = useCallback(async () => {
    if (!session || !session.user) {
      setError("User session not found.");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    const userId = session.user.id;

    try {
      // Update the 'bots' table in the master database with the new settings
      const { error: updateError } = await masterSupabase
        .from('bots')
        .update({
          name: botSettings.name,
          ai_model: botSettings.aiModel,
        })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      setSuccessMessage('Settings saved successfully!');
    } catch (e) {
      console.error('Error saving bot settings:', e.message);
      setError(`Failed to save settings: ${e.message}`);
    } finally {
      setSaving(false);
    }
  }, [session, botSettings]);

  useEffect(() => {
    fetchBotSettings();
  }, [fetchBotSettings]);

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
    formContainer: {
      flex: 1,
      paddingHorizontal: Spacing.medium,
    },
    fieldContainer: {
      marginBottom: Spacing.large,
    },
    label: {
      ...Typography.label,
      color: theme.text,
      marginBottom: Spacing.small,
    },
    input: {
      backgroundColor: theme.card,
      padding: Spacing.medium,
      borderRadius: 8,
      ...Typography.body,
      color: theme.text,
      borderColor: theme.border,
      borderWidth: 1,
    },
    saveButton: {
      backgroundColor: theme.primary,
      paddingVertical: Spacing.medium,
      paddingHorizontal: Spacing.large,
      borderRadius: 25,
      marginTop: Spacing.large,
      alignSelf: 'center',
      width: '100%',
    },
    saveButtonText: {
      color: theme.card,
      ...Typography.subHeader,
      textAlign: 'center',
    },
    successMessage: {
      ...Typography.body,
      color: theme.success,
      textAlign: 'center',
      marginBottom: Spacing.medium,
    },
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>Loading Bot Settings...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchBotSettings}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text style={styles.pageHeader}>Bot Settings</Text>

        {successMessage && <Text style={styles.successMessage}>{successMessage}</Text>}

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Bot Name</Text>
          <TextInput
            style={styles.input}
            value={botSettings.name}
            onChangeText={(text) => setBotSettings({ ...botSettings, name: text })}
            placeholder="Enter bot name"
            placeholderTextColor={theme.subtext}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>AI Model</Text>
          <TextInput
            style={styles.input}
            value={botSettings.aiModel}
            onChangeText={(text) => setBotSettings({ ...botSettings, aiModel: text })}
            placeholder="Enter AI model"
            placeholderTextColor={theme.subtext}
          />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, saving && { opacity: 0.5 }]}
          onPress={handleSaveSettings}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color={theme.card} />
          ) : (
            <Text style={styles.saveButtonText}>Save Settings</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

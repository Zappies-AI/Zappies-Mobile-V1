// This screen serves as the main authenticated dashboard with new styles.

import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { supabase } from '../../context/AuthContext';
import { Spacing, Typography } from '../../styles/theme';
import { ThemeContext } from '../../context/ThemeContext';

export default function DashboardScreen() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      flexGrow: 1,
      padding: Spacing.large,
    },
    header: {
      ...Typography.header,
      color: theme.text,
      marginBottom: Spacing.large,
    },
    card: {
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: Spacing.large,
      marginBottom: Spacing.medium,
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    cardHeader: {
      ...Typography.subHeader,
      color: theme.primary,
      marginBottom: Spacing.small,
    },
    cardSubText: {
      ...Typography.body,
      color: theme.text,
    },
    actionButton: {
      backgroundColor: theme.primary,
      paddingVertical: Spacing.medium,
      paddingHorizontal: Spacing.large,
      borderRadius: 25,
      marginTop: Spacing.large,
      alignSelf: 'center',
      width: '100%',
      alignItems: 'center',
    },
    actionButtonText: {
      color: theme.card,
      ...Typography.subHeader,
    },
    signOutButton: {
      backgroundColor: theme.error,
      paddingVertical: Spacing.medium,
      paddingHorizontal: Spacing.large,
      borderRadius: 25,
      marginTop: Spacing.large,
      alignSelf: 'center',
      width: '100%',
      alignItems: 'center',
    },
    signOutButtonText: {
      color: theme.card,
      ...Typography.subHeader,
    },
    themeToggle: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.card,
      borderRadius: 25,
      padding: Spacing.small,
      alignSelf: 'flex-end',
      marginBottom: Spacing.medium,
    },
    themeToggleText: {
      ...Typography.body,
      color: theme.text,
      marginLeft: Spacing.small,
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Dashboard</Text>
        <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
          <Text style={styles.themeToggleText}>Toggle {theme.modeToggleIcon === 'moon-outline' ? 'Dark' : 'Light'} Mode</Text>
        </TouchableOpacity>
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Bot Status</Text>
          <Text style={styles.cardSubText}>Online</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Today's Leads</Text>
          <Text style={styles.cardSubText}>5</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Feature Preview</Text>
          <Text style={styles.cardSubText}>Upgrade to Pro for more features!</Text>
        </View>
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



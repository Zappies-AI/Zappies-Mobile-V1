// screens/main/DashboardScreen.js
// This screen serves as the main authenticated dashboard with new styles.

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { supabase } from '../../supabase/client';
import { Colors, Spacing, Typography } from '../../styles/theme';

export default function DashboardScreen() {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Dashboard</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Spacing.large,
  },
  header: {
    ...Typography.header,
    marginBottom: Spacing.large,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: Spacing.large,
    marginBottom: Spacing.medium,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    ...Typography.subHeader,
    color: Colors.primary,
    marginBottom: Spacing.small,
  },
  cardSubText: {
    ...Typography.body,
    color: Colors.text,
  },
  actionButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.large,
    borderRadius: 25,
    marginTop: Spacing.large,
    alignSelf: 'center',
    width: '100%',
    alignItems: 'center',
  },
  actionButtonText: {
    color: Colors.card,
    ...Typography.subHeader,
  },
  signOutButton: {
    backgroundColor: Colors.error,
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.large,
    borderRadius: 25,
    marginTop: Spacing.large,
    alignSelf: 'center',
    width: '100%',
    alignItems: 'center',
  },
  signOutButtonText: {
    color: Colors.card,
    ...Typography.subHeader,
  },
});
// screens/main/DashboardScreen.js
// This screen serves as the main authenticated dashboard.

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { supabase } from '../../supabase/client';

export default function DashboardScreen() {
  const handleSignOut = async () => {
    // Call Supabase to sign the user out.
    await supabase.auth.signOut();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Dashboard</Text>
        <Text style={styles.subHeader}>Bot Status: Online</Text>
        <Text style={styles.placeholderText}>Today's Leads: 5</Text>
        <Text style={styles.placeholderText}>Upgrade to Pro for more features!</Text>
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
    backgroundColor: '#f7f7f7',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subHeader: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 10,
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
});

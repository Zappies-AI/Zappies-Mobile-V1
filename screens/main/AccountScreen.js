// screens/main/AccountScreen.js
// A placeholder screen for user account management.

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';

export default function AccountScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Account</Text>
        <Text style={styles.placeholderText}>Upgrade to Pro, support, and settings.</Text>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Upgrade to Pro</Text>
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
});
// screens/main/AnalyticsScreen.js
// A placeholder screen for the app's analytics dashboard.

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';

export default function AnalyticsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Analytics</Text>
        <Text style={styles.placeholderText}>Performance metrics and dashboards will be here.</Text>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>View Reports</Text>
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

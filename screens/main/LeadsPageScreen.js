//screens/main/LeadsPageScreen.js
// A placeholder screen for displaying the list of leads with new styles.

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Colors, Spacing, Typography } from '../../styles/theme';

export default function LeadsPageScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Leads Page</Text>
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Recent Leads</Text>
          <Text style={styles.cardBody}>No leads to display yet.</Text>
        </View>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Filter Leads</Text>
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
  cardBody: {
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
});


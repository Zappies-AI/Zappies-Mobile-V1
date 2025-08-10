// screens/main/AccountScreen.js
// A placeholder screen for user account management with new styles.

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Colors, Spacing, Typography } from '../../styles/theme';

export default function AccountScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Account</Text>
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Upgrade to Pro</Text>
          <Text style={styles.cardBody}>Get more features and analytics with a Pro subscription.</Text>
        </View>
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

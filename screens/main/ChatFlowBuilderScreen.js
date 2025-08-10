// A placeholder screen for the Pro-only Chat Flow Builder with new styles.

import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Spacing, Typography } from '../../styles/theme';
import { ThemeContext } from '../../context/ThemeContext';

export default function ChatFlowBuilderScreen() {
  const { theme } = useContext(ThemeContext);

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
    cardBody: {
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
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Chat Flow Builder</Text>
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Pro Feature</Text>
          <Text style={styles.cardBody}>Drag-and-drop builder for Pro users.</Text>
        </View>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Start Building</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

import React, { useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';
import { Spacing, Typography } from '../../styles/theme';

export function ChatFlowBuilderScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.background,
      padding: Spacing.large,
    },
    header: {
      ...Typography.header,
      color: theme.text,
      marginBottom: Spacing.large,
    },
    subHeader: {
      ...Typography.body,
      color: theme.subtext,
      textAlign: 'center',
    },
    backButton: {
      marginTop: Spacing.large,
      padding: Spacing.medium,
      backgroundColor: theme.primary,
      borderRadius: 25,
    },
    backButtonText: {
      ...Typography.subHeader,
      color: theme.card,
    },
  });
  
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Chat Flow Page</Text>
      <Text style={styles.subHeader}>This is where you can design your bot's conversational flow.</Text>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Go Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

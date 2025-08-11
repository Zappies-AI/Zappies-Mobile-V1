// This screen serves as the main authenticated dashboard with new styles.

import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Modal, Pressable } from 'react-native';
import { supabase } from '../../context/AuthContext';
import { Spacing, Typography } from '../../styles/theme';
import { ThemeContext } from '../../context/ThemeContext';

export default function DashboardScreen() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const handleSignOut = async () => {
    setShowSignOutModal(false);
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
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
      width: '80%',
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: Spacing.large,
      alignItems: 'center',
      shadowColor: theme.text,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalText: {
      ...Typography.subHeader,
      marginBottom: Spacing.large,
      textAlign: 'center',
      color: theme.text,
    },
    modalButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    modalButton: {
      flex: 1,
      borderRadius: 8,
      padding: Spacing.medium,
      elevation: 2,
      marginHorizontal: Spacing.small,
    },
    buttonClose: {
      backgroundColor: theme.border,
    },
    buttonSignOut: {
      backgroundColor: theme.error,
    },
    textStyle: {
      color: theme.card,
      ...Typography.body,
      textAlign: 'center',
    },
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
        <TouchableOpacity style={styles.signOutButton} onPress={() => setShowSignOutModal(true)}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Sign Out Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showSignOutModal}
        onRequestClose={() => setShowSignOutModal(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Are you sure you want to sign out?</Text>
            <View style={styles.modalButtonContainer}>
              <Pressable
                style={[styles.modalButton, styles.buttonClose]}
                onPress={() => setShowSignOutModal(false)}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.buttonSignOut]}
                onPress={handleSignOut}
              >
                <Text style={styles.textStyle}>Sign Out</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
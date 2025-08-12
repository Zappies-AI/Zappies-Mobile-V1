import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Modal, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import { Spacing, Typography } from '../../styles/theme';

export function AccountScreen() {
  const { masterSupabase, session } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  // Get user email from the session, if available
  const userEmail = session?.user?.email || 'N/A';

  // Handle the sign out logic
  const handleSignOut = async () => {
    setShowSignOutModal(false);
    // Use the masterSupabase client from AuthContext to sign out
    await masterSupabase.auth.signOut();
  };

  const confirmSignOut = () => {
    setShowSignOutModal(true);
  };

  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollViewContent: {
      flexGrow: 1,
      padding: Spacing.medium,
    },
    header: {
      ...Typography.header,
      color: theme.text,
      marginBottom: Spacing.large,
    },
    profileCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      padding: Spacing.medium,
      borderRadius: 12,
      marginBottom: Spacing.large,
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    profileIconContainer: {
      padding: Spacing.small,
      backgroundColor: theme.secondary,
      borderRadius: 30,
      marginRight: Spacing.medium,
    },
    profileInfo: {
      flex: 1,
    },
    profileName: {
      ...Typography.subHeader,
      color: theme.text,
    },
    profileEmail: {
      ...Typography.body,
      color: theme.subtext,
    },
    optionCard: {
      backgroundColor: theme.card,
      padding: Spacing.medium,
      borderRadius: 12,
      marginBottom: Spacing.medium,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    optionText: {
      ...Typography.body,
      color: theme.text,
    },
    signOutButton: {
      backgroundColor: theme.error,
      paddingVertical: Spacing.medium,
      borderRadius: 25,
      marginTop: Spacing.large,
      alignItems: 'center',
    },
    signOutButtonText: {
      ...Typography.subHeader,
      color: theme.card,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalCard: {
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: Spacing.large,
      width: '80%',
      alignItems: 'center',
    },
    modalTitle: {
      ...Typography.subHeader,
      color: theme.text,
      marginBottom: Spacing.medium,
      textAlign: 'center',
    },
    modalButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginTop: Spacing.medium,
    },
    modalButton: {
      flex: 1,
      paddingVertical: Spacing.small,
      paddingHorizontal: Spacing.medium,
      borderRadius: 20,
      marginHorizontal: Spacing.small,
      alignItems: 'center',
    },
    modalButtonText: {
      ...Typography.label,
      fontWeight: 'bold',
    },
    signOutModalButton: {
      backgroundColor: theme.error,
    },
    cancelModalButton: {
      backgroundColor: theme.subtext,
    },
    signOutModalButtonText: {
      color: theme.card,
    },
    cancelModalButtonText: {
      color: theme.card,
    },
  });

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.scrollViewContent}>
        <Text style={styles.header}>Account</Text>
        
        {/* Profile Info Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileIconContainer}>
            <Ionicons name="person" size={24} color={theme.card} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Account Holder</Text>
            <Text style={styles.profileEmail}>{userEmail}</Text>
          </View>
        </View>

        {/* Theme Toggle */}
        <View style={styles.optionCard}>
          <Text style={styles.optionText}>Dark Mode</Text>
          <Switch
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor={theme.card}
            ios_backgroundColor={theme.border}
            onValueChange={toggleTheme}
            value={theme.modeToggleIcon === 'sunny-outline'}
          />
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.signOutButton} onPress={confirmSignOut}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>

      </View>

      {/* Confirmation Modal for Sign Out */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showSignOutModal}
        onRequestClose={() => setShowSignOutModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Are you sure you want to sign out?</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelModalButton]}
                onPress={() => setShowSignOutModal(false)}
              >
                <Text style={[styles.modalButtonText, styles.cancelModalButtonText]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.signOutModalButton]}
                onPress={handleSignOut}
              >
                <Text style={[styles.modalButtonText, styles.signOutModalButtonText]}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

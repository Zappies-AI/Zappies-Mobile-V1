// This screen handles the user sign-in flow with new styles.

import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { supabase } from '../../context/AuthContext';
import { Spacing, Typography } from '../../styles/theme';
import { ThemeContext } from '../../context/ThemeContext';

export default function SignInScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.background,
    },
    card: {
      width: '90%',
      maxWidth: 400,
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: Spacing.large,
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    title: {
      ...Typography.header,
      color: theme.text,
      textAlign: 'center',
      marginBottom: Spacing.large,
    },
    input: {
      width: '100%',
      padding: Spacing.medium,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      marginBottom: Spacing.medium,
      backgroundColor: theme.card,
      ...Typography.body,
      color: theme.text,
    },
    button: {
      width: '100%',
      padding: Spacing.medium,
      backgroundColor: theme.primary,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: Spacing.medium,
    },
    buttonDisabled: {
      backgroundColor: theme.subtext,
    },
    buttonText: {
      color: theme.card,
      ...Typography.subHeader,
    },
    linkText: {
      color: theme.primary,
      ...Typography.body,
      textAlign: 'center',
    },
    errorText: {
      color: theme.error,
      marginBottom: Spacing.medium,
      textAlign: 'center',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome Back to Zappy Bot</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={theme.subtext}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={theme.subtext}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={theme.card} />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


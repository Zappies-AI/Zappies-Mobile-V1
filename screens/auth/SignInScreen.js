// screens/auth/SignInScreen.js
// This screen handles the user sign-in flow with new styles.

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { supabase } from '../../supabase/client';
import { Colors, Spacing, Typography } from '../../styles/theme';

export default function SignInScreen({ navigation }) {
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome Back to Zappy Bot</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={Colors.subtext}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={Colors.subtext}
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
            <ActivityIndicator color={Colors.card} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  card: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: Spacing.large,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    ...Typography.header,
    textAlign: 'center',
    marginBottom: Spacing.large,
  },
  input: {
    width: '100%',
    padding: Spacing.medium,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    marginBottom: Spacing.medium,
    backgroundColor: Colors.card,
    ...Typography.body,
  },
  button: {
    width: '100%',
    padding: Spacing.medium,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: Spacing.medium,
  },
  buttonDisabled: {
    backgroundColor: Colors.subtext,
  },
  buttonText: {
    color: Colors.card,
    ...Typography.subHeader,
  },
  linkText: {
    color: Colors.primary,
    ...Typography.body,
    textAlign: 'center',
  },
  errorText: {
    color: Colors.error,
    marginBottom: Spacing.medium,
    textAlign: 'center',
  },
});


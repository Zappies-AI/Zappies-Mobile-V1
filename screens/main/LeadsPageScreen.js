// ./screens/main/LeadsPageScreen.js
// This is the LeadsPageScreen component.
// It uses a named export, which is required for the import statement in AppTabs.js.
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function LeadsPageScreen() {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      fontSize: 24,
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Leads Page Screen</Text>
    </View>
  );
}

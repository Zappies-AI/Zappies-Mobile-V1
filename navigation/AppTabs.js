// This file defines the bottom tab navigator for the main app screens.

import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import all screen components from the 'main' sub-directory inside the 'screens' folder.
// The relative path from 'navigation' to 'screens/main' is '../screens/main'.
// The import statements have been corrected to use named imports instead of default imports.
// import { DashboardScreen } from '../screens/main/DashboardScreen';
import { DashboardScreen } from '../screens/main/DashboardScreen';
import { LeadsPageScreen } from '../screens/main/LeadsPageScreen';
import { BotSettingsScreen } from '../screens/main/BotSettingsScreen';
import { ChatFlowBuilderScreen } from '../screens/main/ChatFlowBuilderScreen';
import { AnalyticsScreen } from '../screens/main/AnalyticsScreen';
import { AccountScreen } from '../screens/main/AccountScreen';

// Import the ThemeContext from the 'context' folder.
// The relative path from 'navigation' to 'context' is '../context'.
import { ThemeContext } from '../context/ThemeContext';

const AppTab = createBottomTabNavigator();
console.log('AppTabs.js: AppTab created successfully');
export default function AppTabsScreens() {
  const { theme } = useContext(ThemeContext);
  return (
    <AppTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Leads') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Bot Settings') {
            iconName = focused ? 'cog' : 'cog-outline';
          } else if (route.name === 'Chat Flow') {
            iconName = focused ? 'git-branch' : 'git-branch-outline';
          } else if (route.name === 'Analytics') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'Account') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.subtext,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopWidth: 1,
          borderTopColor: theme.border,
        },
      })}
    >
      <AppTab.Screen name="Dashboard" component={DashboardScreen} />
      <AppTab.Screen name="Leads" component={LeadsPageScreen} />
      <AppTab.Screen name="Bot Settings" component={BotSettingsScreen} />
      <AppTab.Screen name="Chat Flow" component={ChatFlowBuilderScreen} />
      <AppTab.Screen name="Analytics" component={AnalyticsScreen} />
      <AppTab.Screen name="Account" component={AccountScreen} />
    </AppTab.Navigator>
  );
}

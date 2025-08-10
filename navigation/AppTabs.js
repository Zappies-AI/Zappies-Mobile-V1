// navigation/AppTabs.js

// This file defines the bottom tab navigator for the main app screens.

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import DashboardScreen from '../screens/main/DashboardScreen';
import LeadsPageScreen from '../screens/main/LeadsPageScreen';
import BotSettingsScreen from '../screens/main/BotSettingsScreen';
import ChatFlowBuilderScreen from '../screens/main/ChatFlowBuilderScreen';
import AnalyticsScreen from '../screens/main/AnalyticsScreen';
import AccountScreen from '../screens/main/AccountScreen';

const AppTab = createBottomTabNavigator();

export default function AppTabsScreens() {
  return (
    <AppTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          // Set the icon based on the screen name.
          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Leads') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Bot Settings') {
            iconName = focused ? 'cog' : 'cog-outline';
          } else if (route.name === 'Chat Flow') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Analytics') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'Account') {
            iconName = focused ? 'person' : 'person-outline';
          }

          // Return the Ionicons component.
          return <Ionicons name={iconName} size={size} color={color} />;
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
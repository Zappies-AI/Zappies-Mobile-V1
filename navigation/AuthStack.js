// This file defines the navigation stack for the authentication flow.  

import React, { useContext } from 'react';  
import { createStackNavigator } from '@react-navigation/stack';  
import SignInScreen from '../screens/auth/SignInScreen';  
import SignUpScreen from '../screens/auth/SignUpScreen';  
import { ThemeContext } from '../context/ThemeContext';  

const AuthStack = createStackNavigator();  

export default function AuthStackScreens() {  
  const { theme } = useContext(ThemeContext);  
  return (  
    <AuthStack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: theme.background } }}>  
      <AuthStack.Screen name="SignIn" component={SignInScreen} />  
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />  
    </AuthStack.Navigator>  
  );  
}

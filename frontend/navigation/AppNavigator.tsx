import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import MapScreen from '../screens/MapScreen';
import TransitionScreen from '../screens/TransitionScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import AppDrawerNavigator from './AppDrawerNavigator';
import { useAuth } from '../context/AuthContext';

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Transition: undefined; 
  ForgotPassword: undefined;
  Drawer: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { isLoggedIn } = useAuth();

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Transition" component={TransitionScreen} />
          <Stack.Screen name="Drawer" component={AppDrawerNavigator} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

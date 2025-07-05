import React from 'react';
import AppNavigator from './navigation/AppNavigator';
import Toast from 'react-native-toast-message';
import 'react-native-gesture-handler';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
      <Toast />
    </>
  );
}
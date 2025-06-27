import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MapScreen from '../screens/MapScreen';
import SaveLocationScreen from '../screens/SaveLocationScreen';
import HistoryScreen from '../screens/HistoryScreen';

const Drawer = createDrawerNavigator();

export default function AppDrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#0b0033' },
        headerTintColor: '#fff',
        drawerStyle: { backgroundColor: '#0b0033' },
        drawerInactiveTintColor: '#aaa',
        drawerActiveTintColor: '#f24ce4',
        drawerLabelStyle: { fontWeight: 'bold' },
      }}
    >
      <Drawer.Screen name="Mapa en Vivo" component={MapScreen} />
      <Drawer.Screen name="Guardar Ubicación" component={SaveLocationScreen} />
      <Drawer.Screen name="Historial" component={HistoryScreen} />
    </Drawer.Navigator>
  );
}

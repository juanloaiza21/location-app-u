import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Alert, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text } from 'react-native';
import { RootStackParamList } from '../navigation/AppNavigator'; // Importas los tipos de ruta
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { Image } from 'react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useAuth } from '../context/AuthContext';

type DrawerParamList = {
  'Mapa en Vivo': undefined;
  'Guardar Ubicación': undefined;
  'Historial': undefined;
};

type NavigationProp = DrawerNavigationProp<DrawerParamList, 'Mapa en Vivo'>;


export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const navigation = useNavigation<NavigationProp>();
  const { logout } = useAuth();
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se necesita acceso a la ubicación.');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);

      intervalId = setInterval(async () => {
        let updatedLoc = await Location.getCurrentPositionAsync({});
        setLocation(updatedLoc);
      }, 10000);
    })();

    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => {
          logout();
          Toast.show({
          type: 'success',
          text1: 'Sesión cerrada',
          text2: 'Has cerrado sesión correctamente 👋',
          position: 'bottom',
          });
        }}

      >
        <MaterialIcons name="exit-to-app" size={24} color="#fff" />
      </TouchableOpacity>


      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Tu ubicación"
          >
            <Image
              source={require('../assets/weed-icon.png')}
              style={{ 
                width: 40,
                height: 40,
                shadowColor: '#f24ce4',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 10,
               }}
              resizeMode="contain"
            />
          </Marker>
          
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  logoutButton: {
  position: 'absolute',
  top: 50,
  right: 20,
  backgroundColor: '#f24ce4',
  padding: 10,
  borderRadius: 30,
  zIndex: 10,
  alignItems: 'center',
  justifyContent: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 5, // Android

  }
});

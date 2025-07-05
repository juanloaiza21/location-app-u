import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

export default function SaveLocationScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se necesita acceder a la ubicación.');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    })();
  }, []);

  const handleSaveLocation = async () => {
    if (!location) return;

    const newLocation = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      timestamp: new Date().toISOString(),
    };

    try {
      const stored = await AsyncStorage.getItem('locations');
      const locations = stored ? JSON.parse(stored) : [];
      locations.push(newLocation);
      await AsyncStorage.setItem('locations', JSON.stringify(locations));

      Toast.show({
        type: 'success',
        text1: 'Ubicación guardada 📍',
        text2: 'Se añadió al historial',
        position: 'bottom',
      });
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la ubicación.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Guardar ubicación actual</Text>
      <TouchableOpacity style={styles.button} onPress={handleSaveLocation}>
        <MaterialIcons name="save" size={24} color="#fff" />
        <Text style={styles.buttonText}>Guardar ubicación</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0033',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: '#f24ce4',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#f24ce4',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#f24ce4',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

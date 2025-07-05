import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { createGeofence } from '../api/geofence';
import { sendLocation } from '../api/locations';
import * as Device from 'expo-device'; // Para obtener el modelo del dispositivo

export default function SaveLocationScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [radius, setRadius] = useState('');

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

    await sendLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy ?? 0,
      deviceInfo: {
        model: Device.modelName ?? 'Unknown',
        os: `${Device.osName} ${Device.osVersion}`,
      },
    });
    
    console.log('📡 Ubicación enviada al servidor');
  } catch (error) {
    Alert.alert('Error', 'No se pudo guardar ni enviar la ubicación.');
    console.error('❌ Error al guardar o enviar ubicación:', error);
  }
};


  const handleCreateGeofence = async () => {
  if (!name || !latitude || !longitude || !radius) {
    Alert.alert('Campos incompletos', 'Por favor llena todos los campos.');
    return;
  }

  const payload = {
    name,
    centerLatitude: parseFloat(latitude),
    centerLongitude: parseFloat(longitude),
    radiusMeters: parseFloat(radius),
    isActive: true,
  };

  //console.log('📤 Payload que se envía al backend:', payload); // Aquí se imprime para debug

  try {
    await createGeofence(payload);

    Toast.show({
      type: 'success',
      text1: 'Geofence creada ✅',
      text2: 'Zona configurada en el servidor',
      position: 'bottom',
    });

    // Limpia los campos
    setName('');
    setLatitude('');
    setLongitude('');
    setRadius('');
  } catch (error) {
    Alert.alert('Error', 'No se pudo crear la geofence.');
    console.error('❌ Error al crear geofence:', error);
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuración de geofence</Text>

      <TextInput
        placeholder="Nombre de la zona"
        placeholderTextColor="#aaa"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Latitud"
        placeholderTextColor="#aaa"
        style={styles.input}
        keyboardType="numeric"
        value={latitude}
        onChangeText={setLatitude}
      />
      <TextInput
        placeholder="Longitud"
        placeholderTextColor="#aaa"
        style={styles.input}
        keyboardType="numeric"
        value={longitude}
        onChangeText={setLongitude}
      />
      <TextInput
        placeholder="Radio (metros)"
        placeholderTextColor="#aaa"
        style={styles.input}
        keyboardType="numeric"
        value={radius}
        onChangeText={setRadius}
      />

      {/* Botón para guardar localmente (sin cambios) */}
      <TouchableOpacity style={styles.button} onPress={handleSaveLocation}>
        <MaterialIcons name="save" size={24} color="#fff" />
        <Text style={styles.buttonText}>Guardar ubicación actual</Text>
      </TouchableOpacity>

      {/* Botón para crear geofence */}
      <TouchableOpacity
        style={[styles.button, { marginTop: 20 }]}
        onPress={handleCreateGeofence}
      >
        <MaterialIcons name="add-location-alt" size={24} color="#fff" />
        <Text style={styles.buttonText}>Crear geofence</Text>
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
  input: {
    width: '100%',
    backgroundColor: '#220044',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: '#f24ce4',
    borderWidth: 1,
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

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';

interface LocationData {
  latitude: number;
  longitude: number;
  timestamp: string;
}

export default function HistoryScreen() {
  const [locations, setLocations] = useState<LocationData[]>([]);

  const loadLocations = async () => {
    const stored = await AsyncStorage.getItem('locations');
    const parsed = stored ? JSON.parse(stored) : [];
    setLocations(parsed.reverse());
  };

  const deleteLocation = async (index: number) => {
    const updated = [...locations];
    updated.splice(index, 1);
    setLocations(updated.reverse());
    await AsyncStorage.setItem('locations', JSON.stringify(updated.reverse()));
  };

  const clearHistory = async () => {
    Alert.alert(
      '¿Borrar historial?',
      'Esta acción eliminará todas las ubicaciones guardadas.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('locations');
            setLocations([]);
          },
        },
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      loadLocations();
    }, [])
  );

  const renderRightActions = (index: number) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => deleteLocation(index)}
    >
      <MaterialIcons name="delete" size={24} color="#fff" />
    </TouchableOpacity>
  );

  const renderItem = ({ item, index }: { item: LocationData; index: number }) => (
    <Swipeable renderRightActions={() => renderRightActions(index)}>
      <View style={styles.item}>
        <MaterialIcons name="location-on" size={24} color="#f24ce4" />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.coords}>
            {item.latitude.toFixed(5)}, {item.longitude.toFixed(5)}
          </Text>
          <Text style={styles.timestamp}>
            {new Date(item.timestamp).toLocaleString()}
          </Text>
        </View>
      </View>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Historial de Ubicaciones</Text>
        {locations.length > 0 && (
          <TouchableOpacity onPress={clearHistory}>
            <MaterialIcons name="delete-forever" size={28} color="#f24ce4" />
          </TouchableOpacity>
        )}
      </View>

      {locations.length === 0 ? (
        <Text style={styles.emptyText}>Aún no hay ubicaciones guardadas</Text>
      ) : (
        <FlatList
          data={locations}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0033',
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#f24ce4',
    fontSize: 24,
    fontWeight: 'bold',
  },
  item: {
    flexDirection: 'row',
    backgroundColor: '#1a0044',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  coords: {
    color: '#fff',
    fontSize: 16,
  },
  timestamp: {
    color: '#aaa',
    fontSize: 12,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
  deleteButton: {
    backgroundColor: '#cc0033',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    borderRadius: 10,
    marginVertical: 5,
  },
});

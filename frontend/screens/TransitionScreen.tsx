import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Transition'>;

export default function TransitionScreen() {
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.replace('Drawer'); // Reemplaza 'Drawer' con el nombre de tu pantalla principal
    }, 2500); // 2.5 segundos
    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/transition.gif')} // o .png/.jpg
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0033',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

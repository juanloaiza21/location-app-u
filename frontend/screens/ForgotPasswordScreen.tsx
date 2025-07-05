import LottieView from 'lottie-react-native';
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>;

export default function ForgotPasswordScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const animationRef = useRef<LottieView>(null);

  const handleReset = () => {
    if (!email) {
      Alert.alert('Error', 'Por favor ingresa tu correo.');
      return;
    }
    Alert.alert('Éxito', `Se enviaron instrucciones a ${email}`);
  };

  return (
    <View style={styles.container}>
      <LottieView
        ref={animationRef}
        source={require('../assets/animations/forgot-password.json')}
        autoPlay
        loop
        style={styles.lottie}
      />

      <Text style={styles.title}>Recuperar contraseña</Text>
      <Text style={styles.subtitle}>
        Ingresa tu correo y te enviaremos instrucciones para restablecerla.
      </Text>

      <Text style={styles.label}>Correo electrónico</Text>
      <TextInput
        style={styles.input}
        placeholder="usuario@crudo.com"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleReset}>
        <Text style={styles.buttonText}>Enviar instrucciones</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.link}>Volver al inicio de sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0033',
    padding: 30,
    justifyContent: 'center',
  },
  lottie: {
    width: 180,
    height: 180,
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    color: '#f24ce4',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    color: '#aaa',
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    color: '#f24ce4',
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#f24ce4',
    borderRadius: 8,
    color: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    shadowColor: '#f24ce4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    backgroundColor: 'transparent',
  },
  button: {
    backgroundColor: '#f24ce4',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#f24ce4',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  link: {
    color: '#aaa',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

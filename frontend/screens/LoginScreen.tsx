import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { Alert } from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';


type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

    const handleLogin = () => {
    if (email === 'C' && password === '1') {
      login(); // 👈 Esto activa el Drawer
    } else {
      Alert.alert('Error', 'Credenciales incorrectas');
    }
  };

  return (
    <View style={styles.container}>
      {/* Imagen arriba */}
      <Image
        source={require('../assets/Crudo.png')} // Reemplaza con tu imagen
        style={styles.logo}
      />
      <Text style={styles.title}>:҉SmokeDrip:҉</Text>

      {/* Título */}
      <Text style={styles.signInText}>Sign In</Text>
      <Text style={styles.welcome}>Hi there! Nice to see you again</Text>

      {/* Email */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="RawMeansCrudo@email.com"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
      />

      {/* Contraseña */}
      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="••••••••"
          placeholderTextColor="#999"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <MaterialCommunityIcons
            name={showPassword ? 'eye-off' : 'eye'}
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      {/* Botón Sign In */}
      <TouchableOpacity
        style={styles.signInButton}
         onPress={handleLogin}
      >
        <Text style={styles.signInButtonText}>Sign in</Text>
      </TouchableOpacity>


      {/* Texto alternativo */}
      <Text style={styles.orText}>or use one of your social profiles</Text>

      {/* Redes sociales */}
      <View style={styles.socialRow}>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="google" size={20} color="#fff" />
          <Text style={styles.socialText}>Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="facebook" size={20} color="#fff" />
          <Text style={styles.socialText}>Facebook</Text>
        </TouchableOpacity>
      </View>

      {/* Enlaces de abajo */}
      <View style={styles.linksRow}>
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.link}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.linkBold}>Sign Up</Text>
        </TouchableOpacity>
      </View>
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
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    color: '#aaa',
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 30,
    fontWeight: '600',
  },
  signInText: {
    color: '#f24ce4',
    fontSize: 28,
    fontWeight: 'bold',
  },
  welcome: {
    color: '#aaa',
    marginBottom: 30,
  },
  label: {
    color: '#f24ce4',
    marginTop: 10,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#f24ce4',
    borderRadius: 8,
    color: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    shadowColor: '#f24ce4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    backgroundColor: 'transparent',
    },
  passwordContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
    marginBottom: 20,
  },
  passwordInput: {
    color: '#fff',
    flex: 1,
  },
  signInButton: {
    backgroundColor: '#f24ce4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#f24ce4',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  signInButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  orText: {
    textAlign: 'center',
    color: '#aaa',
    marginBottom: 10,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  socialButton: {
    backgroundColor: '#220055',
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    justifyContent: 'center',
  },
  socialText: {
    color: '#fff',
    marginLeft: 10,
  },
  linksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  link: {
    color: '#aaa',
  },
  linkBold: {
    color: '#f24ce4',
    fontWeight: 'bold',
  },
});

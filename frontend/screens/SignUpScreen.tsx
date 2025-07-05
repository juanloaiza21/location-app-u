import React, { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Alert } from 'react-native';
import { registerUser } from '../api/auth';

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';


type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation<NavigationProp>();
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/Crudo.png')}
        style={styles.logo}
      />
      <Text style={styles.signUpText}>Create Account</Text>
      <Text style={styles.welcome}>Join the app and start tracking</Text>

      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        placeholder="John Doe"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Phone number</Text>
      <TextInput
        style={styles.input}
        placeholder="123-456-7890"
        placeholderTextColor="#999"
        value={telephone}
        onChangeText={setTelephone}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="example@email.com"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
      />

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

      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        style={styles.input}
        placeholder="••••••••"
        placeholderTextColor="#999"
        secureTextEntry={!showPassword}
        value={confirm}
        onChangeText={setConfirm}
      />

      <TouchableOpacity
        style={styles.signUpButton}
        onPress={() => {
        if (password !== confirm) {
          alert('Passwords do not match');
          return;
        }
        registerUser({ name, email, password, telephone })
                .then(() => {
                  Alert.alert('Success', 'You can now log in with your credentials.');
                  navigation.navigate('Login');
                }).catch((error) => {
                  Alert.alert('Error', 'There was an error creating your account. Please try again later.')
                  console.error('Registration error:', error);
                });
        // Aquí luego irá la lógica con backend
        }}
      >
        <Text style={styles.signUpButtonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkBack}>Already have an account? Sign In</Text>
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
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 20,
  },
  signUpText: {
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
    marginBottom: 10,
  },
  passwordInput: {
    color: '#fff',
    flex: 1,
  },
  signUpButton: {
    backgroundColor: '#f24ce4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  signUpButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  linkBack: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
});

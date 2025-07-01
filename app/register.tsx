import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import CTAButton from '../components/CTAButton';

export default function Register() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleRegister = async () => {
    if (email === '1234' && password === '1234') {
      await AsyncStorage.setItem('userID', email);
      router.replace('/dashboard');
    } else {
      alert('Error de registro: Mail o contraseña incorrectos');
    }
  };

  return (
    <LinearGradient
      colors={['#020016', '#020016', '#6DFFD5']}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.gradient}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.header}>REGISTRATE</Text>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>NOMBRE:</Text>
              <TextInput
                style={styles.input}
                placeholderTextColor="#9AA"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>APELLIDO:</Text>
              <TextInput
                style={styles.input}
                placeholderTextColor="#9AA"
                value={surname}
                onChangeText={setSurname}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>MAIL:</Text>
              <TextInput
                style={styles.input}
                placeholderTextColor="#9AA"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>CONTRASEÑA:</Text>
              <TextInput
                style={styles.input}
                placeholderTextColor="#9AA"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <CTAButton label="REGISTRATE" onPress={handleRegister} />

            <Text style={styles.registerText}>
              Si tenés cuenta,{' '}
              <Text style={styles.link} onPress={() => router.push('/login')}>
                logueate!
              </Text>
            </Text>
          </View>

          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#02001A',
  },
  header: {
    color: '#CBFFEF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 32,
  },
  form: {
    alignItems: 'center',
    gap: 12,
  },
  field: {
    width: 300,
    alignSelf: 'center',
    marginBottom: 10,
  },
  label: {
    color: '#CBFFEF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  input: {
    borderWidth: 2,
    borderColor: '#CBFFEF',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
  },
  registerText: {
    marginTop: 16,
    textAlign: 'center',
    color: '#CBFFEF',
    fontSize: 13,
  },
  link: {
    color: '#6DFFD5',
    textDecorationLine: 'underline',
  },
  logoContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 40,
  },
});

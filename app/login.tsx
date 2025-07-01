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
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import CTAButton from '../components/CTAButton';
import IconButton from '../components/IconButton';

export default function Login() {
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

  const handleLogin = async () => {
    if (email === '1234' && password === '1234') {
      await AsyncStorage.setItem('userID', email);
      router.replace('/unlocked');
    } else {
      alert('Error de inicio de sesión: Mail o contraseña incorrectos');
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
          <Text style={styles.header}>INICIO DE SESIÓN</Text>

          <View style={styles.form}>
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

            <CTAButton label="INICIAR SESIÓN" onPress={handleLogin} />

            <IconButton
              label="Inicia sesión con Google"
              icon={require('../assets/google.png')}
              onPress={() => alert('Google Login')}
            />
            <IconButton
              label="Inicia sesión con Apple"
              icon={require('../assets/apple.png')}
              onPress={() => alert('Apple Login')}
            />

            <Text style={styles.registerText}>
              Si todavía no tenés cuenta,{' '}
              <Text style={styles.link} onPress={() => router.push('/register')}>
                registrate!
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
  },
  header: {
    color: '#CBFFEF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
    marginTop: 90, 
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

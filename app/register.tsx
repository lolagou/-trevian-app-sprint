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
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { LinearGradient } from 'expo-linear-gradient';
import CTAButton from '../components/CTAButton';
import IconButton from '../components/IconButton';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import { Pressable } from 'react-native';


export default function Register() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [fontsLoaded] = useFonts({
    'Onest-Medium': require('../assets/fonts/Onest-Medium.ttf'),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const isValidEmail = (v: string) => /\S+@\S+\.\S+/.test(v);

  const handleRegister = async () => {
    if (!name.trim() || !surname.trim() || !email.trim() || !password) {
      Alert.alert('Faltan datos', 'Completá nombre, apellido, mail y contraseña.');
      return;
    }
    if (!isValidEmail(email)) {
      Alert.alert('Email inválido', 'Revisá el formato del correo.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Contraseña corta', 'Mínimo 6 caracteres.');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch('https://trevian-server.vercel.app/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, surname, email, password }),
      });

      const data = await res.json().catch(() => ({} as any));
      if (!res.ok) {
        const msg = data?.message || data?.error || `Error ${res.status}`;
        throw new Error(msg);
      }

      // Guarda credenciales
      await SecureStore.setItemAsync('auth_token', data.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(data.data.user));

      Alert.alert('¡Listo!', data.message || 'Usuario registrado correctamente');
      router.replace('/dashboard');
    } catch (e: any) {
      Alert.alert('No pudimos registrarte', e?.message || 'Intentá de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#6DFFD5','#020016', '#020016','#020016', '#020016','#6DFFD5']}
      start={{ x: 1.3, y: 0 }}
      end={{ x: 0.005, y: 1 }}
      style={styles.gradient}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
  <Image
    source={require('../assets/Back.png')}
    style={{ width: 130, height: 40 }}
    resizeMode="contain"
  />
</Pressable>
          <Text style={styles.header}>REGISTRO</Text>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>NOMBRE:</Text>
              <TextInput
                style={styles.input}
                placeholderTextColor="#9AA"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>APELLIDO:</Text>
              <TextInput
                style={styles.input}
                placeholderTextColor="#9AA"
                value={surname}
                onChangeText={setSurname}
                autoCapitalize="words"
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
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.input, { borderWidth: 0, borderColor: 'transparent', flex: 1 }]}
                  placeholderTextColor="#9AA"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!passwordVisible}
                />
                <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.eyeIcon}>
                  <Ionicons
                    name={passwordVisible ? 'eye' : 'eye-off'}
                    size={22}
                    color="#CBFFEF"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <CTAButton label={loading ? 'Registrando...' : 'REGISTRARME'} onPress={handleRegister} />

            {loading && (
              <View style={{ marginTop: 10, alignItems: 'center' }}>
                <ActivityIndicator />
              </View>
            )}

            <View style={styles.LineContainer}>
              <Image
                source={require('../assets/linelogin.png')}
                style={{ width: 290, height: 30 }}
                resizeMode="contain"
              />
            </View>

            <IconButton
              label="Registrate con Google"
              icon={require('../assets/google.png')}
              onPress={() => Alert.alert('Próximamente', 'Google Sign-In aún no implementado')}
            />
            <IconButton
              label="Registrate con Apple"
              icon={require('../assets/apple.png')}
              onPress={() => Alert.alert('Próximamente', 'Apple Sign-In aún no implementado')}
            />

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
    backgroundColor: '#020016',
  },
  header: {
    color: '#CBFFEF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 32,
  },
  form: {
    alignItems: 'center',
    gap: 12, // si tu versión de RN no soporta 'gap', podés quitarlo
  },
  field: {
    width: 300,
    alignSelf: 'center',
    marginBottom: 5,
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
    padding: 8,
    color: '#fff',
    fontFamily: 'Onest-Medium', 
  },
  registerText: {
    marginTop: 16,
    textAlign: 'center',
    color: '#CBFFEF',
    fontSize: 13,
    fontFamily: 'Onest-Medium', 
  },
  link: {
    color: '#6DFFD5',
    textDecorationLine: 'underline',
  },
  logoContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 40,
  },
  LineContainer: {
    alignItems: 'center',
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#CBFFEF',
    borderRadius: 8,
    paddingRight: 8,
  },
  eyeIcon: {},
});

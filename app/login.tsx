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


const API_BASE = 'https://trevian-server.vercel.app';
const DEMO_MODE = false; // 🔁 ponelo en true si querés usar usuario/clave 1234


export default function Login() {
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
  }, [fadeAnim]);

  const isValidEmail = (v: string) => /\S+@\S+\.\S+/.test(v);

  const handleLogin = async () => {
    if (loading) return;

    // —— DEMO (opcional, igual a tu versión que “funcionaba perfecto”) ——
    if (DEMO_MODE) {
      if (email === '1234' && password === '1234') {
        await AsyncStorage.setItem('userID', '1234');
        router.replace('/unlocked');
      } else {
        Alert.alert('Error de inicio de sesión', 'Mail o contraseña incorrectos');
      }
      return;
    }

    // —— MODO API real ——
    if (!email.trim() || !password) {
      Alert.alert('Faltan datos', 'Completá mail y contraseña.');
      return;
    }
    if (!isValidEmail(email)) {
      Alert.alert('Email inválido', 'Revisá el formato del correo.');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const raw = await res.text(); // más robusto frente a respuestas vacías
      let data: any = {};
      try { data = raw ? JSON.parse(raw) : {}; } catch {}

      if (!res.ok) {
        const msg = data?.message || data?.error || `Error ${res.status}`;
        throw new Error(msg);
      }

      // — extraer token/usuario de forma segura —
      const token =
        data?.data?.token ??
        data?.token ??
        data?.access_token ??
        null;

      const user =
        data?.data?.user ??
        data?.user ??
        null;

      if (typeof token !== 'string' || token.length === 0) {
        // Evita setItem con undefined → “illegal arguments”
        console.log('LOGIN RAW:', raw);
        console.log('LOGIN JSON parseado:', data);
        throw new Error('La API no devolvió un token válido.');
      }

      // Guardar token: primero SecureStore (iOS/Android nativo),
      // si falla por cualquier motivo → AsyncStorage
      let saved = false;
      try {
        if (SecureStore?.setItemAsync) {
          await SecureStore.setItemAsync('auth_token', String(token));
          saved = true;
        }
      } catch (e) {
        console.warn('SecureStore falló, uso AsyncStorage:', e);
      }
      if (!saved) {
        await AsyncStorage.setItem('auth_token', String(token));
      }

      // Guardar user sólo si existe (evita JSON.stringify(undefined))
      if (user != null) {
        await AsyncStorage.setItem('user', JSON.stringify(user));
      }

      Alert.alert('¡Bienvenida!', data?.message || 'Inicio de sesión exitoso');
      router.replace('/unlocked');
    } catch (e: any) {
      console.error('LOGIN ERROR:', e);
      Alert.alert('No pudimos iniciar sesión', e?.message || 'Intentá de nuevo más tarde.');
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
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <Animated.View style={{ opacity: fadeAnim }}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
  <Image
    source={require('../assets/Back.png')}
    style={{ width: 130, height: 40 }}
    resizeMode="contain"
  />
</Pressable>
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
              <View style={styles.passwordRow}>
                <TextInput
                  style={styles.passwordInput}
                  placeholderTextColor="#9AA"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!passwordVisible}
                />
                <TouchableOpacity
                  onPress={() => setPasswordVisible(!passwordVisible)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={passwordVisible ? 'eye' : 'eye-off'}
                    size={22}
                    color="#CBFFEF"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ width: 300, opacity: loading ? 0.6 : 1 }}>
              <CTAButton
                label={loading ? 'Ingresando...' : 'INICIAR SESIÓN'}
                onPress={handleLogin}
              />
            </View>

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
              label="Inicia sesión con Google"
              icon={require('../assets/google.png')}
              onPress={() => Alert.alert('Próximamente', 'Google Sign-In aún no implementado')}
            />
            <IconButton
              label="Inicia sesión con Apple"
              icon={require('../assets/apple.png')}
              onPress={() => Alert.alert('Próximamente', 'Apple Sign-In aún no implementado')}
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
  gradient: { flex: 1, padding: 24, justifyContent: 'center' },
  header: {
    color: '#CBFFEF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
    marginTop: 90,
    
  },
  form: { alignItems: 'center', gap: 12 },
  field: { width: 300, alignSelf: 'center', marginBottom: 5 , fontFamily: 'Onest-Medium'},
  label: { color: '#CBFFEF', fontSize: 14, fontWeight: 'bold', marginBottom: 4},
  input: { borderWidth: 2, borderColor: '#CBFFEF', borderRadius: 8, padding: 8, color: '#fff', fontFamily: 'Onest-Medium' },
  registerText: { marginTop: 16, textAlign: 'center', color: '#CBFFEF', fontSize: 13, fontFamily: 'Onest-Medium' },
  link: { color: '#6DFFD5', textDecorationLine: 'underline',fontFamily: 'Onest-Medium', },
  logoContainer: { marginTop: 40, alignItems: 'center' },
  LineContainer: { alignItems: 'center' },
  logo: { width: 120, height: 40 },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 300,
    borderWidth: 2,
    borderColor: '#CBFFEF',
    borderRadius: 8,
    paddingRight: 8,
  },
  passwordInput: { flex: 1, padding: 8, color: '#fff' },
  eyeIcon: {},
});

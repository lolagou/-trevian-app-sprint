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
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [passwordVisible, setPasswordVisible] = useState(false);

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
        <Image
              source={require('../assets/Back.png')}
              style={{ width: 130, height: 40 }}
              resizeMode="contain"
            />
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


            <CTAButton label="INICIAR SESIÓN" onPress={handleLogin} />

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

  LineContainer: {
    alignItems: 'center',

  },
  logo: {
    width: 120,
    height: 40,
  },

  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 300, // mismo ancho que el de mail
    borderWidth: 2,
    borderColor: '#CBFFEF',
    borderRadius: 8,
    paddingRight: 8,
  },
  passwordInput: {
    flex: 1,
    padding: 8,
    color: '#fff',
  },

  eyeIcon: {

  },
  
});

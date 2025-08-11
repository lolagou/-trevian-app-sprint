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
import IconButton from '../components/IconButton';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

export default function Register() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
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
          <Text style={styles.header}>REGISTRO</Text>

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
  <View style={styles.passwordRow}>
    <TextInput
      style={[styles.input, { borderWidth: 0, borderColor: 'transparent',flex: 1  }]}
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


            <CTAButton label="REGISTRARME" onPress={handleRegister} />

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
              onPress={() => alert('Google Login')}
            />
            <IconButton
              label="Registrate con Apple"
              icon={require('../assets/apple.png')}
              onPress={() => alert('Apple Login')}
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
  eyeIcon: {
    paddingHorizontal: 6,
    paddingVertical: 8,
  },

});

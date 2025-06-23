import {
    View,
    Text,
    TextInput,
    Pressable,
    Alert,
    StyleSheet,
    Animated,
    Image,
  } from 'react-native';
  import React, { useEffect, useRef, useState } from 'react';
  import { useRouter } from 'expo-router';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import { LinearGradient } from 'expo-linear-gradient';
  
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
        router.replace('/dashboard');
      } else {
        Alert.alert('Error de inicio de sesión', 'Mail o contraseña incorrectos');
      }
    };
  
    return (
      <LinearGradient
        colors={['#030026', '#030026', '#6DFFD5']}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.header}>INICIO DE SESIÓN</Text>
  
          <View style={styles.form}>
            <Text style={styles.label}>MAIL:</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor="#9AA"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
  
            <Text style={styles.label}>CONTRASEÑA:</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor="#9AA"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
  
            <Pressable style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>INICIAR SESIÓN</Text>
            </Pressable>
  
            <Pressable style={styles.altButton} onPress={() => Alert.alert('Google')}>
              <Text style={styles.altButtonText}>Inicia sesión con Google</Text>
            </Pressable>
  
            <Pressable style={styles.altButton} onPress={() => Alert.alert('Apple')}>
              <Text style={styles.altButtonText}>Inicia sesión con Apple</Text>
            </Pressable>
  
            <Text style={styles.registerText}>
              Si todavía no tenés cuenta, <Text style={styles.link}>registrate!</Text>
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
      </LinearGradient>
    );
  }
  
  const styles = StyleSheet.create({
    gradient: {
      flex: 1,
      padding: 24,
      justifyContent: 'center',
      backgroundColor: '#02001A', // fallback
    },
    header: {
      color: '#CBFFEF',
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 32,
    },
    form: {
      gap: 12,
    },
    label: {
      color: '#CBFFEF',
      fontSize: 14,
      marginBottom: 4,
    },
    input: {
      borderWidth: 1,
      borderColor: '#CBFFEF',
      borderRadius: 12,
      padding: 12,
      color: '#fff',
      marginBottom: 16,
    },
    loginButton: {
      backgroundColor: '#6DFFD5',
      paddingVertical: 14,
      borderRadius: 12,
      marginTop: 8,
    },
    loginButtonText: {
      textAlign: 'center',
      color: '#000',
      fontWeight: 'bold',
      fontSize: 16,
    },
    altButton: {
      backgroundColor: '#CBFFEF',
      paddingVertical: 12,
      borderRadius: 12,
      marginTop: 10,
    },
    altButtonText: {
      textAlign: 'center',
      color: '#000',
      fontWeight: '500',
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
      fontWeight: 'bold',
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
  
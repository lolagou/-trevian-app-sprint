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
  
  export default function Register() {
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
        Alert.alert('Error de registro', 'Mail o contraseña incorrectos');
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
          <Text style={styles.header}>REGISTRATE</Text>
  
          <View style={styles.form}>
            <Text style={styles.label}>NOMBRE:</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor="#9AA"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
  
            <Text style={styles.label}>APELLIDO:</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor="#9AA"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

<Text style={styles.label}>MAIL:</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor="#9AA"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

<Text style={styles.label}>CONTRASEÑA:</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor="#9AA"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
  
            <Pressable style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.registerButtonText}>REGISTRATE</Text>
            </Pressable>

  
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
      fontWeight: 'bold',
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
    registerButton: {
      backgroundColor: '#6DFFD5',
      paddingVertical: 14,
      borderRadius: 12,
      marginTop: 8,
    },
    registerButtonText: {
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
  
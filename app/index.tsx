import { View, Image, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useRef, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InsoleModel from '../components/InsoleModel'; 

export default function Home() {
  const router = useRouter();
  const [show3DModel, setShow3DModel] = useState(false);

  const fadeAnimLogo = useRef(new Animated.Value(0)).current;
  const translateYLogo = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Animar entrada del logo
    Animated.parallel([
      Animated.timing(fadeAnimLogo, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(translateYLogo, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Mostrar modelo 3D después de 2s
    const modelTimeout = setTimeout(() => {
      setShow3DModel(true);
    }, 2000);

    // Redirección después de 5s
    const redirectTimeout = setTimeout(async () => {
      const userId = await AsyncStorage.getItem('userID');
      router.replace(userId ? '/dashboard' : '/login');
    }, 5000);

    return () => {
      clearTimeout(modelTimeout);
      clearTimeout(redirectTimeout);
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Logo Trevian centrado */}
      {!show3DModel && (
        <Animated.View style={{ opacity: fadeAnimLogo, transform: [{ translateY: translateYLogo }] }}>
          <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        </Animated.View>
      )}

      {/* Modelo 3D entrando desde abajo */}
      {show3DModel && (
        <View style={styles.modelContainer}>
          <InsoleModel />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05003F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 140,
    height: 140,
  },
  modelContainer: {
    position: 'absolute',
    bottom: 0,
    top: 0,
    width: '100%',
    height: '100%',
  },
});

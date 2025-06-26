import { View, Text, Pressable, Image, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useRef, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Animaciones
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    Animated.timing(translateY, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Lógica de redirección tras 3s
    const timer = setTimeout(async () => {
      const userId = await AsyncStorage.getItem('userID');
      if (userId) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY }] }}>
        <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#030026', justifyContent: 'center', alignItems: 'center' },
  logo: { width: 120, height: 120, marginBottom: 16 },
  title: { color: '#CBFFEF', fontSize: 28, fontWeight: '600' },
});

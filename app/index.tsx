import { View, Text, Pressable, Image, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useRef, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    const checkUserID = async () => {
      const userId = await AsyncStorage.getItem('userID');
      if (userId) {
        router.replace('/dashboard'); // ir directo al dashboard si ya está logueado
      } else {
        setLoading(false); // mostrar botón si no hay sesión
      }
    };

    checkUserID();
  }, []);

  if (loading) return null;

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY }] }}>
        <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Trevian</Text>
        <View style={styles.heroBox} />
        <View style={styles.card}>
          <View style={styles.barLarge} />
          {[...Array(3)].map((_, i) => (
            <View key={i} style={styles.barSmall} />
          ))}
        </View>
      </Animated.View>

      <Pressable style={styles.button} onPress={() => router.push('/login')}>
        <Text style={styles.buttonText}>Empezar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#030026', padding: 24, justifyContent: 'space-between' },
  logo: { width: 48, height: 48, marginBottom: 16 },
  title: { color: '#CBFFEF', fontSize: 24, fontWeight: '600' },
  heroBox: { backgroundColor: '#CBFFEF', height: 192, borderRadius: 12, marginTop: 32 },
  card: { backgroundColor: '#05003F', borderRadius: 16, padding: 24, marginTop: 24 },
  barLarge: { backgroundColor: '#CBFFEF', height: 20, width: 160, borderRadius: 6, marginBottom: 12 },
  barSmall: { backgroundColor: '#CBFFEF', height: 12, borderRadius: 6, marginBottom: 8 },
  button: { backgroundColor: '#6DFFD5', padding: 20, borderRadius: 16 },
  buttonText: { textAlign: 'center', fontWeight: 'bold', color: '#000' },
});

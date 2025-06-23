import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Dashboard() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    const fetchID = async () => {
      const id = await AsyncStorage.getItem('userID');
      setUserId(id);
    };

    fetchID();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userID');
    router.replace('/login'); // volver al login al cerrar sesión
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.title}>¡Hola, {userId || 'Paciente'}!</Text>

      <View style={styles.card}>
        <Pressable style={styles.button} onPress={() => router.push('/scan')}>
          <Text style={styles.buttonText}>Iniciar escaneo</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={() => router.push('/result')}>
          <Text style={styles.buttonText}>Ver resultados</Text>
        </Pressable>

        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#030026', justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 22, color: '#CBFFEF', marginBottom: 32 },
  card: { width: '100%', backgroundColor: '#05003F', padding: 24, borderRadius: 16, alignItems: 'center', gap: 16 },
  button: {
    backgroundColor: '#6DFFD5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
  },
  buttonText: { color: '#000', fontWeight: 'bold', textAlign: 'center' },
  logoutButton: {
    borderWidth: 1,
    borderColor: '#CBFFEF',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
  },
  logoutText: { color: '#CBFFEF', textAlign: 'center' },
});

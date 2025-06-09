// app/scan.tsx
import { View, Text, Pressable, Alert, StyleSheet, Animated, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';

// Módulo nativo de captura de objetos (LiDAR)
import { ObjectCaptureModule } from '../nativeModules/ObjectCaptureModule';

export default function Scan() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleScan = async () => {
    try {
      if (Platform.OS === 'ios') {
        const filePath = await ObjectCaptureModule.startObjectCapture();
        router.push({ pathname: '/result', params: { filePath } });
      } else {
        Alert.alert('Error', 'Esta función solo está disponible en iOS.');
      }
    } catch (err) {
      console.error('Error de captura:', err);
      Alert.alert('Error', 'Ocurrió un problema al capturar el objeto.');
    }
  };

  const goToHome = () => {
    router.push('/');
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.progressBarContainer}>
        <Pressable style={styles.checkbox} onPress={goToHome} />
        <View style={styles.progressText} />
      </View>
      <View style={styles.progressBarTrack}>
        <View style={styles.progressBarFill} />
      </View>
      <View style={styles.card}>
        <View style={styles.imagePlaceholder}>
          <Text style={styles.placeholderText}>[ Imagen del objeto escaneado ]</Text>
        </View>
        <View style={styles.barLarge} />
        <View style={styles.barSmall} />
        <Pressable style={styles.button} onPress={handleScan}>
          <Text style={styles.buttonText}>Abrir Cámara</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#030026', padding: 24 },
  progressBarContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  checkbox: { width: 20, height: 20, borderWidth: 1, borderColor: '#CBFFEF', borderRadius: 4 },
  progressText: { height: 12, width: '80%', backgroundColor: '#CBFFEF', borderRadius: 6 },
  progressBarTrack: { height: 4, backgroundColor: '#05003F' },
  progressBarFill: { height: 4, width: '33%', backgroundColor: '#6DFFD5' },
  card: { backgroundColor: '#05003F', marginTop: 32, padding: 16, borderRadius: 16 },
  imagePlaceholder: {
    borderColor: '#CBFFEF',
    borderWidth: 1,
    borderRadius: 12,
    padding: 24,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: { color: '#CBFFEF', textAlign: 'center' },
  barLarge: { backgroundColor: '#CBFFEF', height: 16, borderRadius: 6, marginTop: 24, marginBottom: 8 },
  barSmall: { backgroundColor: '#CBFFEF', height: 12, borderRadius: 6, marginBottom: 16, width: '66%' },
  button: { backgroundColor: '#6DFFD5', padding: 12, borderRadius: 12 },
  buttonText: { textAlign: 'center', fontWeight: 'bold', color: '#000' },
});

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ObjectCaptureModule } from '../nativeModules/ObjectCaptureModule';
import DashboardButton from '../components/DashboardButton';
import CTAButton from '../components/CTAButton';

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
        console.log('Archivo capturado en:', filePath);
        router.push({ pathname: '/result', params: { filePath } });
      } else {
        Alert.alert('Función no disponible', 'Solo funciona en iPhones con LiDAR');
      }
    } catch (err) {
      console.error('Error de captura:', err);
      Alert.alert('Error', 'Ocurrió un problema al capturar el objeto.');
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Botón reutilizable para volver */}
      <DashboardButton onPress={() => router.push('/dashboard')} />

      {/* Barra de progreso visual */}
      <View style={styles.topBar} />

      {/* Marco para captura */}
      <View style={styles.captureFrame} />

      {/* Botón reutilizable */}
      <CTAButton label="CONTINUAR" onPress={handleScan} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020016',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topBar: {
    marginTop: 60,
    width: '60%',
    height: 16,
    borderRadius: 8,
    backgroundColor: '#8D9DA6',
  },
  captureFrame: {
    flex: 1,
    width: '100%',
    borderWidth: 2,
    borderColor: '#CBFFEF',
    borderRadius: 10,
    marginVertical: 40,
  },
});

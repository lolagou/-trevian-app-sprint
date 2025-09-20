// app/scan.tsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  Alert,
  StyleSheet,
  Animated,
  Platform,
  NativeModules,
} from 'react-native';
import { useRouter } from 'expo-router';

type ObjectCaptureModuleType = {
  /** Devuelve 'file:///.../model-xxxx.usdz' cuando termina (.processingComplete) */
  startObjectCapture(): Promise<string>;
};

// Tipado de NativeModules
const { ObjectCaptureModule } = NativeModules as {
  ObjectCaptureModule?: ObjectCaptureModuleType;
};

export default function Scan() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleScan = async () => {
    try {
      if (Platform.OS !== 'ios') {
        Alert.alert('Función no disponible', 'Solo funciona en iPhones con LiDAR.');
        return;
      }
      if (!ObjectCaptureModule?.startObjectCapture) {
        Alert.alert('Módulo no disponible', 'ObjectCaptureModule no está enlazado.');
        return;
      }

      // ✅ Espera la Promise que resuelve con la URI del .usdz
      const uri = await ObjectCaptureModule.startObjectCapture(); // p.ej. 'file:///.../model.usdz'

      // ✅ Navega a /result pasando el filePath
      router.push({ pathname: '/result', params: { filePath: uri } });
    } catch (err: any) {
      console.error('Error de captura:', err);
      Alert.alert('Error', err?.message ?? 'Ocurrió un problema al capturar el objeto.');
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.topBar} />
      <View style={styles.captureFrame} />
      <Pressable style={styles.button} onPress={handleScan}>
        <Text style={styles.buttonText}>CONTINUAR</Text>
      </Pressable>
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
  button: {
    backgroundColor: '#6DFFD5',
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 12,
    marginBottom: 40,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#020016',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

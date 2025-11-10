// app/scan.tsx (o donde tengas tu Scan actual)
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  Animated,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ObjectCaptureModule } from '../nativeModules/ObjectCaptureModule';
import CTAButton from '../components/CTAButton';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { uploadFootModel } from '../lib/uploadFootModel';

export default function Scan() {
  const router = useRouter();
  const { side = 'right' } = useLocalSearchParams<{ side?: 'right' | 'left' }>();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleScan = async () => {
    try {
      if (Platform.OS !== 'ios') {
        Alert.alert('Función no disponible', 'Solo funciona en iPhones con LiDAR');
        return;
      }

      setLoading(true);

      // 1) Escanear con LiDAR
      const filePath = await ObjectCaptureModule.startObjectCapture();
      console.log('Archivo capturado en:', filePath);

      // 2) Subir al backend (Supabase)
      const { publicUrl, storagePath } = await uploadFootModel(
        filePath,
        side === 'right' ? 'right' : 'left'
      );
      console.log('Subido a:', storagePath, publicUrl);

      // 3) Navegar según el pie
      if (side === 'right') {
        // ya subimos pie derecho → ir a pantalla de "escaneá el izquierdo"
        router.push('/EscaneoPieIzquierdoIntro');
      } else {
        // ya subimos pie izquierdo → ir a pantalla loader "analizando"
        router.push('/AnalizandoModelo');
      }
    } catch (err: any) {
      console.error('Error en escaneo/subida:', err);
      Alert.alert('Error', err?.message ?? 'Ocurrió un problema al capturar o guardar el modelo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Botón para volver al Dashboard */}
      <TouchableOpacity
        onPress={() => router.push('/dashboard')}
        style={styles.dashboardButton}
      >
        <View style={styles.iconContainer}>
          <FontAwesome6 name="user-large" size={20} color="#CBFFEF" />
        </View>
      </TouchableOpacity>

      <View style={styles.topBar} />
      <View style={styles.captureFrame} />

      {loading && (
        <View style={{ alignItems: 'center', marginBottom: 16 }}>
          <ActivityIndicator color="#6DFFD5" />
          <Text style={{ color: '#CBFFEF', marginTop: 8 }}>
            {side === 'right'
              ? 'Subiendo modelo del pie derecho…'
              : 'Subiendo modelo del pie izquierdo…'}
          </Text>
        </View>
      )}

      <CTAButton
        label="CONTINUAR"
        onPress={handleScan}
      />
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
  dashboardButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    shadowOpacity: 0.9,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    elevation: 5,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#6DFFD5',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#020016',
  },
  topBar: {
    marginTop: 100,
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

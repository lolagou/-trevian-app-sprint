// app/scan.tsx
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { ObjectCaptureModule } from '../nativeModules/ObjectCaptureModule';
import CTAButton from '../components/CTAButton';
import { uploadFootModelToDrive } from '../lib/uploadFootModel';

export default function Scan() {
  const router = useRouter();
  const { side = 'right', jobId: jobIdParam } = useLocalSearchParams<{
    side?: 'right' | 'left';
    jobId?: string;
  }>();

  // jobId estable para derecho+izquierdo
  const jobIdRef = useRef<string>(
    typeof jobIdParam === 'string' && jobIdParam.length
      ? jobIdParam
      : String(Date.now())
  );

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(true);

  const [userName, setUserName] = useState<string>('SIN_NOMBRE');

  // 🧠 Cargar nombre de usuario (si lo tenés guardado)
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('userName');
        if (stored) {
          setUserName(stored);
        }
      } catch (e) {
        console.warn('No se pudo leer userName de AsyncStorage', e);
      }
    })();
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleScan = async () => {
    try {
      if (Platform.OS !== 'ios') {
        Alert.alert('Función no disponible', 'Solo funciona en iPhones con LiDAR');
        return;
      }
      if (loading) return;
      setLoading(true);

      // 1) Escanear → file://...
      const filePath = await ObjectCaptureModule.startObjectCapture();
      if (!filePath) {
        throw new Error('El escaneo fue cancelado.');
      }
      console.log('📍 Archivo capturado:', filePath);

      // 2) Subir a Drive vía backend (Service Account)
      const driveRes = await uploadFootModelToDrive(
        filePath,
        side === 'right' ? 'right' : 'left',
        {
          jobId: jobIdRef.current,
          userName, // 👈 se lo mandás al backend
        }
      );

      console.log('⬆ Subido a Drive:', driveRes);

      // 3) Flujo de navegación
      if (side === 'right') {
        // ahora escaneo pie izquierdo
        router.replace({
          pathname: '/pieizquierdo',
          params: { jobId: jobIdRef.current, side: 'left' },
        });
      } else {
        // ya tengo ambos → voy al loader de IA
        router.replace({
          pathname: '/finaloader',
          params: { jobId: jobIdRef.current },
        });
      }
    } catch (err: any) {
      console.error('Error en escaneo/subida:', err);
      Alert.alert(
        'Error',
        err?.message ?? 'Ocurrió un problema al capturar o guardar el modelo.'
      );
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Volver a dashboard */}
      <TouchableOpacity onPress={() => router.push('/dashboard')} style={styles.dashboardButton}>
        <View style={styles.iconContainer}>
          <FontAwesome6 name="user-large" size={20} color="#CBFFEF" />
        </View>
      </TouchableOpacity>

      {/* UI de guía */}
      <View style={styles.topBar} />
      <View style={styles.captureFrame} />

      {/* Estado de subida */}
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

      {/* Botón principal */}
      <TouchableOpacity activeOpacity={loading ? 1 : 0.7} disabled={loading}>
        <CTAButton
          label={loading ? 'SUBIENDO…' : 'CONTINUAR'}
          onPress={handleScan}
        />
      </TouchableOpacity>
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

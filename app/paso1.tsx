import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  Animated,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ObjectCaptureModule } from '../nativeModules/ObjectCaptureModule';
import CTAButton from '../components/CTAButton';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function Scan() {
  const router = useRouter();
  const { side = 'right' } = useLocalSearchParams<{ side?: 'right' | 'left' }>();
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

        router.push({
          pathname: '/resulton',
          params: { filePath, side },
        });
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

      <CTAButton label="IR A PAGO" onPress={() => router.push('/pago')} />

      <CTAButton
        label={`CONTINUAR (${side === 'right' ? 'pie derecho' : 'pie izquierdo'})`}
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

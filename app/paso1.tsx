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
          pathname: '/result',
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
  <View style={styles.iconCircle}>
    <FontAwesome6 name="user-large" size={15} color="#CBFFEF" />
  </View>
</View>
      </TouchableOpacity>

      <Text style={styles.title}>ESCANEANDO TU PIE</Text>
      <View style={styles.captureFrame} />


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
    marginVertical: 100,
  },
  iconContainer: {
    position: "absolute",
    top: 10,           // separarlo del borde superior
    left: 294, 
  },
  iconCircle: {
    width: 40,                 // tamaño del círculo
    height: 40,
    borderRadius: 60,           // círculo perfecto
    borderWidth: 1,
    borderColor: '#6DFFD5',     // borde verde como en la imagen
    backgroundColor: 'rgba(109,255,213,0.12)', // relleno celestito suave
    alignItems: 'center',
    justifyContent: 'center',
    // glow sutil
    shadowColor: '#6DFFD5',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  title: {
    position: 'absolute',
    top: 90,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
});

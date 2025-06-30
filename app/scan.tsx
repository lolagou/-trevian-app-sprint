import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  Alert,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
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

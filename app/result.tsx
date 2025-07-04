import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  Animated,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import DashboardButton from '../components/DashboardButton';
import CTAButton from '../components/CTAButton';
import OutlineButton from '../components/OutlineButton';

export default function Result() {
  const { filePath } = useLocalSearchParams();
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleUpload = async () => {
    try {
      if (!filePath) {
        Alert.alert('Error', 'No hay archivo para subir');
        return;
      }
  
      const formData = new FormData();
  
      formData.append('file', {
        uri: filePath as string,
        name: 'scan.usdz',
        type: 'model/vnd.usdz+zip',
      } as any);
  
      const response = await fetch('https://trevian-server.vercel.app/api/model/upload', { 
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (!response.ok) {
        throw new Error('Falló la carga del archivo');
      }
  
      const json = await response.json();
      const modelURL = json.url; // ✅ Acá recibís la URL
  
      // 👇 Navegar a la nueva pantalla
      router.push({
        pathname: '/modelready',
        params: { modelURL },
      });
  
    } catch (error) {
      console.error('❌ Error de conexión:', error);
      Alert.alert('Error', 'No se pudo subir el archivo');
    }
  };  
  

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <DashboardButton onPress={() => router.push('/dashboard')} />
      



      <View style={styles.card}>
        <Text style={styles.title}>Archivo escaneado listo</Text>
        <View style={styles.fileBox}>
          <Text style={styles.label}>Ruta del archivo:</Text>
          <Text style={styles.filePath}>
            {filePath ? (filePath as string) : 'No hay archivo'}
          </Text>
        </View>

        <View style={styles.actions}>
          <OutlineButton label="VOLVER A ESCANEAR" onPress={() => router.push('/scan')}/>
          <CTAButton label="ENVIAR" onPress={handleUpload} />
          <CTAButton label="PROBAR MODELREADY" onPress={() => router.push('/modelready')} />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020016',
    padding: 24,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 40,
    marginBottom: 8,
  },
  progressText: {
    height: 12,
    width: '80%',
    backgroundColor: '#CBFFEF',
    borderRadius: 6,
  },
  card: {
    backgroundColor: '#020016',
    marginTop: 40,
    padding: 20,
    borderRadius: 20,
  },
  title: {
    color: '#CBFFEF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  fileBox: {
    borderWidth: 1,
    borderColor: '#CBFFEF',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#020016',
  },
  label: {
    color: '#CBFFEF',
    fontSize: 12,
  },
  filePath: {
    color: '#fff',
    marginTop: 8,
    fontSize: 12,
  },
  actions: {
    flexDirection: 'column',
    gap: 12,
    marginTop: 24,
  },
});

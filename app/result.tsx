// app/result.tsx
import { View, Text, Pressable, Alert, StyleSheet, Animated } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';

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
      const response = await fetch('https://trevian-server.vercel.app', {
        method: 'GET',
      });

      const text = await response.text();

      if (response.ok) {
        Alert.alert('Servidor activo', text);
      } else {
        Alert.alert('Error', 'El servidor no respondió correctamente');
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      Alert.alert('Error', 'No se pudo conectar al servidor');
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.progressBarContainer}>
        <Pressable style={styles.checkbox} onPress={() => router.push('/')} />
        <View style={styles.progressText} />
      </View>
      <View style={styles.progressBarTrack}>
        <View style={styles.progressBarFill} />
      </View>
      <View style={styles.card}>
        <View style={styles.fileBox}>
          <Text style={styles.label}>Archivo escaneado listo para subir:</Text>
          <Text style={styles.filePath}>{filePath ? (filePath as string) : 'No hay archivo'}</Text>
        </View>
        <View style={styles.actions}>
          <Pressable style={styles.cancelButton} onPress={() => router.push('/scan')}>
            <Text style={styles.cancelText}>Volver</Text>
          </Pressable>
          <Pressable style={styles.confirmButton} onPress={handleUpload}>
            <Text style={styles.confirmText}>Probar servidor</Text>
          </Pressable>
        </View>
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
  progressBarFill: { height: 4, width: '100%', backgroundColor: '#6DFFD5' },
  card: { backgroundColor: '#05003F', marginTop: 32, padding: 16, borderRadius: 16 },
  fileBox: { borderWidth: 1, borderColor: '#CBFFEF', borderRadius: 12, padding: 16 },
  label: { color: '#CBFFEF', fontSize: 12 },
  filePath: { color: '#fff', marginTop: 8 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 24 },
  cancelButton: { borderWidth: 1, borderColor: '#CBFFEF', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 12 },
  cancelText: { color: '#CBFFEF' },
  confirmButton: { backgroundColor: '#6DFFD5', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 12 },
  confirmText: { color: '#000', fontWeight: 'bold' },
});

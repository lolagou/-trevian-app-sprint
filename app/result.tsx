
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { uploadFootModelToDrive } from '../lib/uploadFootModel'; // 👈 NUEVO

export default function Result() {
  const router = useRouter();
  const { filePath, side = 'right', jobId } = useLocalSearchParams<{
    filePath?: string;
    side?: 'right' | 'left';
    jobId?: string; // opcional
  }>();

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        if (!filePath) throw new Error('Falta filePath en params');
        const currentJobId = jobId || String(Date.now());

        // 🚀 Subida a Drive
        const driveRes = await uploadFootModelToDrive(
          filePath,
          side === 'left' ? 'left' : 'right',
          { jobId: currentJobId }
        );
        console.log('Subido a Drive:', driveRes);

        // 👉 Redirección según el pie
        if (side === 'right') {
          router.replace({ pathname: '/pieizquierdo', params: { jobId: currentJobId } });
        } else {
          router.replace({ pathname: '/finaloader', params: { jobId: currentJobId } });
        }
      } catch (e: any) {
        const msg = e?.message ?? 'Error al subir el modelo';
        setError(msg);
        Alert.alert('Error', msg);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#6DFFD5" />
      <Text style={styles.text}>
        {side === 'right'
          ? 'Guardando el modelo de tu pie derecho…'
          : 'Guardando el modelo de tu pie izquierdo…'}
      </Text>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020016',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  text: {
    marginTop: 16,
    color: '#D2FFF2',
    fontSize: 16,
    textAlign: 'center',
  },
  error: {
    marginTop: 8,
    color: 'tomato',
    textAlign: 'center',
    fontSize: 13,
  },
});

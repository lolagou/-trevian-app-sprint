
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { uploadFootModel } from '../lib/uploadFootModel';

export default function Result() {
  const router = useRouter();
  const { filePath, side = 'right' } = useLocalSearchParams<{
    filePath?: string;
    side?: 'right' | 'left';
  }>();

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        if (!filePath) {
          throw new Error('Falta filePath en params');
        }

        // 👣 SUBIDA A SUPABASE
        await uploadFootModel(filePath as string, side === 'left' ? 'left' : 'right');

        // ✔️ Decidir siguiente pantalla
        if (side === 'right') {
          // después del pie derecho → intro pie izquierdo
          router.replace('/pieizquierdo');
        } else {
          // después del pie izquierdo → loader analizando
          router.replace('/finaloader');
        }
      } catch (e: any) {
        console.log(e);
        const msg = e?.message ?? 'Error al subir el modelo';
        setError(msg);
        Alert.alert('Error', msg);
      }
    };

    run();
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

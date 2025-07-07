import { View, Text, StyleSheet, Button, Alert, ActivityIndicator } from 'react-native';
import { NativeModules } from 'react-native';
import React, { useEffect, useState } from 'react';

const { ModelPreviewModule } = NativeModules;

export default function ModelReadyScreen() {
  const [modelPath, setModelPath] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModelPath = async () => {
      try {
        const path = await ModelPreviewModule.getLastGeneratedPath();
        setModelPath(path);
      } catch (e) {
        console.warn('No se pudo obtener la ruta del modelo');
        Alert.alert('Error', 'No se pudo cargar el modelo generado.');
      } finally {
        setLoading(false);
      }
    };

    fetchModelPath();
  }, []);

  const handleViewModel = () => {
    if (modelPath) {
      ModelPreviewModule.showModelPreview(modelPath);
    } else {
      Alert.alert('Modelo no disponible', 'No se encontró la ruta del modelo generado.');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6DFFD5" />
        <Text style={styles.loadingText}>Cargando modelo 3D...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Tu modelo está listo!</Text>
      <Text style={styles.subtitle}>Ingresá tu domicilio para continuar.</Text>

      <Button title="Ver modelo en 3D" onPress={handleViewModel} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#020016',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 22,
    color: '#CBFFEF',
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6DFFD5',
    marginBottom: 24,
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#CBFFEF',
  },
});

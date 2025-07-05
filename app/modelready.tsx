import { View, Text, StyleSheet, Button } from 'react-native';
import { NativeModules } from 'react-native';
import React, { useEffect, useState } from 'react';

const { ModelPreviewModule } = NativeModules;

export default function ModelReadyScreen() {
  const [modelPath, setModelPath] = useState<string | null>(null);

  useEffect(() => {
    const fetchModelPath = async () => {
      try {
        const path = await ModelPreviewModule.getLastGeneratedPath();
        setModelPath(path);
      } catch (e) {
        console.warn('No se pudo obtener la ruta del modelo');
      }
    };

    fetchModelPath();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Tu modelo está listo!</Text>
      <Text style={styles.subtitle}>Ingresá tu domicilio para continuar.</Text>

      <Button
        title="Ver modelo en 3D"
        onPress={() => {
          if (modelPath) {
            ModelPreviewModule.showModelPreview(modelPath);
          } else {
            alert('No se encontró la ruta del modelo generado.');
          }
        }}
      />
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
    fontSize: 20,
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
});

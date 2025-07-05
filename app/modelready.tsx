import { View, Text, StyleSheet, Button } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { NativeModules } from 'react-native';
import React from 'react';


const { ModelPreviewModule } = NativeModules;

export default function ModelReadyScreen() {
  const { filePath } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Tu modelo está listo!</Text>
      <Text style={styles.subtitle}>Ingresá tu domicilio para continuar.</Text>

      <Button
        title="Ver modelo en 3D"
        onPress={() => {
          if (filePath) {
            ModelPreviewModule.showModelPreview(filePath);
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

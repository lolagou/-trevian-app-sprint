import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function ModelReady() {
  const { modelURL } = useLocalSearchParams(); // opcional: recibir la URL

  return (
    <View style={styles.container}>

      <Text style={styles.title}>¡Tu modelo ya está hecho!</Text>
      <Text style={styles.subtitle}>Ingresá tu domicilio para recibirlo:</Text>

      {/* Podés mostrar la URL si querés */}
      {modelURL && (
        <Text selectable style={styles.url}>{modelURL}</Text>
      )}

      {/* Podés poner acá un formulario de dirección */}
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
  url: {
    fontSize: 12,
    color: '#999',
    marginTop: 10,
    textAlign: 'center',
  },
});

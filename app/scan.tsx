import { View, Text, Pressable, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ObjectCaptureModule } from '../nativeModules/ObjectCaptureModule';
import { MotiView } from 'moti';
import { Platform } from 'react-native';

export default function Scan() {
  const router = useRouter();

  const handleScan = async () => {
    try {
      if (Platform.OS === 'ios') {
        const result = await ObjectCaptureModule.startObjectCapture();
        router.push({ pathname: '/result', params: { filePath: result } });
      } else {
        Alert.alert('Error', 'Esta función solo está disponible en iOS.');
      }
    } catch (err) {
      Alert.alert('Error', 'No se pudo iniciar la captura.');
    }
  };

  return (
    <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.container}>
      <View style={styles.progressBarContainer}>
        <View style={styles.checkbox} />
        <View style={styles.progressText} />
      </View>
      <View style={styles.progressBarTrack}>
        <View style={styles.progressBarFill} />
      </View>
      <View style={styles.card}>
        <View style={styles.imagePlaceholder}>
          <Text style={styles.placeholderText}>[ Imagen del objeto escaneado ]</Text>
        </View>
        <View style={styles.barLarge} />
        <View style={styles.barSmall} />
        <Pressable style={styles.button} onPress={handleScan}>
          <Text style={styles.buttonText}>Abrir Cámara</Text>
        </Pressable>
      </View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#07052F', padding: 24 },
  progressBarContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  checkbox: { width: 20, height: 20, borderWidth: 1, borderColor: '#8DFFE0', borderRadius: 4 },
  progressText: { height: 12, width: '80%', backgroundColor: '#8DFFE0', borderRadius: 6 },
  progressBarTrack: { height: 4, backgroundColor: '#0D004E' },
  progressBarFill: { height: 4, width: '33%', backgroundColor: '#51F7D0' },
  card: { backgroundColor: '#0D004E', marginTop: 32, padding: 16, borderRadius: 16 },
  imagePlaceholder: { borderColor: '#8DFFE0', borderWidth: 1, borderRadius: 12, padding: 24, aspectRatio: 1, alignItems: 'center', justifyContent: 'center' },
  placeholderText: { color: '#8DFFE0', textAlign: 'center' },
  barLarge: { backgroundColor: '#8DFFE0', height: 16, borderRadius: 6, marginTop: 24, marginBottom: 8 },
  barSmall: { backgroundColor: '#8DFFE0', height: 12, borderRadius: 6, marginBottom: 16, width: '66%' },
  button: { backgroundColor: '#51F7D0', padding: 12, borderRadius: 12 },
  buttonText: { textAlign: 'center', fontWeight: 'bold', color: '#000' },
});
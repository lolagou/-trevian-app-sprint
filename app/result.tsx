import { View, Text, Pressable, Alert, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { uploadModel } from '../services/api';
import { MotiView } from 'moti';

export default function Result() {
  const { filePath } = useLocalSearchParams();

  const handleUpload = async () => {
    try {
      await uploadModel(filePath as string);
      Alert.alert('Éxito', 'Archivo enviado correctamente');
    } catch (err) {
      Alert.alert('Error', 'No se pudo enviar el archivo');
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
        <View style={styles.fileBox}>
          <Text style={styles.label}>Archivo generado:</Text>
          <Text style={styles.filePath} numberOfLines={1} ellipsizeMode="middle">
            {filePath as string}
          </Text>
        </View>
        <View style={styles.actions}>
          <Pressable style={styles.cancelButton}>
            <Text style={styles.cancelText}>Volver</Text>
          </Pressable>
          <Pressable style={styles.confirmButton} onPress={handleUpload}>
            <Text style={styles.confirmText}>Crear Plantilla</Text>
          </Pressable>
        </View>
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
  progressBarFill: { height: 4, width: '100%', backgroundColor: '#51F7D0' },
  card: { backgroundColor: '#0D004E', marginTop: 32, padding: 16, borderRadius: 16 },
  fileBox: { borderWidth: 1, borderColor: '#8DFFE0', borderRadius: 12, padding: 16 },
  label: { color: '#8DFFE0', fontSize: 12 },
  filePath: { color: '#fff', marginTop: 8 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 24 },
  cancelButton: { borderWidth: 1, borderColor: '#8DFFE0', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 12 },
  cancelText: { color: '#8DFFE0' },
  confirmButton: { backgroundColor: '#51F7D0', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 12 },
  confirmText: { color: '#000', fontWeight: 'bold' },
});
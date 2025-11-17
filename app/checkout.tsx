import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import CTAButton from '../components/CTAButton';

export default function Checkout() {
  const router = useRouter();
  const { status } = useLocalSearchParams<{ status?: string }>();

  const message =
    status === 'approved'
      ? '¡Pago aprobado! 🎉'
      : status === 'pending'
      ? 'Pago pendiente ⏳'
      : 'Pago rechazado ❌';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{message}</Text>
      <CTAButton
        label="Volver al Dashboard"
        onPress={() => router.replace('/dashboard')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#02001A',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 22,
    color: 'white',
    marginBottom: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
});

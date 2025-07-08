import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import CustomButton from '../components/CustomButton'; // Asegurate que la ruta sea correcta

export default function ModelReadyScreen() {
  const [address, setAddress] = useState('');
  const router = useRouter();

  const handleContinue = () => {
    if (!address.trim()) {
      Alert.alert('Campo incompleto', 'Por favor ingresá tu domicilio.');
      return;
    }

    console.log('🏠 Domicilio ingresado:', address);
    // Aquí podés enviar el domicilio al backend si querés
    router.push('/confirmacion'); // redirigí a la pantalla que corresponda
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <Text style={styles.title}>Modelo procesado correctamente</Text>
      <Text style={styles.subtitle}>Ingresá tu domicilio para continuar con el pedido.</Text>

      <TextInput
        style={styles.input}
        placeholder="Ej: Av. Santa Fe 1234"
        placeholderTextColor="#88ffdd"
        value={address}
        onChangeText={setAddress}
      />

      <CustomButton text="Continuar" onPress={handleContinue} />
    </KeyboardAvoidingView>
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
  input: {
    borderWidth: 1,
    borderColor: '#6DFFD5',
    borderRadius: 10,
    color: '#ffffff',
    padding: 12,
    marginBottom: 20,
    width: '100%',
  },
});

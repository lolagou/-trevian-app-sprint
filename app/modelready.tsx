import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import CustomButton from '../components/CustomButton';

export default function ModelReadyScreen() {
  const router = useRouter();

  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [details, setDetails] = useState('');

  const handleContinue = () => {
    if (!province || !city || !street || !number || !postalCode) {
      Alert.alert('Faltan campos', 'Completá todos los datos obligatorios.');
      return;
    }

    console.log('📦 Domicilio:', { province, city, street, number, postalCode, details });
    router.push('/confirmacion');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <ScrollView contentContainerStyle={styles.scroll}>

        <View style={styles.form}>
          <View style={styles.row}>
            <View style={styles.field}>
              <Text style={styles.label}>PROVINCIA</Text>
              <TextInput
                style={styles.input}
                value={province}
                onChangeText={setProvince}
                placeholder="Ej: Buenos Aires"
                placeholderTextColor="#6DFFD5"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>CIUDAD</Text>
              <TextInput
                style={styles.input}
                value={city}
                onChangeText={setCity}
                placeholder="Ej: CABA"
                placeholderTextColor="#6DFFD5"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.field}>
              <Text style={styles.label}>CALLE</Text>
              <TextInput
                style={styles.input}
                value={street}
                onChangeText={setStreet}
                placeholder="Ej: Corrientes"
                placeholderTextColor="#6DFFD5"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>ALTURA</Text>
              <TextInput
                style={styles.input}
                value={number}
                onChangeText={setNumber}
                placeholder="Ej: 1234"
                placeholderTextColor="#6DFFD5"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.field}>
              <Text style={styles.label}>CÓDIGO POSTAL</Text>
              <TextInput
                style={styles.input}
                value={postalCode}
                onChangeText={setPostalCode}
                placeholder="Ej: 1001"
                placeholderTextColor="#6DFFD5"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>DETALLES</Text>
              <TextInput
                style={styles.input}
                value={details}
                onChangeText={setDetails}
                placeholder="Piso, depto, etc"
                placeholderTextColor="#6DFFD5"
              />
            </View>
          </View>
        </View>

        <CustomButton text="SIGUIENTE" onPress={handleContinue} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#020016',
    flex: 1,
  },
  scroll: {
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  subtitle: {
    color: '#6DFFD5',
    fontSize: 16,
    marginBottom: 24,
  },
  form: {
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  field: {
    flex: 1,
  },
  label: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  input: {
    borderBottomWidth: 2,
    borderColor: '#6DFFD5',
    color: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 14,
  },
});

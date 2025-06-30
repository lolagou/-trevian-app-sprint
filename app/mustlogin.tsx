import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function MustLogin() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Debe loguearse</Text>

      <Image
        source={require('../assets/padlock.png')} 
        style={styles.lockImage}
        resizeMode="contain"
      />

      <Text style={styles.description}>
        Para crear tu plantilla tendrás que{'\n'}iniciar sesión o registrarte
      </Text>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => router.push('/login')}
      >
        <Text style={styles.primaryButtonText}>INICIAR SESIÓN</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => router.push('/register')}
      >
        <Text style={styles.secondaryButtonText}>REGISTRARSE</Text>
      </TouchableOpacity>
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
  header: {
    position: 'absolute',
    top: 60,
    left: 24,
    fontSize: 16,
    color: '#9E9E9E',
  },
  lockImage: {
    width: 150,
    height: 150,
    marginBottom: 24,
  },
  description: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: '#6DFFD5',
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 12,
    marginBottom: 16,
  },
  primaryButtonText: {
    color: '#020016',
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: '#6DFFD5',
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 12,
  },
  secondaryButtonText: {
    color: '#6DFFD5',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

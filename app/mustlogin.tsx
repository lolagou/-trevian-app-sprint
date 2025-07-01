import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import CustomButton from '../components/CustomButton'; // Asegurate de que la ruta sea correcta

export default function MustLogin() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/padlock.png')} 
        style={styles.lockImage}
        resizeMode="contain"
      />

      <Text style={styles.description}>
        Para crear tu plantilla tendrás que{'\n'}iniciar sesión o registrarte
      </Text>

      <CustomButton
        text="INICIAR SESIÓN"
        onPress={() => router.push('/login')}
      />

      <CustomButton
        text="REGISTRARSE"
        variant="outline"
        onPress={() => router.push('/register')}
        style={{ marginTop: 16 }}
      />
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
  lockImage: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
  description: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 40,
  },
});

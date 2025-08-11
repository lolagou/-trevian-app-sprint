import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import CTAButton from '../components/CTAButton';
import DashboardButton from '../components/DashboardButton';

const { width, height } = Dimensions.get('window');

export default function Unlocked() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <DashboardButton onPress={() => router.push('/dashboard')} />

      <Image
        source={require('../assets/mustlogin.png')}
        style={styles.expandedBackground}
        resizeMode="cover"
      />
      
      <Image
        source={require('../assets/unlock.png')}
        style={styles.lockImage}
        resizeMode="contain"
      />

      <Text style={styles.description}>¡Ya puedes crear tu plantilla!</Text>

      <CTAButton label="CONTINUAR" onPress={() => router.push('/ExplicacionPrimerPaso')} />
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
    overflow: 'hidden',
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

  expandedBackground: {
    position: 'absolute',
    width: 600, // 👉 ajustá esto como quieras (más de lo necesario)
    height: 1000,
    top: -100,  // 👉 mové para centrar
    left: -100,
  },
});

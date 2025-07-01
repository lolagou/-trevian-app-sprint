import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import CTAButton from '../components/CTAButton';
import DashboardButton from '../components/DashboardButton';

export default function Unlocked() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <DashboardButton onPress={() => router.push('/dashboard')} />

      <Image
        source={require('../assets/padlock.png')}
        style={styles.lockImage}
        resizeMode="contain"
      />

      <Text style={styles.description}>¡Ya puedes crear tu plantilla!</Text>

      <CTAButton label="CONTINUAR" onPress={() => router.push('/paso1')} />
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

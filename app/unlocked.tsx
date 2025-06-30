import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function Unlocked() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => router.push('/dashboard')}
        style={styles.topButton}
      >
        <View style={styles.circle} />
      </TouchableOpacity>

      <Image
        source={require('../assets/padlock.png')}
        style={styles.lockImage}
        resizeMode="contain"
      />

      <Text style={styles.description}>¡Ya puedes crear tu plantilla!</Text>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => router.push('/paso1')}
      >
        <Text style={styles.primaryButtonText}>CONTINUAR</Text>
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
  topButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  circle: {
    width: 30,
    height: 30,
    backgroundColor: '#CBFFEF',
    borderRadius: 15,
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
});

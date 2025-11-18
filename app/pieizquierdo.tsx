// app/escaneoPieDerecho.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function EscaneoPieDerecho() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    'Onest-Medium': require('../assets/fonts/Onest-Medium.ttf'),
    'Onest-ExtraBold': require('../assets/fonts/Onest-ExtraBold.ttf'),
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/paso1?side=left');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!fontsLoaded) return <AppLoading />;

  return (
    <View style={styles.container}>
      {/* 👉 mismo fondo que MustLogin / Unlocked */}
      <Image
        source={require('../assets/mustlogin.png')}
        style={styles.expandedBackground}
        resizeMode="cover"
      />

      {/* Overlay centrada */}
      <View style={styles.overlay}>
        {/* 🔁 Antes estaba el cubo GL; ahora mostramos la imagen plantilla.png */}
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/plantilla.png')}
            style={styles.plantillaImage}
            resizeMode="contain"
          />
        </View>

        {/* Texto inferior */}
        <View style={styles.textBlock}>
          <Text style={styles.subtitle}>Ahora vamos a escanear tu</Text>
          <Text style={styles.highlight}>PIE IZQUIERDO</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020016',
    overflow: 'hidden',
  },
  expandedBackground: {
    position: 'absolute',
    width: 600,
    height: 1000,
    top: -100,
    left: -100,
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  imageContainer: {
    width: 150,
    height: 200,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plantillaImage: {
    width: '100%',
    height: '100%',
  },
  textBlock: {
    marginTop: 16,
    alignItems: 'center',
  },
  subtitle: {
    color: '#D2FFF2',
    fontSize: 16,
    fontFamily: 'Onest-Medium',
    textAlign: 'center',
    marginBottom: 4,
  },
  highlight: {
    color: '#6DFFD5',
    fontSize: 20,
    fontFamily: 'Onest-ExtraBold',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});

import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';

const { width, height } = Dimensions.get('window');

export default function UnlockedPieDerecho() {
  const router = useRouter();

  // Animaciones
  const forbiddenOpacity = useRef(new Animated.Value(1)).current; // plantillanot
  const plantillaOpacity = useRef(new Animated.Value(0)).current; // plantilla

  const [fontsLoaded] = useFonts({
    'Onest-Medium': require('../assets/fonts/Onest-Medium.ttf'),
    'Onest-ExtraBold': require('../assets/fonts/Onest-ExtraBold.ttf'),
  });

  useEffect(() => {
    // Fade de plantillanot → plantilla
    Animated.sequence([
      Animated.delay(1800),
      Animated.parallel([
        Animated.timing(forbiddenOpacity, {
          toValue: 0,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(plantillaOpacity, {
          toValue: 1,
          duration: 1400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Navega a paso1 (pie derecho)
    const navTimer = setTimeout(() => {
      router.push('/paso1?side=right');
    }, 5500);

    return () => clearTimeout(navTimer);
  }, []);

  if (!fontsLoaded) return <AppLoading />;

  return (
    <View style={styles.container}>
      {/* Fondo Trevian */}
      <Image
        source={require('../assets/mustlogin.png')}
        style={styles.expandedBackground}
        resizeMode="cover"
      />

      <View style={styles.overlay}>
        {/* Contenedor fijo: ambos (plantillanot + plantilla) exactamente alineados */}
        <View style={styles.centerStack}>
          {/* 🔴 Antes: prohibido.png → ahora plantillanot.png */}
          <Animated.Image
            source={require('../assets/plantillanot.png')}
            style={[styles.fadeLayer, { opacity: forbiddenOpacity }]}
            resizeMode="contain"
          />

          {/* 🦶 Antes cubo GLB → ahora plantilla.png */}
          <Animated.Image
            source={require('../assets/plantilla.png')}
            style={[styles.fadeLayer, { opacity: plantillaOpacity }]}
            resizeMode="contain"
          />
        </View>

        {/* Texto inferior, aparece con la plantilla */}
        <Animated.View style={[styles.textBlock, { opacity: plantillaOpacity }]}>
          <Text style={styles.subtitle}>Empecemos escaneando tu</Text>
          <Text style={styles.highlight}>PIE DERECHO</Text>
        </Animated.View>
      </View>
    </View>
  );
}

// 🎨 Estilos
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
  },
  centerStack: {
    width: 180,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  fadeLayer: {
    position: 'absolute',
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
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

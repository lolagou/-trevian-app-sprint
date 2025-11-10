import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import CTAButton from '../components/CTAButton';
import DashboardButton from '../components/DashboardButton';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';

const { width, height } = Dimensions.get('window');

export default function Unlocked() {
  const router = useRouter();
  const opacity = useRef(new Animated.Value(0)).current; // comienza invisible

  // ✅ Cargar la fuente
  const [fontsLoaded] = useFonts({
    'Onest-Medium': require('../assets/fonts/Onest-Medium.ttf'),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  // ✅ Efecto fade in/out de la imagen prohibido.png
  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1, // aparece
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.delay(1000), // se mantiene visible
      Animated.timing(opacity, {
        toValue: 0, // desaparece
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <DashboardButton onPress={() => router.push('/dashboard')} />

      {/* Fondo */}
      <Image
        source={require('../assets/mustlogin.png')}
        style={styles.expandedBackground}
        resizeMode="cover"
      />

      {/* Imagen prohibido con fade */}
      <Animated.Image
        source={require('../assets/prohibido.png')}
        style={[styles.fadeImage, { opacity }]}
        resizeMode="contain"
      />

      <Text style={styles.description}>¡Ya puedes crear tu plantilla!</Text>

      <CTAButton label="CONTINUAR" onPress={() => router.push('/piederecho')} />
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
  fadeImage: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
  description: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 40,
    fontFamily: 'Onest-Medium',
  },
  expandedBackground: {
    position: 'absolute',
    width: 600,
    height: 1000,
    top: -100,
    left: -100,
  },
});

// IndexScreen.tsx
import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const { width } = Dimensions.get('window');

const BACKGROUND = '#02001A';
const TEXT_COLOR = '#FFFFFF';
const BUTTON_BG = '#6DFFD5';
const BUTTON_TEXT = '#05003F';
const ACCENT = '#6DFFD5';

export default function IndexScreen() {
  const router = useRouter();
  const [showLogo, setShowLogo] = useState(true);
  const [showGradient, setShowGradient] = useState(true);
  const [showShadow, setShowShadow] = useState(false); // la podés borrar si querés
  const [showCube, setShowCube] = useState(false); // ahora controla la plantilla
  const [showUI, setShowUI] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const uiY = useRef(new Animated.Value(100)).current;
  const cubeY = useRef(new Animated.Value(200)).current;
  const cubeTranslateX = useRef(new Animated.Value(0)).current;
  const cubeScale = useRef(new Animated.Value(1)).current;
  const cubeOpacity = useRef(new Animated.Value(1)).current;

  const [fontsLoaded] = useFonts({
    'Onest-Medium': require('../assets/fonts/Onest-Medium.ttf'),
  });

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 1200, useNativeDriver: true }).start();

    const timers = [
      setTimeout(() => setShowLogo(false), 2000),
      setTimeout(() => setShowShadow(true), 2000),
      setTimeout(() => setShowGradient(true), 0),
      setTimeout(() => setShowCube(true), 3700),
      setTimeout(() => {
        Animated.timing(cubeY, { toValue: 0, duration: 500, useNativeDriver: true }).start();
      }, 3900),
      setTimeout(() => {
        Animated.timing(uiY, { toValue: 0, duration: 1500, useNativeDriver: true }).start();
        setShowUI(true);
      }, 4800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (showCube) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(cubeTranslateX, {
              toValue: -width,
              duration: 700,
              useNativeDriver: true,
            }),
            Animated.timing(cubeScale, {
              toValue: 0.8,
              duration: 700,
              useNativeDriver: true,
            }),
            Animated.timing(cubeOpacity, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(cubeTranslateX, {
              toValue: width,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(cubeScale, {
              toValue: 1.2,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(cubeTranslateX, {
              toValue: 0,
              duration: 700,
              useNativeDriver: true,
            }),
            Animated.timing(cubeScale, {
              toValue: 1,
              duration: 700,
              useNativeDriver: true,
            }),
            Animated.timing(cubeOpacity, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
          ]),
          Animated.delay(3500),
        ])
      );
      loop.start();
      return () => loop.stop();
    }
  }, [showCube]);

  if (!fontsLoaded) return null;

  return (
    <LinearGradient colors={[BACKGROUND, BACKGROUND]} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={[]}>
        {/* 🔹 Botón Dashboard arriba a la izquierda */}
        <TouchableOpacity
          onPress={() => router.push('/dashboard')}
          style={styles.dashboardButton}
          activeOpacity={0.8}
        >
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <FontAwesome6 name="user-large" size={15} color="#CBFFEF" />
            </View>
          </View>
        </TouchableOpacity>

        {showLogo && (
          <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>
        )}

        {showGradient && (
          <Animated.View style={[styles.gradientContainer, { opacity: fadeAnim }]}>
            <Image
              source={require('../assets/gradient.png')}
              style={styles.gradient}
              resizeMode="contain"
            />
          </Animated.View>
        )}

        {showCube && (
          <Animated.View
            style={{
              transform: [
                { translateY: cubeY },
                { translateX: cubeTranslateX },
                { scale: cubeScale },
              ],
              opacity: cubeOpacity,
              position: 'absolute',
              top: '34%',
              width: '40%',
              height: 180,
              zIndex: 20,
              alignItems: 'center',
            }}
          >
            {/* 👉 Reemplazo del cubo GLB por imagen de la plantilla */}
            <Image
              source={require('../assets/plantilla.png')}
              style={styles.plantillaImage}
              resizeMode="contain"
            />

            <Text
              style={{
                color: TEXT_COLOR,
                fontSize: 18,
                textAlign: 'center',
                width: 320,
                alignSelf: 'center',
                fontFamily: 'Onest-Medium',
              }}
            >
              Te explicamos paso por paso cómo crear tu plantilla ortopédica
            </Text>
          </Animated.View>
        )}

        {showUI && (
          <Animated.View
            style={{
              transform: [{ translateY: uiY }],
              alignItems: 'center',
              zIndex: 30,
              marginTop: 350,
            }}
          >
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: BUTTON_BG, shadowColor: BUTTON_BG },
              ]}
              onPress={() => router.push('/mustlogin')}
            >
              <Text style={[styles.buttonText, { color: BUTTON_TEXT }]}>
                CREÁ TU PLANTILLA
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  // 🔹 DASHBOARD ICON
  dashboardButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#6DFFD5',
    backgroundColor: 'rgba(109,255,213,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6DFFD5',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },

  logoContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logo: { width: 120, height: 36 },

  gradientContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
  gradient: {
    width: '150%',
    height: '190%',
    transform: [{ translateX: 20 }, { translateY: 30 }],
    opacity: 1,
  },

  // 👉 nueva imagen de la plantilla
  plantillaImage: {
    width: width * 0.8,  // 🔹 80% del ancho de la pantalla
    height: width * 0.8 * 0.55, // 🔹 mantiene proporción aprox. plantilla (ajustable)
    marginBottom: 8,
    alignSelf: 'center',
  },

  shadowImage: {
    width: 250,
    height: 70,
    marginTop: 10,
    alignSelf: 'center',
    opacity: 0.7,
  },
  button: {
    paddingVertical: 11,
    paddingHorizontal: 64,
    borderRadius: 12,
    marginTop: 210,
  },
  buttonText: { fontSize: 16, fontWeight: 'bold' },
});

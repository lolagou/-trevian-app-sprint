import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Image,
  Switch,
  Dimensions,
} from 'react-native';
import { GLView } from 'expo-gl';
import { useRouter } from 'expo-router';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Asset } from 'expo-asset';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Renderer } from 'expo-three';

const { width } = Dimensions.get('window');

export default function IndexScreen() {
  const router = useRouter();
  const [showLogo, setShowLogo] = useState(true);
  const [showGradient, setShowGradient] = useState(true);
  const [showShadow, setShowShadow] = useState(false);
  const [showCube, setShowCube] = useState(false);
  const [showUI, setShowUI] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const uiY = useRef(new Animated.Value(100)).current;
  const cubeY = useRef(new Animated.Value(200)).current;
  const cubeTranslateX = useRef(new Animated.Value(0)).current;
  const cubeScale = useRef(new Animated.Value(1)).current;
  const cubeOpacity = useRef(new Animated.Value(1)).current;

  const [isDarkMode, setIsDarkMode] = useState(true);

  // --- NUEVO: referencia al modelo para poder actualizar color al cambiar el tema ---
  const cubeRef = useRef<THREE.Object3D | null>(null);

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 1200, useNativeDriver: true }).start();

    const timers = [
      setTimeout(() => setShowLogo(false), 2000),
      setTimeout(() => setShowShadow(true), 2000),
      setTimeout(() => setShowGradient(true), 0),
      setTimeout(() => setShowCube(true), 3700),
      setTimeout(() => {
        Animated.timing(cubeY, { toValue: 0, duration: 800, useNativeDriver: true }).start();
      }, 3900),
      setTimeout(() => {
        Animated.timing(uiY, { toValue: 0, duration: 1000, useNativeDriver: true }).start();
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
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(cubeScale, {
              toValue: 0.8,
              duration: 1000,
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
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(cubeScale, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(cubeOpacity, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
          ]),
          Animated.delay(800),
        ])
      );
      loop.start();
      return () => loop.stop();
    }
  }, [showCube]);

  const backgroundColor = isDarkMode ? '#02001A' : '#CBFFEF';
  const lineColor = isDarkMode ? '#CBFFEF' : '#05003F';
  const textColor = isDarkMode ? '#D2FFF2' : '#05003F';
  const buttonBackground = isDarkMode ? '#6DFFD5' : '#05003F';
  const buttonTextColor = isDarkMode ? '#05003F' : '#CBFFEF';
  const shadowSource = isDarkMode
    ? require('../assets/shadow-dark.png')
    : require('../assets/shadow-light.png');

  useEffect(() => {
    if (!cubeRef.current) return;
    cubeRef.current.traverse((child: any) => {
      if (child.isMesh) {
        const mat = child.material as THREE.MeshStandardMaterial;
        mat.color.set(isDarkMode ? '#6DFFD5' : '#02001A'); 
        mat.needsUpdate = true;
      }
    });
  }, [isDarkMode]);

  return (
    <LinearGradient colors={[backgroundColor, backgroundColor]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.themeToggleContainer}>
          <Text style={{ color: lineColor, fontWeight: 'bold', marginRight: 10 }}>
            {isDarkMode ? 'Oscuro' : 'Claro'}
          </Text>
          <Switch
            value={isDarkMode}
            onValueChange={() => setIsDarkMode((v) => !v)}
            trackColor={{ false: '#CBFFEF', true: '#6DFFD5' }}
            thumbColor={isDarkMode ? '#05003F' : '#6DFFD5'}
          />
        </View>

        {showLogo && (
          <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
            <Image
              source={isDarkMode ? require('../assets/logo.png') : require('../assets/logo-oscuro.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>
        )}

        {showGradient && (
          <Animated.View style={[styles.gradientContainer, { opacity: fadeAnim }]}>
            <Image
              source={isDarkMode ? require('../assets/gradient.png') : require('../assets/gradient-light.png')}
              style={styles.gradient}
              resizeMode="contain"
            />
          </Animated.View>
        )}

        {showCube && (
          <>
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
                width: '30%',
                height: 150,
                zIndex: 20,
                alignItems: 'center',
              }}
            >
              <GLView
                style={{ width: '100%', height: '100%' }}
                onContextCreate={async (gl: any) => {
                  // Escena, cámara y renderer
                  const scene = new THREE.Scene();
                  const camera = new THREE.PerspectiveCamera(
                    75,
                    gl.drawingBufferWidth / gl.drawingBufferHeight,
                    0.1,
                    1000
                  );
                  camera.position.z = 1;

                  const renderer = new Renderer({ gl });
                  renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
                  
                  const dpr = (typeof window !== 'undefined' && (window as any).devicePixelRatio) ? (window as any).devicePixelRatio : 1;
                  renderer.setPixelRatio(dpr);

                 
                  scene.add(new THREE.AmbientLight(0xffffff, 1.2));
                  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
                  dirLight.position.set(5, 5, 5);
                  scene.add(dirLight);

                  
                  const asset = Asset.fromModule(require('../assets/models/Cube.glb'));
                  await asset.downloadAsync();

                  const loader = new GLTFLoader();
                  loader.load(
                    asset.localUri || asset.uri,
                    (gltf: any) => {
                      const model: THREE.Object3D = gltf.scene;

                      // Guardamos referencia global para poder actualizar color en vivo
                      cubeRef.current = model;

                      model.scale.set(1, 1, 1);
                      model.position.y = 0;

                      // Color inicial según tema actual
                      model.traverse((child: any) => {
                        if (child.isMesh) {
                          const mat = child.material as THREE.MeshStandardMaterial;
                          mat.color.set(isDarkMode ? '#000000' : '#6DFFD5');
                          mat.needsUpdate = true;
                        }
                      });

                      scene.add(model);

                      const animate = () => {
                        requestAnimationFrame(animate);
                        model.rotation.y += 0.01;
                        model.rotation.x += 0.005;
                        renderer.render(scene, camera);
                        gl.endFrameEXP();
                      };
                      animate();
                    },
                    undefined,
                    (error: any) => console.error('Error al cargar .glb:', error)
                  );
                }}
              />
              <Image source={shadowSource} style={styles.shadowImage} resizeMode="contain" />
              <Text
                style={{
                  color: textColor,
                  fontSize: 18,
                  textAlign: 'center',
                  paddingHorizontal: -80,
                  maxWidth: '100%',
                }}
              >
                Explicación muy abarcativa
              </Text>
            </Animated.View>
          </>
        )}

        {showUI && (
          <Animated.View
            style={{ transform: [{ translateY: uiY }], alignItems: 'center', zIndex: 30, marginTop: 350 }}
          >
            <TouchableOpacity
              style={[styles.button, { backgroundColor: buttonBackground, shadowColor: buttonBackground }]}
              onPress={() => router.push('/mustlogin')}
            >
              <Text style={[styles.buttonText, { color: buttonTextColor }]}>CREÁ TU PLANTILLA</Text>
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
  themeToggleContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
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
  shadowImage: {
    width: 250,
    height: 70,
    marginTop: 10,
    alignSelf: 'center',
    opacity: 0.7,
  },
  decorativeLines: { marginBottom: 40, alignItems: 'center', gap: 6 },
  line: { width: 280, height: 6, borderRadius: 4 },
  button: { paddingVertical: 11, paddingHorizontal: 64, borderRadius: 12, marginTop: 10 },
  buttonText: { fontSize: 16, fontWeight: 'bold' },
});

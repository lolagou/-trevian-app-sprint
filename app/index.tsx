// src/app/IndexScreen.tsx

import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Image,
  Switch,
} from 'react-native';
import { GLView } from 'expo-gl';
import { useRouter } from 'expo-router';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Asset } from 'expo-asset';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Renderer } from 'expo-three';

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
  const [isDarkMode, setIsDarkMode] = useState(true);

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

  const backgroundColor = isDarkMode ? '#02001A' : '#CBFFEF';
  const lineColor = isDarkMode ? '#CBFFEF' : '#05003F';
  const buttonBackground = isDarkMode ? '#6DFFD5' : '#05003F';
  const buttonTextColor = isDarkMode ? '#05003F' : '#CBFFEF';
  const shadowSource = isDarkMode
    ? require('../assets/shadow-dark.png')
    : require('../assets/shadow-light.png');

  return (
    <LinearGradient colors={[backgroundColor, backgroundColor]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Toggle tema */}
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

        {/* Logo */}
        {showLogo && (
          <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
            <Image
              source={isDarkMode ? require('../assets/logo.png') : require('../assets/logo-oscuro.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>
        )}

        {/* Gradiente */}
        {showGradient && (
          <Animated.View style={[styles.gradientContainer, { opacity: fadeAnim }]}>
            <Image
              source={isDarkMode ? require('../assets/gradient.png') : require('../assets/gradient-light.png')}
              style={styles.gradient}
              resizeMode="contain"
            />
          </Animated.View>
        )}

        {/* Sombra */}
        {showShadow && (
          <Image source={shadowSource} style={styles.shadowImage} resizeMode="contain" />
        )}

        {/* GLView con modelo .glb */}
        {showCube && (
          <Animated.View
            style={{
              transform: [{ translateY: cubeY }],
              position: 'absolute',
              top: '34%',
              width: '80%',
              height: 220,
              zIndex: 20,
            }}
          >
            <GLView
              style={{ width: '100%', height: '100%' }}
              onContextCreate={async (gl: any) => {
                const scene = new THREE.Scene();
                const camera = new THREE.PerspectiveCamera(
                  75,
                  gl.drawingBufferWidth / gl.drawingBufferHeight,
                  0.1,
                  1000
                );
                camera.position.z = 3;

                const renderer = new Renderer({ gl });
                renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
                renderer.setPixelRatio(window.devicePixelRatio);

                scene.add(new THREE.AmbientLight(0xffffff, 1.2));
                const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
                dirLight.position.set(5, 5, 5);
                scene.add(dirLight);

                // Cargar el .glb
                const asset = Asset.fromModule(require('../assets/models/Cube.glb'));
                await asset.downloadAsync();

                const loader = new GLTFLoader();
                loader.load(
                  asset.localUri || asset.uri,
                  (gltf: any) => {
                    const model = gltf.scene;
                    model.scale.set(1, 1, 1);
                    model.position.y = 0;

                    model.traverse((child: any) => {
                      if (child.isMesh) {
                        const mat = child.material as THREE.MeshStandardMaterial;
                        mat.color.set('#6DFFD5');
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
                  (error: any) => {
                    console.error('Error al cargar .glb:', error);
                  }
                );
              }}
            />
          </Animated.View>
        )}

        {/* UI final */}
        {showUI && (
          <Animated.View
            style={{ transform: [{ translateY: uiY }], alignItems: 'center', zIndex: 30, marginTop: 350 }}
          >
            <View style={styles.decorativeLines}>
              <View style={[styles.line, { backgroundColor: lineColor, opacity: 0.2 }]} />
              <View style={[styles.line, { backgroundColor: lineColor, opacity: 0.2 }]} />
              <View style={[styles.line, { backgroundColor: lineColor, opacity: 0.2 }]} />
            </View>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: buttonBackground, shadowColor: buttonBackground }]}
              onPress={() => router.push('/mustlogin')}
            >
              <Text style={[styles.buttonText, { color: buttonTextColor }]}>
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
    position: 'absolute',
    top: '64%',
    width: 250,
    height: 70,
    alignSelf: 'center',
    zIndex: 10,
    opacity: 0.7,
  },
  decorativeLines: { marginBottom: 40, alignItems: 'center', gap: 6 },
  line: { width: 280, height: 6, borderRadius: 4 },
  button: { paddingVertical: 11, paddingHorizontal: 64, borderRadius: 12, marginTop: 10 },
  buttonText: { fontSize: 16, fontWeight: 'bold' },
});

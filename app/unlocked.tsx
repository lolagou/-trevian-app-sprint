
import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { GLView } from 'expo-gl';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Asset } from 'expo-asset';
import { Renderer } from 'expo-three';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';

const { width, height } = Dimensions.get('window');

export default function UnlockedPieDerecho() {
  const router = useRouter();

  // Animaciones
  const forbiddenOpacity = useRef(new Animated.Value(1)).current;
  const cubeOpacity = useRef(new Animated.Value(0)).current;

  const [fontsLoaded] = useFonts({
    'Onest-Medium': require('../assets/fonts/Onest-Medium.ttf'),
    'Onest-ExtraBold': require('../assets/fonts/Onest-ExtraBold.ttf'),
  });

  useEffect(() => {
    Animated.sequence([
      Animated.delay(1800),
      Animated.parallel([
        Animated.timing(forbiddenOpacity, {
          toValue: 0,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(cubeOpacity, {
          toValue: 1,
          duration: 1400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

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
        {/* Contenedor fijo: ambos (prohibido + cubo) exactamente alineados */}
        <View style={styles.centerStack}>
          {/* Imagen Prohibido */}
          <Animated.Image
            source={require('../assets/prohibido.png')}
            style={[styles.fadeLayer, { opacity: forbiddenOpacity }]}
            resizeMode="contain"
          />

          {/* Cubo GLB */}
          <Animated.View style={[styles.fadeLayer, { opacity: cubeOpacity }]}>
            <GLView
              style={{ width: 150, height: 200 }} // ✅ igual que antes
              onContextCreate={async (gl) => {
                const scene = new THREE.Scene();

                const camera = new THREE.PerspectiveCamera(
                  75,
                  gl.drawingBufferWidth / gl.drawingBufferHeight,
                  0.1,
                  1000
                );
                camera.position.z = 1; // ✅ misma distancia (no deformado)

                const renderer = new Renderer({ gl });
                renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
                renderer.setClearColor(0x000000, 0); // fondo transparente

                const dpr =
                  typeof window !== 'undefined' && (window as any).devicePixelRatio
                    ? (window as any).devicePixelRatio
                    : 1;
                renderer.setPixelRatio(dpr);

                // Luces iguales al diseño anterior
                scene.add(new THREE.AmbientLight(0xffffff, 1.2));
                const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
                dirLight.position.set(5, 5, 5);
                scene.add(dirLight);

                // Modelo Trevian (mismo cubo)
                const asset = Asset.fromModule(require('../assets/models/Cube.glb'));
                await asset.downloadAsync();

                const loader = new GLTFLoader();
                loader.load(
                  asset.localUri || asset.uri,
                  (gltf) => {
                    const model = gltf.scene;
                    model.scale.set(1, 1, 1); // ✅ proporción correcta
                    model.position.set(0, 0, 0);

                    model.traverse((child: any) => {
                      if (child.isMesh) {
                        const mat = child.material as THREE.MeshStandardMaterial;
                        mat.color.set('#6DFFD5'); // color Trevian
                        mat.metalness = 0.3;
                        mat.roughness = 0.4;
                        mat.needsUpdate = true;
                      }
                    });

                    scene.add(model);

                    // Animación de rotación
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
                  (error) => console.error('Error cargando GLB:', error)
                );
              }}
            />
          </Animated.View>
        </View>

        {/* Texto inferior */}
        <Animated.View style={[styles.textBlock, { opacity: cubeOpacity }]}>
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
    width: 150, // ✅ igual al GLView
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

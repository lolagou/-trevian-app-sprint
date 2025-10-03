import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import CTAButton from '../components/CTAButton';
import DashboardButton from '../components/DashboardButton';
import { GLView } from 'expo-gl';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Asset } from 'expo-asset';
import { Renderer } from 'expo-three';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';

const { width, height } = Dimensions.get('window');

export default function Unlocked() {
  const router = useRouter();

  // ✅ Cargar la fuente
  const [fontsLoaded] = useFonts({
    'Onest-Medium': require('../assets/fonts/Onest-Medium.ttf'),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
      <DashboardButton onPress={() => router.push('/dashboard')} />

      <Image
        source={require('../assets/mustlogin.png')}
        style={styles.expandedBackground}
        resizeMode="cover"
      />

      {/* Cubo en lugar de imagen unlock */}
      <View style={styles.cubeContainer}>
        <GLView
          style={{ width: 150, height: 200 }}
          onContextCreate={async (gl) => {
            // Escena y cámara
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(
              75,
              gl.drawingBufferWidth / gl.drawingBufferHeight,
              0.1,
              1000
            );
            camera.position.z = 1;

            // Renderer
            const renderer = new Renderer({ gl });
            renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
            const dpr =
              typeof window !== 'undefined' && (window as any).devicePixelRatio
                ? (window as any).devicePixelRatio
                : 1;
            renderer.setPixelRatio(dpr);
            // Si querés el fondo transparente del GLView:
            // renderer.setClearColor(0x000000, 0);

            // Luces
            scene.add(new THREE.AmbientLight(0xffffff, 1.2));
            const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
            dirLight.position.set(5, 5, 5);
            scene.add(dirLight);

            // Cargar el cubo
            const asset = Asset.fromModule(require('../assets/models/Cube.glb'));
            await asset.downloadAsync();

            const loader = new GLTFLoader();
            loader.load(
              asset.localUri || asset.uri,
              (gltf) => {
                const model = gltf.scene;
                model.scale.set(1, 1, 1);

                // Color celeste para todos los meshes
                model.traverse((child: any) => {
                  if (child.isMesh) {
                    const mat = child.material as THREE.MeshStandardMaterial;
                    mat.color.set('#6DFFD5'); // celeste Trevian
                    mat.needsUpdate = true;
                  }
                });

                scene.add(model);

                // Render estático (sin animación)
                const renderFrame = () => {
                  requestAnimationFrame(renderFrame);
                  renderer.render(scene, camera);
                  gl.endFrameEXP();
                };
                renderFrame();
              },
              undefined,
              (error) => console.error('Error cargando el cubo:', error)
            );
          }}
        />
      </View>

      <Text style={styles.description}>Primero vamos a escanear tu pie</Text>

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
    overflow: 'hidden',
  },
  cubeContainer: {
    width: 150,
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

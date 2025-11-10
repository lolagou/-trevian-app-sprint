// app/escaneoPieDerecho.tsx (o el nombre que tengas)
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { GLView } from 'expo-gl';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Asset } from 'expo-asset';
import { Renderer } from 'expo-three';
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

  // ⏱️ Después de 3 segundos pasa automáticamente a paso1 (pie derecho)
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/paso1?side=right');
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
        {/* Cubo 3D igual que en Unlocked */}
        <View style={styles.cubeContainer}>
          <GLView
            style={{ width: 150, height: 200 }}
            onContextCreate={async (gl) => {
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
              const dpr =
                typeof window !== 'undefined' && (window as any).devicePixelRatio
                  ? (window as any).devicePixelRatio
                  : 1;
              renderer.setPixelRatio(dpr);

              // 👇 fondo transparente para que se vea bien el PNG
              renderer.setClearColor(0x000000, 0);

              // Luces
              scene.add(new THREE.AmbientLight(0xffffff, 1.2));
              const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
              dirLight.position.set(5, 5, 5);
              scene.add(dirLight);

              // Modelo .glb
              const asset = Asset.fromModule(require('../assets/models/Cube.glb'));
              await asset.downloadAsync();

              const loader = new GLTFLoader();
              loader.load(
                asset.localUri || asset.uri,
                (gltf) => {
                  const model = gltf.scene;
                  model.scale.set(1, 1, 1);

                  // Color celeste Trevian
                  model.traverse((child: any) => {
                    if (child.isMesh) {
                      const mat = child.material as THREE.MeshStandardMaterial;
                      mat.color.set('#6DFFD5');
                      mat.needsUpdate = true;
                    }
                  });

                  scene.add(model);

                  // Rotación suave
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
        </View>

        {/* Texto inferior */}
        <View style={styles.textBlock}>
          <Text style={styles.subtitle}>Empecemos escaneando tu</Text>
          <Text style={styles.highlight}>PIE DERECHO</Text>
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
  cubeContainer: {
    width: 150,
    height: 200,
    marginBottom: 24,
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

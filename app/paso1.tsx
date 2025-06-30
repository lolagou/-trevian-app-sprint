import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { GLView } from 'expo-gl';
import * as THREE from 'three';
import { Renderer } from 'expo-three';

const { width } = Dimensions.get('window');

export default function Paso1() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Botón para volver al dashboard */}
      <TouchableOpacity onPress={() => router.push('/dashboard')} style={styles.topButton}>
        <View style={styles.circle} />
      </TouchableOpacity>

      {/* Cubo 3D */}
      <View style={styles.cubeContainer}>
        <GLView
          style={{ flex: 1 }}
          onContextCreate={async (gl) => {
            const scene = new THREE.Scene();
            scene.background = new THREE.Color('#020016');

            const camera = new THREE.PerspectiveCamera(
              75,
              gl.drawingBufferWidth / gl.drawingBufferHeight,
              0.1,
              1000
            );
            camera.position.z = 4;

            const renderer = new Renderer({ gl });
            renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

            const geometry = new THREE.BoxGeometry(2, 2, 2);
            const material = new THREE.MeshStandardMaterial({ color: '#CBFFEF' });
            const cube = new THREE.Mesh(geometry, material);
            scene.add(cube);

            const light = new THREE.AmbientLight('#CBFFEF', 1.5);
            scene.add(light);

            const animate = () => {
              requestAnimationFrame(animate);
              cube.rotation.x += 0.01;
              cube.rotation.y += 0.01;
              renderer.render(scene, camera);
              gl.endFrameEXP();
            };

            animate();
          }}
        />
      </View>

      <Text style={styles.description}>Primero vamos a escanear tu pie</Text>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => router.push('/scan')}
      >
        <Text style={styles.primaryButtonText}>COMENZAR</Text>
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
  cubeContainer: {
    width: width * 0.8,
    height: 220,
    marginBottom: 30,
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

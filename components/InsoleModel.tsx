import React, { useRef } from 'react';
import { View } from 'react-native';
import { GLView } from 'expo-gl';
import * as THREE from 'three';
import { Asset } from 'expo-asset';
import { GLTFLoader } from 'three-stdlib';

export default function InsoleModel() {
  const modelRef = useRef<THREE.Group | null>(null);

  return (
    <View style={{ flex: 1, backgroundColor: '#05003F' }}>
      <GLView
        style={{ flex: 1 }}
        onContextCreate={async (gl) => {
          const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

          // 1. Escena y cámara
          const scene = new THREE.Scene();
          const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
          camera.position.z = 3;

          // 2. Renderizador
          const renderer = new THREE.WebGLRenderer({ context: gl, antialias: true });
          renderer.setSize(width, height);
          renderer.setClearColor('#05003F');

          // 3. Luz
          const ambientLight = new THREE.AmbientLight(0xffffff, 1);
          scene.add(ambientLight);

          // 4. Modelo
          const loader = new GLTFLoader();
          const modelUri = Asset.fromModule(require('../assets/right_foot_insole.glb')).uri;

          loader.load(
            modelUri,
            (gltf) => {
              console.log('✅ Modelo cargado');
              const model = gltf.scene;
              model.position.set(0, 0, 0);
              model.scale.set(1, 1, 1);
              modelRef.current = model;
              scene.add(model);
            },
            undefined,
            (error) => {
              console.error('❌ Error cargando modelo:', error);
            }
          );

          // 5. Animación
          const animate = () => {
            requestAnimationFrame(animate);
            if (modelRef.current) {
              modelRef.current.rotation.y += 0.01;
            }
            renderer.render(scene, camera);
            gl.endFrameEXP();
          };

          animate();
        }}
      />
    </View>
  );
}

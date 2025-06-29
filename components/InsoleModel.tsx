import React from 'react';
import { GLView } from 'expo-gl';
import * as THREE from 'three';
import { View } from 'react-native';

export default function InsoleModel() {
  return (
    <View style={{ flex: 1 }}>
      <GLView
        style={{ flex: 1 }}
        onContextCreate={async (gl) => {
          const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

          const scene = new THREE.Scene();
          const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
          camera.position.z = 2;

          const renderer = new THREE.WebGLRenderer({ context: gl, antialias: true });
          renderer.setSize(width, height);
          renderer.setClearColor('#05003F');

          const geometry = new THREE.BoxGeometry(1, 1, 1);
          const material = new THREE.MeshStandardMaterial({ color: 0x6dffd5 });
          const cube = new THREE.Mesh(geometry, material);
          scene.add(cube);

          const light = new THREE.DirectionalLight(0xffffff, 1);
          light.position.set(5, 5, 5);
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
  );
}

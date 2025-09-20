// app/result.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  Animated,
  Easing,
  Alert,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { GLView } from 'expo-gl';
import * as THREE from 'three';
import { Renderer } from 'expo-three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Asset } from 'expo-asset';

import * as FileSystem from 'expo-file-system';
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { decode } from 'base64-arraybuffer';

const { width } = Dimensions.get('window');
const ACCENT = '#6DFFD5';
const BG = '#020016';

/** ================== CONFIG ================== */
// Activa la subida a Supabase (true) o a tu backend (false)
const USE_SUPABASE = true;

// Tu backend (solo si USE_SUPABASE = false)
const API_UPLOAD = 'https://trevian-server.vercel.app/models/upload';

// Supabase
const supabaseUrl = 'https://peutxcbxleqabbtujbzf.supabase.co'; // 👈 sin espacios
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBldXR4Y2J4bGVxYWJidHVqYnpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzNDExNDQsImV4cCI6MjA2NDkxNzE0NH0.-qTmXGLFk9hbbDA9yA0gE2Sh9JLKll4g-Ejp8K3KMsY';
const supabaseBucket = 'models';

const supabase = createClient(supabaseUrl, supabaseAnonKey);
/** ============================================ */

// extendemos el tipo para que acepte endFrameEXP
type ExpoWebGL = WebGLRenderingContext & { endFrameEXP?: () => void };

export default function Result() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const initialPath = (params.filePath as string) || null;
  const [localFilePath, setLocalFilePath] = useState<string | null>(initialPath);

  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [modelURL, setModelURL] = useState<string | null>(null);

  // animación de la barra
  const progressAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 280,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [progress, progressAnim]);

  // Validación temprana: si no llega filePath, avisamos y volvemos atrás
  useEffect(() => {
    if (localFilePath) return;
    Alert.alert('Falta archivo', 'No se recibió el filePath del modelo.');
    const t = setTimeout(() => router.back(), 500);
    return () => clearTimeout(t);
  }, [localFilePath, router]);

  // Cuando tenemos filePath, arrancamos la subida
  useEffect(() => {
    if (!localFilePath) return;

    let cancelled = false;

    const run = async () => {
      try {
        if (USE_SUPABASE) {
          await uploadToSupabase(localFilePath);
        } else {
          await uploadToBackend(localFilePath);
        }
        if (!cancelled) {
          setProgress(1);
          setIsDone(true);
        }
      } catch (e: any) {
        if (!cancelled) {
          console.error(e);
          Alert.alert('Error', e?.message ?? 'No se pudo subir el archivo.');
        }
      }
    };

    run();
    return () => {
      cancelled = true;
      // si estuvieras usando XHR, lo abortamos acá:
      if ((uploadToBackend as any).cancel) (uploadToBackend as any).cancel();
    };
  }, [localFilePath]);

  // ====== SUBIR A TU BACKEND (con progreso fino por XHR) ======
  const uploadToBackend = async (uri: string) => {
    setIsDone(false);
    setProgress(0.02);

    const form = new FormData();
    const name = `scan-${Date.now()}.usdz`;
    form.append('file', { uri, name, type: 'model/vnd.usdz+zip' } as any);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', API_UPLOAD);

    xhr.upload.onprogress = (evt) => {
      if (evt.lengthComputable) {
        const p = evt.loaded / evt.total;
        setProgress(Math.min(0.98, p * 0.98));
      } else {
        setProgress((prev) => Math.min(0.9, prev + 0.01));
      }
    };

    const onReady = () => {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const json = JSON.parse(xhr.responseText);
            setModelURL(json.url ?? null);
          } catch {
            Alert.alert('Error', 'Respuesta inválida del servidor.');
          }
        } else {
          Alert.alert('Error', `Falló la carga del archivo. (${xhr.status})`);
        }
      }
    };
    xhr.onreadystatechange = onReady;

    // cleanup en unmount
    const abortOnUnmount = () => {
      try {
        xhr.abort();
      } catch {}
    };
    (uploadToBackend as any).cancel = abortOnUnmount;

    xhr.send(form);
  };

  // ====== SUBIR DIRECTO A SUPABASE (sin progreso fino) ======
  const uploadToSupabase = async (uri: string) => {
    setIsDone(false);

    // subimos un “progreso” visual: arranca al 5% y va avanzando suave
    setProgress(0.05);
    const tick = setInterval(() => {
      setProgress((p) => Math.min(0.92, p + 0.02));
    }, 250);

    try {
      // RN no tiene Blob/File nativos sin polyfills → base64 -> ArrayBuffer
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const arrayBuffer = decode(base64);

      const filename = `${Date.now()}.usdz`;
      const { error } = await supabase.storage
        .from(supabaseBucket)
        .upload(filename, arrayBuffer, {
          contentType: 'model/vnd.usdz+zip',
          upsert: false,
        });

      if (error) throw error;

      const { data: pub } = supabase.storage.from(supabaseBucket).getPublicUrl(filename);
      setModelURL(pub?.publicUrl ?? null);
    } finally {
      clearInterval(tick);
    }
  };

  // navega solo al terminar
  useEffect(() => {
    if (!isDone) return;
    const t = setTimeout(() => {
      if (modelURL) {
        router.push({ pathname: '/modelready', params: { modelURL } });
      } else {
        router.push('/modelready');
      }
    }, 500);
    return () => clearTimeout(t);
  }, [isDone, modelURL, router]);

  return (
    <View style={styles.container}>
      {/* Fondo */}
      <Image
        source={require('../assets/mustlogin.png')}
        style={styles.expandedBackground}
        resizeMode="cover"
      />

      {/* Cubo centrado (decorativo) */}
      <View style={styles.cubeWrap}>
        <View style={styles.cubeBox}>
          <GLView
            style={{ width: '100%', height: '100%' }}
            onContextCreate={async (gl) => {
              const expoGl = gl as ExpoWebGL;

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
              renderer.setViewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

              scene.add(new THREE.AmbientLight(0xffffff, 1.2));
              const dir = new THREE.DirectionalLight(0xffffff, 0.8);
              dir.position.set(5, 5, 5);
              scene.add(dir);

              const asset = Asset.fromModule(require('../assets/models/Cube.glb'));
              await asset.downloadAsync();

              const loader = new GLTFLoader();
              loader.load(
                asset.localUri || asset.uri,
                (gltf: any) => {
                  const model = gltf.scene as THREE.Object3D;
                  model.scale.set(1, 1, 1);
                  model.position.set(0, 0, 0);
                  model.traverse((child: any) => {
                    if (child.isMesh) {
                      const mat = child.material as THREE.MeshStandardMaterial;
                      mat.color.set(ACCENT);
                      mat.metalness = 0.1;
                      mat.roughness = 0.4;
                      mat.needsUpdate = true;
                    }
                  });
                  scene.add(model);

                  const animate = () => {
                    requestAnimationFrame(animate);
                    model.rotation.y += 0.01;
                    model.rotation.x += 0.005;
                    renderer.render(scene, camera);
                    expoGl.endFrameEXP && expoGl.endFrameEXP();
                  };
                  animate();
                },
                undefined,
                (error: unknown) => console.error('Error GLB:', error)
              );
            }}
          />
        </View>
        <Image
          source={require('../assets/shadow-dark.png')}
          style={styles.shadowImage}
          resizeMode="contain"
        />
      </View>

      {/* Línea de progreso */}
      <View style={styles.bottomArea}>
        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [8, width - 48],
                }),
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG, overflow: 'hidden' },
  expandedBackground: {
    position: 'absolute',
    width: 600,
    height: 1000,
    top: -100,
    left: -100,
  },

  /** cubo centrado **/
  cubeWrap: {
    position: 'absolute',
    top: '34%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 20,
  },
  cubeBox: {
    width: '30%',
    height: 150,
    borderRadius: 20,
    overflow: 'hidden',
  },
  shadowImage: {
    width: 250,
    height: 70,
    marginTop: 10,
    alignSelf: 'center',
    opacity: 0.7,
  },

  /** barra simple **/
  bottomArea: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 26,
  },
  progressTrack: {
    height: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
    backgroundColor: ACCENT,
  },
});

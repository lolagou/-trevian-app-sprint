import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { fetchProcessingStatus, ProcessingStatus } from '../lib/processing';
import CTAButton from '../components/CTAButton';

export default function AnalizandoModelo() {
  const router = useRouter();
  const { jobId } = useLocalSearchParams<{ jobId?: string }>();

  const progress = useRef(new Animated.Value(0)).current;
  const [finished, setFinished] = useState(false);
  const [ready, setReady] = useState<null | {
    fileIdFinal: string;
    webViewLink?: string;
    webContentLink?: string;
  }>(null);
  const [error, setError] = useState<string | null>(null);

  const isMounted = useRef(true);
  const didNavigate = useRef(false);

  // Animación de la barrita + plantilla
  useEffect(() => {
    Animated.sequence([
      Animated.timing(progress, {
        toValue: 1,
        duration: 2500,
        useNativeDriver: false,
      }),
      Animated.timing(progress, {
        toValue: 0.5,
        duration: 2000,
        useNativeDriver: false,
      }),
    ]).start(() => {
      // 🔚 forzamos frame final centrado
      progress.setValue(0.5);
    });
  
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  

  // Polling al backend
  useEffect(() => {
    if (!jobId) {
      setError('Falta jobId para consultar el procesamiento.');
      return;
    }

    let intervalMs = 4000;
    const TIMEOUT = 20 * 60 * 1000; // 20 minutos

    let timeoutHandle: any;
    let timer: any;

    const schedule = () => {
      timer = setTimeout(tick, intervalMs);
    };

    const tick = async () => {
      try {
        const st: ProcessingStatus = await fetchProcessingStatus(jobId);
        if (!isMounted.current) return;

        if (st.status === 'done') {
          setReady({
            fileIdFinal: st.fileIdFinal,
            webViewLink: st.webViewLink,
            webContentLink: st.webContentLink,
          });
          setFinished(true);
          return;
        }

        if (st.status === 'error') {
          setError(st.message || 'Error en el procesamiento');
          return;
        }

        // pending / running → seguimos preguntando con backoff suave
        intervalMs = Math.min(intervalMs + 1000, 10000);
        schedule();
      } catch (e: any) {
        if (!isMounted.current) return;
        setError(e?.message || 'No se pudo consultar el estado');
      }
    };

    timeoutHandle = setTimeout(() => {
      if (!isMounted.current) return;
      setError('Se excedió el tiempo de espera (20 min). Intentalo de nuevo.');
    }, TIMEOUT);

    schedule();

    return () => {
      clearTimeout(timer);
      clearTimeout(timeoutHandle);
    };
  }, [jobId]);

  const widthInterpolated = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['10%', '100%'],
  });

  const rotateInterpolated = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['-15deg', '0deg', '15deg'], // 👈 0deg está en el medio
  });
  
  

  const scaleInterpolated = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.05, 1],
  });

  return (
    <LinearGradient colors={['#02001A', '#02001A']} style={styles.container}>
      <Image
        source={require('../assets/mustlogin.png')}
        style={styles.background}
        resizeMode="cover"
      />

      <Text style={styles.title}>PROCESANDO MODELO</Text>

      {/* Centro: plantilla animada sola, sin borde ni card */}
      <View style={styles.center}>
        <Animated.Image
          source={require('../assets/plantilla.png')}
          style={[
            styles.plantillaImage,
            {
              transform: [
                { rotate: rotateInterpolated },
                { scale: scaleInterpolated },
              ],
            },
          ]}
          resizeMode="contain"
        />
      </View>

      {/* Zona inferior: texto + CTA + barra */}
      <View style={styles.bottomArea}>
        {/* Texto arriba del botón */}
        {!finished ? (
          <View style={styles.bottomTextBox}>
            <Text style={styles.bottomText}>Nuestra inteligencia artificial ya está</Text>
            <Text style={styles.bottomText}>procesando el modelo</Text>
          </View>
        ) : !error ? (
          <View style={styles.bottomTextBox}>
            <Text style={styles.bottomText}>¡Procesamiento finalizado!</Text>
          </View>
        ) : (
          <View style={styles.bottomTextBox}>
            <Text style={[styles.bottomText, { color: 'tomato' }]}>{error}</Text>
          </View>
        )}

        {/* CTA: CONTINUAR o REINTENTAR con CTAButton */}
        {error && (
          <CTAButton
            label="REINTENTAR"
            onPress={() => {
              if (!didNavigate.current) {
                didNavigate.current = true;
                router.replace({
                  pathname: '/finaloader',
                  params: { jobId: jobId || '' },
                });
              }
            }}
          />
        )}

        {finished && ready && !error && (
          <CTAButton
            label="CONTINUAR"
            onPress={() => {
              if (didNavigate.current) return;
              didNavigate.current = true;
              router.replace({
                pathname: '/pago',
                params: {
                  fileIdFinal: ready.fileIdFinal,
                  webViewLink: ready.webViewLink || '',
                  webContentLink: ready.webContentLink || '',
                  jobId: jobId || '',
                },
              });
            }}
          />
        )}

        {/* Barra de progreso mientras no haya error ni haya terminado */}
        {!finished && !error && (
          <View style={styles.progressWrapper}>
            <View style={styles.barBackground}>
              <Animated.View style={[styles.barFill, { width: widthInterpolated }]} />
            </View>
            <View style={styles.smallBar} />
          </View>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#02001A',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  background: {
    position: 'absolute',
    width: 600,
    height: 1000,
    top: -100,
    left: -100,
  },
  title: {
    position: 'absolute',
    top: 90,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // imagen sola, sin fondo ni borde
  plantillaImage: {
    width: 160,
    height: 220,
    backgroundColor: 'transparent',
  },
  bottomArea: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  bottomTextBox: {
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 24,
  },
  bottomText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
  },
  progressWrapper: {
    marginTop: 12,
    width: '100%',
    alignItems: 'center',
    gap: 10,
  },
  barBackground: {
    width: '80%',
    height: 6,
    borderRadius: 999,
    backgroundColor: '#05003F',
    overflow: 'hidden',
    flexDirection: 'row',
  },
  barFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#6DFFD5',
  },
  smallBar: {
    width: '35%',
    height: 4,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
  },
});


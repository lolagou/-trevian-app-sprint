import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { fetchProcessingStatus, ProcessingStatus } from '../lib/processing';

export default function AnalizandoModelo() {
  const router = useRouter();
  const { jobId } = useLocalSearchParams<{ jobId?: string }>();

  const progress = useRef(new Animated.Value(0)).current;
  const [finished, setFinished] = useState(false);
  const [ready, setReady] = useState<null | { fileIdFinal: string; webViewLink?: string; webContentLink?: string }>(null);
  const [error, setError] = useState<string | null>(null);

  const isMounted = useRef(true);
  const didNavigate = useRef(false);

  useEffect(() => {
    Animated.timing(progress, { toValue: 1, duration: 4000, useNativeDriver: false }).start();
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    if (!jobId) {
      setError('Falta jobId para consultar el procesamiento.');
      return;
    }

    // Intervalo base y backoff (opcional)
    let intervalMs = 4000;
    const TIMEOUT = 20 * 60 * 1000; // 20 minutos

    const tick = async () => {
      try {
        const st: ProcessingStatus = await fetchProcessingStatus(jobId);
        if (!isMounted.current) return;

        if (st.status === 'done') {
          setReady({ fileIdFinal: st.fileIdFinal, webViewLink: st.webViewLink, webContentLink: st.webContentLink });
          setFinished(true);
          if (!didNavigate.current) {
            didNavigate.current = true;
            router.replace({
              pathname: '/pago',
              params: {
                fileIdFinal: st.fileIdFinal,
                webViewLink: st.webViewLink || '',
                webContentLink: st.webContentLink || '',
                jobId,
              },
            });
          }
          return; // no reprogramar más ticks
        }

        if (st.status === 'error') {
          setError(st.message || 'Error en el procesamiento');
          return;
        }

        // backoff suave hasta 10s
        intervalMs = Math.min(intervalMs + 1000, 10000);
        schedule();
      } catch (e: any) {
        if (!isMounted.current) return;
        setError(e?.message || 'No se pudo consultar el estado');
      }
    };

    let timeoutHandle: any;
    let timer: any;

    const schedule = () => {
      timer = setTimeout(tick, intervalMs);
    };

    // timeout global
    timeoutHandle = setTimeout(() => {
      if (!isMounted.current) return;
      setError('Se excedió el tiempo de espera (20 min). Intentalo de nuevo.');
    }, TIMEOUT);

    // primer tick
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

  return (
    <LinearGradient colors={['#02001A', '#02001A']} style={styles.container}>
      <Image source={require('../assets/mustlogin.png')} style={styles.background} resizeMode="cover" />
      <Text style={styles.title}>PROCESANDO MODELO</Text>

      <View style={styles.center}>
        <Animated.View
          style={[
            styles.card,
            { transform: [{ rotate: progress.interpolate({ inputRange: [0, 1], outputRange: ['-15deg', '15deg'] }) }] },
          ]}
        />
        <View style={styles.shadow} />
      </View>

      {!finished ? (
        <View style={styles.bottomTextBox}>
          <Text style={styles.bottomText}>Nuestra inteligencia artificial ya está</Text>
          <Text style={styles.bottomText}>procesando el modelo</Text>
        </View>
      ) : (
        <View style={styles.bottomTextBox}>
          <Text style={styles.bottomText}>¡Procesamiento finalizado!</Text>
        </View>
      )}

      {!finished && !error && (
        <View style={styles.progressWrapper}>
          <View style={styles.barBackground}>
            <Animated.View style={[styles.barFill, { width: widthInterpolated }]} />
          </View>
          <View style={styles.smallBar} />
        </View>
      )}

      {error && (
        <View style={{ position: 'absolute', bottom: 80, paddingHorizontal: 24, alignItems: 'center' }}>
          <Text style={{ color: 'tomato', textAlign: 'center', marginBottom: 10 }}>{error}</Text>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => {
              // podés reintentar navegando de nuevo a esta misma ruta con el mismo jobId
              if (!didNavigate.current) {
                didNavigate.current = true;
                // re-cargar esta misma pantalla para reintentar
                router.replace({ pathname: '/finaloader', params: { jobId: jobId || '' } });
              }
            }}
            activeOpacity={0.9}
          >
            <Text style={styles.continueText}>REINTENTAR</Text>
          </TouchableOpacity>
        </View>
      )}

      {finished && ready && !error && (
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => {
            if (didNavigate.current) return;
            didNavigate.current = true;
            router.replace({
              pathname: '/plantillalista',
              params: {
                fileIdFinal: ready.fileIdFinal,
                webViewLink: ready.webViewLink || '',
                webContentLink: ready.webContentLink || '',
                jobId: jobId || '',
              },
            });
          }}
          activeOpacity={0.9}
        >
          <Text style={styles.continueText}>CONTINUAR</Text>
        </TouchableOpacity>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#02001A', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  background: { position: 'absolute', width: 600, height: 1000, top: -100, left: -100 },
  title: { position: 'absolute', top: 90, color: '#FFFFFF', fontSize: 18, fontWeight: '700', letterSpacing: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { width: 160, height: 220, backgroundColor: '#6DFFD5', borderRadius: 24 },
  shadow: { width: 200, height: 40, borderRadius: 40, backgroundColor: 'rgba(0,0,0,0.35)', marginTop: 20, opacity: 0.7 },
  bottomTextBox: { marginBottom: 7, alignItems: 'center' },
  bottomText: { color: '#FFFFFF', fontSize: 14, textAlign: 'center' },
  progressWrapper: { position: 'absolute', bottom: 40, width: '100%', alignItems: 'center', gap: 10 },
  barBackground: { width: '80%', height: 6, borderRadius: 999, backgroundColor: '#05003F', overflow: 'hidden', flexDirection: 'row' },
  barFill: { height: '100%', borderRadius: 999, backgroundColor: '#6DFFD5' },
  smallBar: { width: '35%', height: 4, borderRadius: 999, backgroundColor: '#FFFFFF' },
  continueButton: { position: 'absolute', bottom: 60, backgroundColor: '#6DFFD5', paddingVertical: 12, paddingHorizontal: 60, borderRadius: 12, elevation: 5 },
  continueText: { color: '#05003F', fontWeight: '700', fontSize: 16 },
});

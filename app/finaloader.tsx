import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function AnalizandoModelo() {
  const router = useRouter();
  const progress = useRef(new Animated.Value(0)).current;
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 4000, // duración total de la animación
      useNativeDriver: false,
    }).start(() => {
      // Cuando termina, mostrar botón
      setFinished(true);
    });
  }, []);

  const widthInterpolated = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['10%', '100%'],
  });

  return (
    <LinearGradient colors={['#02001A', '#02001A']} style={styles.container}>
      {/* 🔹 Fondo visual difuso como mustlogin */}
      <Image
        source={require('../assets/mustlogin.png')}
        style={styles.background}
        resizeMode="cover"
      />

      {/* 🔹 Título */}
      <Text style={styles.title}>PROCESANDO MODELO</Text>

      {/* 🔹 Tarjeta animada */}
      <View style={styles.center}>
        <Animated.View
          style={[
            styles.card,
            {
              transform: [
                { rotate: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['-15deg', '15deg'],
                  })
                },
              ],
            },
          ]}
        />
        <View style={styles.shadow} />
      </View>

      {/* 🔹 Texto inferior */}
      {!finished ? (
        <View style={styles.bottomTextBox}>
          <Text style={styles.bottomText}>
            Nuestra inteligencia artificial ya está
          </Text>
          <Text style={styles.bottomText}>procesando el modelo</Text>
        </View>
      ) : (
        <View style={styles.bottomTextBox}>
          <Text style={styles.bottomText}>¡Procesamiento finalizado!</Text>
        </View>
      )}

      {/* 🔹 Barra de progreso */}
      {!finished && (
        <View style={styles.progressWrapper}>
          <View style={styles.barBackground}>
            <Animated.View style={[styles.barFill, { width: widthInterpolated }]} />
          </View>
          <View style={styles.smallBar} />
        </View>
      )}

      {/* 🔹 Botón CONTINUAR */}
      {finished && (
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => router.push('/pago')}
          activeOpacity={0.9}
        >
          <Text style={styles.continueText}>CONTINUAR</Text>
        </TouchableOpacity>
      )}
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
  card: {
    width: 160,
    height: 220,
    backgroundColor: '#6DFFD5',
    borderRadius: 24,
  },
  shadow: {
    width: 200,
    height: 40,
    borderRadius: 40,
    backgroundColor: 'rgba(0,0,0,0.35)',
    marginTop: 20,
    opacity: 0.7,
  },
  bottomTextBox: {
    marginBottom: 7,
    alignItems: 'center',
  },
  bottomText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
  },
  progressWrapper: {
    position: 'absolute',
    bottom: 40,
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
  continueButton: {
    position: 'absolute',
    bottom: 60,
    backgroundColor: '#6DFFD5',
    paddingVertical: 12,
    paddingHorizontal: 60,
    borderRadius: 12,
    elevation: 5,
  },
  continueText: {
    color: '#05003F',
    fontWeight: '700',
    fontSize: 16,
  },
});

// app/AnalizandoModelo.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function AnalizandoModelo() {
  const router = useRouter();
  const progress = useRef(new Animated.Value(0)).current;
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    // escuchar cambios de Animated.Value para actualizar el % en texto
    const id = progress.addListener(({ value }) => {
      setPercent(Math.round(value * 100));
    });

    // animamos la barra de 0 a 1 en 4 segundos
    Animated.timing(progress, {
      toValue: 1,
      duration: 4000,
      useNativeDriver: false, // animamos width
    }).start(() => {
      router.push('/resultadoFinal');
    });

    return () => {
      progress.removeListener(id);
    };
  }, []);

  const widthInterpolated = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['10%', '100%'],
  });

  return (
    <View style={styles.container}>
      {/* 🔵 Fondo con imagen mustlogin.png */}
      <Image
        source={require('../assets/mustlogin.png')}
        style={styles.background}
        resizeMode="cover"
      />

      {/* Título arriba */}
      <View style={styles.header}>
        <Text style={styles.title}>PROCESANDO MODELO</Text>
      </View>

      {/* Tarjeta + "sombra" */}
      <View style={styles.center}>
        <View style={styles.card} />

        <View style={styles.shadow} />
      </View>

      {/* Texto explicativo */}
      <View style={styles.bottomTextBox}>
        <Text style={styles.bottomText}>
          Nuestra inteligencia artificial ya está
        </Text>
        <Text style={styles.bottomText}>
          procesando el modelo
        </Text>
      </View>

      {/* Barra de progreso abajo */}
      <View style={styles.progressWrapper}>
        <View style={styles.barBackground}>
          <Animated.View style={[styles.barFill, { width: widthInterpolated }]} />
        </View>

        {/* barrita blanca fina abajo como en el diseño */}
        <View style={styles.smallBar} />

        {/* si querés mostrar el porcentaje */}
        {/* <Text style={styles.percent}>{percent}%</Text> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020016',
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    width,
    height,
  },
  header: {
    position: 'absolute',
    top: 80,
    width: '100%',
    alignItems: 'center',
  },
  title: {
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
    backgroundColor: '#CFFFF3',
    borderRadius: 24,
    transform: [{ rotate: '-18deg' }],
  },
  shadow: {
    width: 200,
    height: 40,
    borderRadius: 40,
    backgroundColor: 'rgba(0,0,0,0.35)',
    marginTop: 16,
    opacity: 0.7,
  },
  bottomTextBox: {
    marginBottom: 80,
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
  percent: {
    marginTop: 4,
    color: '#D2FFF2',
    fontSize: 12,
  },
});

import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Switch, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(true);
  const router = useRouter();

  const theme = {
    backgroundColor: darkMode ? '#020016' : '#CBFFEF',
    boxBorderColor: darkMode ? '#CBFFEF' : '#020016',
    textColor: darkMode ? '#CBFFEF' : '#020016',
    circleColor: darkMode ? '#D9D9D9' : '#020016',
    lineShort: darkMode ? '#CBFFEF' : '#020016',
    lineLong: darkMode ? '#9EB8B7' : '#444444',
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      
      {/* Switch para modo claro/oscuro */}
      <View style={styles.switchContainer}>
        <Switch
          value={!darkMode}
          onValueChange={() => setDarkMode(!darkMode)}
          thumbColor={theme.boxBorderColor}
          trackColor={{ false: '#aaa', true: '#444' }}
        />
      </View>

      {/* Top: cuadrado (botón atrás) + círculo */}
      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <View style={[styles.square, { backgroundColor: theme.boxBorderColor }]} />
        </TouchableOpacity>

        <View style={[styles.circle, { backgroundColor: theme.circleColor }]} />
      </View>

      {/* Barras */}
      <View style={[styles.lineShort, { backgroundColor: theme.lineShort }]} />
      <View style={[styles.lineLong, { backgroundColor: theme.lineLong }]} />

      {/* Cuadrícula 2x2 */}
      <View style={styles.grid}>
        {[...Array(4)].map((_, i) => (
          <View key={i} style={[styles.smallBox, { borderColor: theme.boxBorderColor }]} />
        ))}
      </View>

      {/* Caja grande */}
      <View style={[styles.largeBox, { borderColor: theme.boxBorderColor }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  switchContainer: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  square: {
    width: 30,
    height: 30,
    borderRadius: 6,
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginLeft: 20,
  },
  lineShort: {
    width: width * 0.8,
    height: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  lineLong: {
    width: width * 0.9,
    height: 10,
    borderRadius: 10,
    marginVertical: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  smallBox: {
    width: (width - 64) / 2,
    height: 91,
    backgroundColor: 'transparent',
    borderWidth: 3,
    borderRadius: 12,
    marginBottom: 12,
  },
  largeBox: {
    width: '100%',
    height: 91,
    backgroundColor: 'transparent',
    borderWidth: 3,
    borderRadius: 12,
    marginTop: 12,
  },
});

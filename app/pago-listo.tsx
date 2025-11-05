import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PagoListo() {
  return (
    <View style={styles.c}>
      <Text style={styles.t}>¡Pago aprobado! ✅</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#020016' },
  t: { color: '#D2FFF2', fontSize: 18 }
});

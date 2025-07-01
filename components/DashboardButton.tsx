import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

export default function DashboardButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.topButton}>
      <View style={styles.circle} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
});

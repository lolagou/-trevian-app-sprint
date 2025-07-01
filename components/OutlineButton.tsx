// components/OutlineButton.tsx
import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';

interface Props {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
}

export default function OutlineButton({ label, onPress, style }: Props) {
  return (
    <Pressable style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#6DFFD5',
    width: 300,
    height: 39,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#6DFFD5',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

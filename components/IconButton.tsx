// components/IconButton.tsx
import React from 'react';
import { Pressable, Text, StyleSheet, Image, View, ViewStyle } from 'react-native';

interface Props {
  label: string;
  icon: any;
  onPress: () => void;
  style?: ViewStyle;
}

export default function IconButton({ label, icon, onPress, style }: Props) {
  return (
    <Pressable style={[styles.button, style]} onPress={onPress}>
      <View style={styles.content}>
        <Image source={icon} style={styles.icon} />
        <Text style={styles.text}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#CBFFEF',
    paddingVertical: 10,
    borderRadius: 8,
    width: 300,
    marginTop: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  text: {
    color: '#000',
    fontWeight: '500',
  },
});

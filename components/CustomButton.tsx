
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

type Props = {
  text: string;
  onPress: () => void;
  variant?: 'solid' | 'outline';
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export default function CustomButton({ text, onPress, variant = 'solid', style, textStyle }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.base,
        variant === 'solid' ? styles.solid : styles.outline,
        style,
      ]}
    >
      <Text style={[styles.text, variant === 'outline' && styles.outlineText, textStyle]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    width: 300,
    height: 39,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  solid: {
    backgroundColor: '#6DFFD5',
  },
  outline: {
    borderWidth: 2,
    borderColor: '#6DFFD5',
    backgroundColor: 'transparent',
  },
  text: {
    fontWeight: 'bold',
    color: '#020019',
    fontSize: 16,
  },
  outlineText: {
    color: '#6DFFD5',
  },
});

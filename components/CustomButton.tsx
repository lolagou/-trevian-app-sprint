import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';

type Props = {
  /** Alias de texto principal */
  label?: string;
  /** Compat: sigue funcionando si ya usabas `text` */
  text?: string;
  /** Alternativa: <CustomButton>Texto</CustomButton> */
  children?: React.ReactNode;

  onPress: () => void | Promise<void>;
  variant?: 'solid' | 'outline';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
};

export default function CustomButton({
  label,
  text,
  children,
  onPress,
  variant = 'solid',
  style,
  textStyle,
  disabled = false,
}: Props) {
  const content = label ?? text ?? children ?? null;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[
        styles.base,
        variant === 'solid' ? styles.solid : styles.outline,
        disabled && { opacity: 0.6 },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          variant === 'outline' && styles.outlineText,
          textStyle,
        ]}
      >
        {content}
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
  solid: { backgroundColor: '#6DFFD5' },
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
  outlineText: { color: '#6DFFD5' },
});



import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function AnimatedCardCarousel() {
  const translateX = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(translateX, {
            toValue: -width,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.85,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(200),
        Animated.parallel([
          Animated.timing(translateX, {
            toValue: width,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1.15,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(translateX, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          transform: [{ translateX }, { scale }],
        },
      ]}
    >
      <Text style={styles.text}>Tu plantilla personalizada te espera</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: width * 0.8,
    height: 120,
    backgroundColor: '#6DFFD5',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  text: {
    color: '#05003F',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

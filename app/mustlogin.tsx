import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import CustomButton from '../components/CustomButton';
import CTAsecundario from '../components/CTAsecundario';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';

const { width, height } = Dimensions.get('window');

export default function MustLogin() {
  const router = useRouter();

  // ✅ Cargar la fuente
  const [fontsLoaded] = useFonts({
    'Onest-Medium': require('../assets/fonts/Onest-Medium.ttf'),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/mustlogin.png')}
        style={styles.expandedBackground}
        resizeMode="cover"
      />

      <View style={styles.overlay}>
        <Image
          source={require('../assets/plantillanot.png')}
          style={styles.lockImage}
          resizeMode="contain"
        />

        <Text style={[styles.description, { fontFamily: 'Onest-Medium' }]}>
          Para crear tu plantilla tendrás que{'\n'}iniciar sesión o registrarte
        </Text>

        <CustomButton
          text="INICIAR SESIÓN"
          onPress={() => router.push('/login')}
          style={{ marginTop: 106 }}
        />

        <CTAsecundario
          text="REGISTRATE"
          onPress={() => router.push('/register')}
          style={{ marginTop: 16 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020016',
    overflow: 'hidden', 
  },
  expandedBackground: {
    position: 'absolute',
    width: 600,
    height: 1000,
    top: -100,
    left: -100,
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  lockImage: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
  description: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});

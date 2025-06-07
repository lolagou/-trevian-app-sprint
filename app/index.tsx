import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';

export default function Home() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 800 }}>
        <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Trevian</Text>
        <View style={styles.heroBox} />
        <View style={styles.card}>
          <View style={styles.barLarge} />
          {[...Array(3)].map((_, i) => (
            <View key={i} style={styles.barSmall} />
          ))}
        </View>
      </MotiView>
      <Pressable style={styles.button} onPress={() => router.push('/scan')}>
        <Text style={styles.buttonText}>Empezar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#07052F', padding: 24, justifyContent: 'space-between' },
  logo: { width: 48, height: 48, marginBottom: 16 },
  title: { color: '#8DFFE0', fontSize: 24, fontWeight: '600' },
  heroBox: { backgroundColor: '#8DFFE0', height: 192, borderRadius: 12, marginTop: 32 },
  card: { backgroundColor: '#0D004E', borderRadius: 16, padding: 24, marginTop: 24 },
  barLarge: { backgroundColor: '#8DFFE0', height: 20, width: 160, borderRadius: 6, marginBottom: 12 },
  barSmall: { backgroundColor: '#8DFFE0', height: 12, borderRadius: 6, marginBottom: 8 },
  button: { backgroundColor: '#51F7D0', padding: 20, borderRadius: 16 },
  buttonText: { textAlign: 'center', fontWeight: 'bold', color: '#000' },
});
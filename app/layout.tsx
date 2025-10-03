// app/_layout.tsx
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';

const APP_BG = '#020016';

export default function Layout() {
  return (
    <SafeAreaProvider>
      {/* iOS: solo estilo de la status bar */}
      <StatusBar style="light" hidden={false} />

      {/* NO apliques safe area aquí */}
      <SafeAreaView style={{ flex: 1 }} edges={[]}>
        {/* Fondo global que cubre notch y home-indicator */}
        <View style={{ position: 'absolute', inset: 0, backgroundColor: APP_BG }} />

        <Stack
          screenOptions={{
            headerShown: false,
            statusBarStyle: 'light',
            contentStyle: { backgroundColor: 'transparent' },
          }}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

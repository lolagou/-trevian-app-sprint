import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { View, Alert } from 'react-native';
import * as Linking from 'expo-linking';
import { useEffect } from 'react';

const APP_BG = '#020016';

export default function Layout() {
  useEffect(() => {
    const subscription = Linking.addEventListener('url', ({ url }) => {
      console.log('Deep link recibido:', url);
      handleDeepLink(url);
    });

    (async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        console.log('App abierta desde deep link inicial:', initialUrl);
        handleDeepLink(initialUrl);
      }
    })();

    return () => subscription.remove();
  }, []);

  const handleDeepLink = (url: string) => {
    const { path, queryParams } = Linking.parse(url);
    console.log('Ruta:', path, 'Params:', queryParams);

    if (path === 'checkout') {
      const statusParam = queryParams?.status;
      const status = Array.isArray(statusParam) ? statusParam[0] : statusParam;

      if (status === 'approved') {
        Alert.alert('✅ Pago aprobado');
      } else if (status === 'rejected') {
        Alert.alert('❌ Pago rechazado');
      } else {
        Alert.alert('ℹ️ Estado del pago', status || 'desconocido');
      }
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="light" hidden={false} />
      <SafeAreaView style={{ flex: 1 }} edges={[]}>
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

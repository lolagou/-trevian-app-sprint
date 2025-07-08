import { useEffect } from 'react';
import { NativeEventEmitter, NativeModules, DeviceEventEmitter } from 'react-native';
import { useRouter } from 'expo-router';

export default function NavigationBridge() {
  const router = useRouter();

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('goToResult', (event) => {
      const filePath = event?.filePath;
      if (filePath) {
        console.log('📦 Recibido desde Swift:', filePath);
        router.push({ pathname: '/result', params: { filePath } });
      } else {
        console.warn('⚠️ No se recibió filePath');
      }
    });

    return () => subscription.remove();
  }, []);

  return null;
}

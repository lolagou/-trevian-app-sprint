import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import NavigationBridge from '../components/NavigationBridge'; // ✅ Ajustá el path si lo tenés en otra carpeta

export default function Layout() {
  return (
    <>
      <NavigationBridge /> {/* 👈 Escucha eventos de Swift */}
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );

  
}

import React from 'react';
import { View, Button, ActivityIndicator, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

export default function Pago() {
  const [loading, setLoading] = React.useState(false);

  // URL base de tu backend (que genera la preferencia de Mercado Pago)
  const BACKEND_URL = 'https://backend-scanma.vercel.app/api/mercadopago/preference'; 
  // ⚠️ reemplazá esta URL por tu endpoint real donde creás la preferencia

  const handlePagar = async () => {
    try {
      setLoading(true);

      // 1️⃣ Creamos el redirect URL (deep link) que usará Mercado Pago para volver a tu app
      const redirectUrl = Linking.createURL('checkout'); // genera trevian://checkout

      // 2️⃣ Solicitamos al backend una preferencia con back_urls configuradas
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Plantilla personalizada',
          price: 1000,
          quantity: 1,
          back_urls: {
            success: `${redirectUrl}?status=approved`,
            failure: `${redirectUrl}?status=rejected`,
            pending: `${redirectUrl}?status=pending`,
          },
        }),
      });

      const data = await response.json();

      if (!data.init_point) {
        throw new Error('No se obtuvo la URL de Mercado Pago');
      }

      // 3️⃣ Abrimos el navegador integrado de Expo (no Safari/Chrome)
      await WebBrowser.openBrowserAsync(data.init_point);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Hubo un problema al iniciar el pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#020016',
      }}
    >
      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <Button title="Pagar con Mercado Pago 💳" onPress={handlePagar} />
      )}
    </View>
  );
}

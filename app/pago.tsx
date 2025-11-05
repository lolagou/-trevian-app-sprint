import React, { ReactNode } from 'react';
import {
  View, Text, Pressable, StyleSheet, ActivityIndicator, Alert,
  ScrollView, SafeAreaView, useColorScheme, Image, ColorSchemeName,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import CTAButton from '../components/CTAButton';

type NavigationLike = { goBack?: () => void } | undefined;
interface PagoProps { navigation?: NavigationLike; price?: number; }
const router = useRouter();
const visaLogo = require('../assets/visa.png');
const mcLogo   = require('../assets/mastercard.png');
const mpLogo   = require('../assets/mercadopago.png');

export default function Pago({ navigation, price = 89900 }: PagoProps) {
  const [fontsLoaded] = useFonts({
    'Onest-Medium': require('../assets/fonts/Onest-Medium.ttf'),
    'Onest-ExtraBold': require('../assets/fonts/Onest-ExtraBold.ttf'),
  });
  if (!fontsLoaded) return <AppLoading />;

  const scheme: ColorSchemeName = useColorScheme();
  const NAVY = '#02001A';
  const MINT = '#6DFFD5';
  const TEXT = '#D2FFF2';
  const LINE = '#CBFFEF';

  const [loading, setLoading] = React.useState<boolean>(false);
  const [method, setMethod] = React.useState<'mp' | 'visa' | 'mc'>('mp');

  const BACKEND_URL =
    'https://trevian-server.vercel.app/mp/';

  const formatMoney = (n: number): string =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);

  const handlePagar = async (): Promise<void> => {
    if (method !== 'mp') {
      Alert.alert('Próximamente', 'Por ahora solo está habilitado Mercado Pago.');
      return;
    }
    try {
      setLoading(true);
      const redirectUrl = Linking.createURL('checkout');
      const res = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Plantilla personalizada',
          price,
          quantity: 1,
          back_urls: {
            success: `${redirectUrl}?status=approved`,
            failure: `${redirectUrl}?status=rejected`,
            pending: `${redirectUrl}?status=pending`,
          },
        }),
      });
      const data: { init_point?: string } = await res.json();
      if (!data?.init_point) throw new Error('No se obtuvo la URL de Mercado Pago');
      await WebBrowser.openBrowserAsync(data.init_point);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Hubo un problema al iniciar el pago');
    } finally {
      setLoading(false);
    }
  };

  return (

    <View style={styles.flex1}>
      {/* Fondo azul + halo celeste */}
      <Image
  source={require('../assets/fondo-pago.png')}
  style={styles.fullBackground}
  resizeMode="cover"
  blurRadius={0}
/>

      <SafeAreaView style={styles.flex1}>
        <ScrollView contentContainerStyle={styles.scrollPad}>
          {/* Header */}
          <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
  <Text style={[styles.backGlyph, { color: TEXT }]}>‹</Text>
</Pressable>
            <Text style={styles.title}>¡ÚLTIMOS PASOS!</Text>
            <View style={{ width: 28 }} />
          </View>

          {/* Card Métodos de pago (TRANSPARENTE) */}
          <GhostCard lineColor={LINE}>
            <Text style={styles.cardTitle}>MÉTODO DE PAGO</Text>
            <Text style={styles.cardSub}>Seleccione un método de pago para         realizar la compra:</Text>

            <View style={styles.methodsRow}>
              <BrandPill label="Mercado pago" logo={mpLogo} selected={method==='mp'} onPress={()=>setMethod('mp')} lineColor={LINE} />
              <BrandPill label="VISA"          logo={visaLogo} selected={method==='visa'} onPress={()=>setMethod('visa')} lineColor={LINE} />
            </View>
            <View style={styles.methodsRow}>
              <BrandPill label="Mastercard"    logo={mcLogo} selected={method==='mc'} onPress={()=>setMethod('mc')} lineColor={LINE} />
            </View>
          </GhostCard>

          {/* Card Preview + Precio (TRANSPARENTE) */}
          <GhostCard lineColor={LINE}>
            <View style={styles.previewBox}>
              <View style={styles.previewPlaceholder}>
              </View>
            </View>

            <View style={{ marginTop: 16 }}>
            <Text style={styles.previewText}>Previsualización del modelo 3D</Text>
            <Text style={styles.priceLabel}>Precio final:</Text>
              <Text style={styles.priceValue}>{formatMoney(price)}</Text>
            </View>
          </GhostCard>

          {/* CTA Trevian con Onest */}
          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
  <CTAButton
    label={loading ? 'Procesando…' : 'PAGAR'}
    onPress={handlePagar}
  />
</View>

          <Text style={styles.note}>VISA y Mastercard: disponible próximamente.</Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

/* ---------- UI helpers ---------- */
interface GhostCardProps { children: ReactNode; lineColor: string; }
function GhostCard({ children, lineColor }: GhostCardProps) {
  return (
    <View style={[styles.cardOuter, { shadowColor: lineColor }]}>
      <View style={[styles.cardInner, { borderColor: `${lineColor}AA` }]}>{children}</View>
    </View>
  );
}

interface BrandPillProps {
  label: string; logo: number; selected: boolean; onPress: () => void; lineColor: string;
}
function BrandPill({ label, logo, selected, onPress, lineColor }: BrandPillProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        {
          borderColor: selected ? '#6DFFD5' : `${lineColor}66`,
          backgroundColor: selected ? 'rgba(11,7,42,0.75)' : 'rgba(5,0,63,0.35)',
          opacity: pressed ? 0.92 : 1,
        },
      ]}
    >
      <Image source={logo} style={styles.brandIcon} resizeMode="contain" />
      <Text style={styles.pillText}>{label}</Text>
    </Pressable>
  );
}

/* ---------- Styles (todas con Onest) ---------- */
const styles = StyleSheet.create({
  flex1: { flex: 1, backgroundColor: '#020016' },
  scrollPad: { padding: 20, paddingBottom: 28 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 18, justifyContent: 'space-between' },
  backGlyph: { fontSize: 22, fontFamily: 'Onest-Medium' },
  title: { fontSize: 24, color: '#FFFFFF', fontFamily: 'Onest-ExtraBold', letterSpacing: 0.5 },
  cardOuter: { marginBottom: 24, shadowRadius: 12, shadowOffset: { width: 0, height: 0 } },
  cardInner: {
    borderRadius: 12, padding: 16, borderWidth: 2,
    backgroundColor: 'rgba(2,0,26,0.28)',
  },//fijarme bien el padding de arriba y de los costados, esto genera que haya 16 en todos lados
  cardTitle: { fontSize: 16, color: '#D2FFF2', fontFamily: 'Onest-ExtraBold', marginBottom: 6, letterSpacing: 0.4 },
  cardSub: { fontSize: 14, color: '#A7A7A7', fontFamily: 'Onest-Medium', marginBottom: 8, lineHeight: 21 },
  methodsRow: { flexDirection: 'row', gap: 12, marginBottom: 10 },
  pill: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderRadius: 4, paddingVertical: 10, paddingHorizontal: 14,
  },
  fullBackground: {
    ...StyleSheet.absoluteFillObject,  // ocupa toda la pantalla
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: -1,              // queda detrás de todo
    opacity: 0.9,            // opcional: un leve velo si querés que se lea mejor el texto
  },

  brandIcon: { width: 24, height: 16, marginRight: 8 },
  pillText: { fontSize: 14, color: '#D2FFF2', fontFamily: 'Onest-Medium', letterSpacing: 0.3 },
  previewBox: { width: '100%', borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: '#929292', backgroundColor: '#929292' },
  previewPlaceholder: { height: 220, alignItems: 'center', justifyContent: 'center' },
  previewText: { fontSize: 14, color: '#A7A7A7', fontFamily: 'Onest-Medium' },
  priceLabel: { fontSize: 16, fontFamily: 'Onest-ExtraBold', color: '#D2FFF2' },
  priceValue: { fontSize: 24, fontFamily: 'Onest-ExtraBold', color: '#6DFFD5', letterSpacing: 0.32, marginTop: 4 },
  note: { textAlign: 'center', fontSize: 12, color: '#D2FFF299', fontFamily: 'Onest-Medium', marginTop: 12 },
});



// app/dashboard.tsx
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Switch,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import CTAButton from '../components/CTAButton';

const { width } = Dimensions.get('window');

/** Paleta base */
const COLORS = {
  darkBg: '#020016',
  lightBg: '#CBFFEF',
  darkText: '#CBFFEF',
  darkBody: '#D2FFF2',
  lightText: '#05003F',
  accentDark: '#6DFFD5', // acento cuando fondo es oscuro
  accentLight: '#05003F', // acento cuando fondo es claro
};

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(true);
  const router = useRouter();

  const t = useMemo(() => {
    const accent = darkMode ? COLORS.accentDark : COLORS.accentLight;
    const title = darkMode ? COLORS.darkText : COLORS.lightText;
    const body = darkMode ? COLORS.darkBody : COLORS.lightText;

    return {
      bg: darkMode ? COLORS.darkBg : COLORS.lightBg,
      accent,
      title,
      body,
      avatar: darkMode ? '#D9D9D9' : '#020016',
      // botones
      ctaBg: accent,
      ctaText: darkMode ? '#030026' : COLORS.lightBg,
      outlineBorder: accent,
      outlineText: title,
    };
  }, [darkMode]);

  /** item etiqueta + valor (columna) */
  const LabelValue = ({
    label,
    value,
  }: {
    label: string;
    value: string;
  }) => (
    <View style={{ marginBottom: 14, maxWidth: (width - 40) / 2 - 12 }}>
      <Text style={[styles.label, { color: t.accent }]}>{label}</Text>
      <Text style={[styles.value, { color: t.body }]}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.bg }]}>
      {/* Fondo */}
      <Image
        source={
          darkMode
            ? require('../assets/mustlogin.png')
            : require('../assets/dashboardgradient.png')
        }
        style={styles.expandedBackground}
        resizeMode="cover"
      />

      {/* Header: back + switch */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={[styles.backArrow, { color: t.title }]}>‹</Text>
        </TouchableOpacity>

        <Switch
          value={!darkMode}
          onValueChange={() => setDarkMode((v) => !v)}
          thumbColor={t.accent}
          trackColor={{ false: '#556', true: '#9BB' }}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 28 }}
      >
        {/* Avatar + nombre */}
        <View style={styles.heroRow}>
          <View style={[styles.avatar, { backgroundColor: t.avatar }]} />
          <Text style={[styles.name, { color: t.title }]}>
            Lola Emma Nuñez Gouget
          </Text>
        </View>

        {/* Información personal */}
        <Text style={[styles.sectionTitle, { color: t.title }]}>
          INFORMACIÓN PERSONAL
        </Text>

        <View style={{ marginBottom: 16 }}>
          <Text style={[styles.label, { color: t.accent }]}>MAIL</Text>
          <Text style={[styles.value, { color: t.body }]}>
            lolaemmanunez@gmail.com
          </Text>
        </View>

        <View style={{ marginBottom: 22 }}>
          <Text style={[styles.label, { color: t.accent }]}>NÚMERO DE TELÉFONO</Text>
          <Text style={[styles.value, { color: t.body }]}>
            +54 911 6453 7832
          </Text>
        </View>

        {/* Domicilio */}
        <Text style={[styles.sectionTitle, { color: t.title }]}>
          DOMICILIO
        </Text>

        <View style={styles.twoCols}>
          <LabelValue label="CALLE" value="Av. Libertador" />
          <LabelValue label="TIPO" value="Casa" />
          <LabelValue label="ALTURA" value="7542" />
          <LabelValue label="CÓDIGO POSTAL" value="1424" />
          <LabelValue label="PROVINCIA" value="Buenos Aires" />
          <LabelValue label="CIUDAD" value="General Belgrano" />
        </View>

        {/* Botones */}
        <View style={{ marginTop: 18 }}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => {/* guardar cambios */}}
            style={[
              styles.ctaPrimary,
              { backgroundColor: t.ctaBg, shadowColor: t.ctaBg },
            ]}
          >
            <Text style={[styles.ctaPrimaryText, { color: t.ctaText }]}>
              GUARDAR CAMBIOS
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => {/* descartar cambios */}}
            style={[
              styles.ctaOutline,
              { borderColor: t.outlineBorder },
            ]}
          >
            <Text style={[styles.ctaOutlineText, { color: t.outlineText }]}>
              DESCARTAR CAMBIOS
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/** Layout + estilos */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    overflow: 'hidden',
  },

  expandedBackground: {
    position: 'absolute',
    width: 600,
    height: 1000,
    top: -100,
    left: -100,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 8,
  },
  backArrow: {
    fontSize: 28,
    fontWeight: '600',
  },

  heroRow: {
    marginTop: 8,
    marginBottom: 18,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginBottom: 14,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
  },

  sectionTitle: {
    marginTop: 6,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  label: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  value: {
    fontSize: 14,
    marginTop: 4,
  },

  twoCols: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    columnGap: 12,
  },

  ctaPrimary: {
    height: 39,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  ctaPrimaryText: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  ctaOutline: {
    height: 39,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginTop: 12,
  },
  ctaOutlineText: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

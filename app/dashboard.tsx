// app/dashboard.tsx
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Switch,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CTAButton from '../components/CTAButton';

const { width } = Dimensions.get('window');

/** Paleta base */
const COLORS = {
  darkBg: '#020016',
  lightBg: '#CBFFEF',
  darkText: '#CBFFEF',
  darkBody: '#D2FFF2',
  lightText: '#05003F',
  accentDark: '#6DFFD5',
  accentLight: '#05003F',
};

type User = {
  id?: string;
  email?: string;
  name?: string;
  surname?: string;
  created_at?: string;
};

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(true);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
      ctaBg: accent,
      ctaText: darkMode ? '#030026' : COLORS.lightBg,
      outlineBorder: accent,
      outlineText: title,
    };
  }, [darkMode]);

  /** item etiqueta + valor (columna) */
  const LabelValue = ({ label, value }: { label: string; value: string }) => (
    <View style={{ marginBottom: 14, maxWidth: (width - 40) / 2 - 12 }}>
      <Text style={[styles.label, { color: t.accent }]}>{label}</Text>
      <Text style={[styles.value, { color: t.body }]}>{value}</Text>
    </View>
  );

  const loadFromStorage = useCallback(async (): Promise<User | null> => {
    try {
      const raw = await AsyncStorage.getItem('user');
      if (raw) return JSON.parse(raw) as User;
    } catch {}
    return null;
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (!token) {
        // sin token → mandamos a login
        const localUser = await loadFromStorage();
        if (localUser) setProfile(localUser);
        router.replace('/login');
        return;
      }

      const res = await fetch('https://trevian-server.vercel.app/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => ({} as any));

      if (!res.ok) {
        // si el token expiró o es inválido
        const msg = data?.message || `Error ${res.status}`;
        // intento mostrar usuario local y aviso
        const localUser = await loadFromStorage();
        if (localUser) setProfile(localUser);
        Alert.alert('Sesión', msg);
        if (res.status === 401) router.replace('/login');
        return;
      }

      // data.success === true, data.data = perfil
      const user: User = data?.data || {};
      setProfile(user);
      // actualizo cache local para uso offline
      await AsyncStorage.setItem('user', JSON.stringify(user));
    } catch (e: any) {
      // offline o error inesperado
      const localUser = await loadFromStorage();
      if (localUser) {
        setProfile(localUser);
        Alert.alert('Offline', 'Mostramos datos guardados.');
      } else {
        Alert.alert('Ups', 'No pudimos cargar tu perfil.');
      }
    }
  }, [loadFromStorage, router]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchProfile();
      setLoading(false);
    })();
  }, [fetchProfile]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProfile();
    setRefreshing(false);
  }, [fetchProfile]);

  const fullName =
    (profile?.name ? profile.name : 'Usuario') +
    (profile?.surname ? ` ${profile.surname}` : '');

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
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={[styles.backArrow, { color: t.title }]}>‹</Text>
        </TouchableOpacity>

        <Switch
          value={!darkMode}
          onValueChange={() => setDarkMode((v) => !v)}
          thumbColor={t.accent}
          trackColor={{ false: '#556', true: '#9BB' }}
        />
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
          <Text style={{ color: t.title, marginTop: 8 }}>Cargando perfil…</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 28 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Avatar + nombre */}
          <View style={styles.heroRow}>
            <View style={[styles.avatar, { backgroundColor: t.avatar }]} />
            <Text style={[styles.name, { color: t.title }]} numberOfLines={1}>
              {fullName || 'Usuario'}
            </Text>
          </View>

          {/* Información personal */}
          <Text style={[styles.sectionTitle, { color: t.title }]}>
            INFORMACIÓN PERSONAL
          </Text>

          <View style={{ marginBottom: 16 }}>
            <Text style={[styles.label, { color: t.accent }]}>MAIL</Text>
            <Text style={[styles.value, { color: t.body }]}>
              {profile?.email || '—'}
            </Text>
          </View>

          <View style={{ marginBottom: 22 }}>
            <Text style={[styles.label, { color: t.accent }]}>
              NÚMERO DE TELÉFONO
            </Text>
            <Text style={[styles.value, { color: t.body }]}>—</Text>
          </View>

          {/* Domicilio (placeholder hasta que tengas estos campos en el back) */}
          <Text style={[styles.sectionTitle, { color: t.title }]}>DOMICILIO</Text>

          <View style={styles.twoCols}>
            <LabelValue label="CALLE" value="—" />
            <LabelValue label="TIPO" value="—" />
            <LabelValue label="ALTURA" value="—" />
            <LabelValue label="CÓDIGO POSTAL" value="—" />
            <LabelValue label="PROVINCIA" value="—" />
            <LabelValue label="CIUDAD" value="—" />
          </View>

          {/* Botones */}
          <View style={{ marginTop: 18 }}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onRefresh}
              style={[
                styles.ctaPrimary,
                { backgroundColor: t.ctaBg, shadowColor: t.ctaBg },
              ]}
            >
              <Text style={[styles.ctaPrimaryText, { color: t.ctaText }]}>
                ACTUALIZAR PERFIL
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={async () => {
                // ejemplo: logout rápido
                await SecureStore.deleteItemAsync('auth_token');
                await AsyncStorage.removeItem('user');
                router.replace('/login');
              }}
              style={[styles.ctaOutline, { borderColor: t.outlineBorder }]}
            >
              <Text style={[styles.ctaOutlineText, { color: t.outlineText }]}>
                CERRAR SESIÓN
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
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

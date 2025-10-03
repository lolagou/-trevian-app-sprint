import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_BASE = 'https://trevian-server.vercel.app';

export type User = { id: string; email: string; name?: string; surname?: string };

export async function saveSession(token: string, user?: User | null) {
  await SecureStore.setItemAsync('auth_token', token);
  if (user) await AsyncStorage.setItem('user', JSON.stringify(user));
}

export async function getToken() {
  return SecureStore.getItemAsync('auth_token');
}

export async function getCachedUser(): Promise<User | null> {
  const raw = await AsyncStorage.getItem('user');
  return raw ? (JSON.parse(raw) as User) : null;
}

export async function refreshProfile(): Promise<User> {
  const token = await getToken();
  if (!token) throw new Error('No hay token');

  const r = await fetch(`${API_BASE}/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j?.message || 'No se pudo obtener el perfil');

  const user = j.data as User;
  await AsyncStorage.setItem('user', JSON.stringify(user));
  return user;
}

export async function clearSession() {
  await SecureStore.deleteItemAsync('auth_token');
  await AsyncStorage.removeItem('user');
}

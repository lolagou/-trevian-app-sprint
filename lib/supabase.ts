import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://peutxcbxleqabbtujbzf.supabase.co';
// ⚠️ Mejor ponerlo en .env y NO hardcodear en prod
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBldXR4Y2J4bGVxYWJidHVqYnpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzNDExNDQsImV4cCI6MjA2NDkxNzE0NH0.-qTmXGLFk9hbbDA9yA0gE2Sh9JLKll4g-Ejp8K3KMsY';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    // RN no usa localStorage; supabase-js ya maneja memoria, y nosotros reforzamos con SecureStore
    persistSession: false,
    detectSessionInUrl: false,
  },
});

export default supabase;

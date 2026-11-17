import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Reemplaza estas dos claves con las de tu proyecto en https://supabase.com
export const SUPABASE_URL = 'https://tu-proyecto.supabase.co';
export const SUPABASE_ANON_KEY = 'tu-anon-key-aqui';

// Detecta si se han configurado credenciales reales
export const isSupabaseConfigured = () => {
  return (
    SUPABASE_URL !== 'https://tu-proyecto.supabase.co' &&
    SUPABASE_ANON_KEY !== 'tu-anon-key-aqui'
  );
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

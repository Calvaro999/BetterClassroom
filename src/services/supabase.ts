import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Configuración de tu proyecto Supabase BetterClassroom
export const SUPABASE_URL = 'https://ygcxxncoivaoergnywlc.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_Td5AHhA9AMDBA9857N7fwA_UAHa33sQ';

export const isSupabaseConfigured = () => {
  return (
    Boolean(SUPABASE_URL) &&
    Boolean(SUPABASE_ANON_KEY) &&
    !SUPABASE_URL.includes('tu-proyecto')
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

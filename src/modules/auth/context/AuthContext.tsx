import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from '../../../services/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isGuest: boolean;
  loginAsGuest: () => void;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GUEST_STORAGE_KEY = '@betterclassroom_guest_mode';
const LOCAL_USER_KEY = '@betterclassroom_local_user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // 1. Cargar estado de sesión
    const initializeAuth = async () => {
      try {
        const guestStored = await AsyncStorage.getItem(GUEST_STORAGE_KEY);
        if (guestStored === 'true') {
          setIsGuest(true);
        }

        const localUserStored = await AsyncStorage.getItem(LOCAL_USER_KEY);
        if (localUserStored) {
          const parsedUser = JSON.parse(localUserStored);
          setUser(parsedUser as User);
        }

        if (isSupabaseConfigured()) {
          const { data } = await supabase.auth.getSession();
          if (data.session) {
            setSession(data.session);
            setUser(data.session.user);
            setIsGuest(false);
          }

          // Escuchar cambios de autenticación
          supabase.auth.onAuthStateChange((_event, newSession) => {
            setSession(newSession);
            setUser(newSession?.user ?? null);
            if (newSession) {
              setIsGuest(false);
            }
          });
        }
      } catch (e) {
        console.warn('Error inicializando autenticación:', e);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const loginAsGuest = async () => {
    setIsGuest(true);
    await AsyncStorage.setItem(GUEST_STORAGE_KEY, 'true');
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured()) {
        const { error, data } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) return { error: error.message };
        setSession(data.session);
        setUser(data.user);
        setIsGuest(false);
        await AsyncStorage.removeItem(GUEST_STORAGE_KEY);
        return {};
      } else {
        // Modo simulado / local si aún no ha puesto sus claves de Supabase
        const mockUser: any = {
          id: `user-${Date.now()}`,
          email,
          user_metadata: { name: email.split('@')[0] },
        };
        setUser(mockUser);
        setIsGuest(false);
        await AsyncStorage.setItem(LOCAL_USER_KEY, JSON.stringify(mockUser));
        await AsyncStorage.removeItem(GUEST_STORAGE_KEY);
        return {};
      }
    } catch (err: any) {
      return { error: err.message || 'Error al iniciar sesión' };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured()) {
        const { error, data } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) return { error: error.message };
        if (data.user) {
          setUser(data.user);
          setSession(data.session);
          setIsGuest(false);
          await AsyncStorage.removeItem(GUEST_STORAGE_KEY);
        }
        return {};
      } else {
        const mockUser: any = {
          id: `user-${Date.now()}`,
          email,
          user_metadata: { name: email.split('@')[0] },
        };
        setUser(mockUser);
        setIsGuest(false);
        await AsyncStorage.setItem(LOCAL_USER_KEY, JSON.stringify(mockUser));
        await AsyncStorage.removeItem(GUEST_STORAGE_KEY);
        return {};
      }
    } catch (err: any) {
      return { error: err.message || 'Error al registrarse' };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured()) {
        await supabase.auth.signOut();
      }
      setSession(null);
      setUser(null);
      setIsGuest(false);
      await AsyncStorage.removeItem(GUEST_STORAGE_KEY);
      await AsyncStorage.removeItem(LOCAL_USER_KEY);
    } catch (e) {
      console.warn('Error al cerrar sesión:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isGuest,
        loginAsGuest,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};


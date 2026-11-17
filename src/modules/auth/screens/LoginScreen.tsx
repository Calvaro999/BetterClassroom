import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../../../context/AppContext';
import { Input, Button, TexturedBackground } from '../../../components/common';
import { isSupabaseConfigured } from '../../../services/supabase';

export const LoginScreen: React.FC = () => {
  const { signIn, signUp, loginAsGuest, isLoading } = useAuth();
  const { themeColors, isDarkMode, toggleDarkMode } = useApp();

  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async () => {
    setErrorMessage('');
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Por favor ingresa tu correo y contraseña');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (isRegistering) {
      const { error } = await signUp(email.trim(), password);
      if (error) {
        setErrorMessage(error);
      } else {
        Alert.alert(
          'Registro Exitoso',
          'Tu cuenta ha sido creada. ¡Bienvenido a BetterClassroom!'
        );
      }
    } else {
      const { error } = await signIn(email.trim(), password);
      if (error) {
        setErrorMessage(error);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[
        styles.container,
        { backgroundColor: themeColors.background },
      ]}
    >
      <TexturedBackground />

      {/* Botón superior de tema oscuro/claro */}
      <View style={styles.topThemeRow}>
        <TouchableOpacity
          style={[
            styles.themeToggleBtn,
            {
              backgroundColor: themeColors.surface,
              borderColor: themeColors.border,
            },
          ]}
          onPress={toggleDarkMode}
          activeOpacity={0.7}
        >
          <Text style={styles.themeToggleText}>
            {isDarkMode ? '☀️' : '🌙'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabecera / Logo */}
        <View style={styles.logoSection}>
          <View
            style={[
              styles.logoIconCircle,
              { backgroundColor: themeColors.primary },
            ]}
          >
            <Text style={styles.logoEmoji}>🏫</Text>
          </View>
          <Text style={[styles.brandName, { color: themeColors.text }]}>
            BetterClassroom
          </Text>
          <Text
            style={[styles.brandSubtitle, { color: themeColors.textMuted }]}
          >
            Sistema de Aulas, Cursos y Pupitres
          </Text>
        </View>

        {/* Tarjeta del Formulario */}
        <View
          style={[
            styles.formCard,
            {
              backgroundColor: themeColors.surface,
              borderColor: themeColors.border,
            },
          ]}
        >
          {/* Selector Pestaña: Iniciar Sesión vs Crear Cuenta */}
          <View
            style={[
              styles.tabSelector,
              {
                backgroundColor: themeColors.surfaceVariant,
                borderColor: themeColors.border,
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.tabBtn,
                !isRegistering
                  ? { backgroundColor: themeColors.surface }
                  : null,
              ]}
              onPress={() => {
                setIsRegistering(false);
                setErrorMessage('');
              }}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color: !isRegistering
                      ? themeColors.primary
                      : themeColors.textMuted,
                    fontWeight: !isRegistering ? '700' : '500',
                  },
                ]}
              >
                Iniciar Sesión
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabBtn,
                isRegistering
                  ? { backgroundColor: themeColors.surface }
                  : null,
              ]}
              onPress={() => {
                setIsRegistering(true);
                setErrorMessage('');
              }}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color: isRegistering
                      ? themeColors.primary
                      : themeColors.textMuted,
                    fontWeight: isRegistering ? '700' : '500',
                  },
                ]}
              >
                Crear Cuenta
              </Text>
            </TouchableOpacity>
          </View>

          {errorMessage ? (
            <View
              style={[
                styles.errorBox,
                { backgroundColor: themeColors.dangerLight },
              ]}
            >
              <Text
                style={[styles.errorText, { color: themeColors.danger }]}
              >
                {errorMessage}
              </Text>
            </View>
          ) : null}

          <Input
            label="Correo Electrónico"
            placeholder="profesor@colegio.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Input
            label="Contraseña"
            placeholder="••••••••"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Button
            title={
              isLoading
                ? 'Conectando...'
                : isRegistering
                ? 'Crear Cuenta'
                : 'Iniciar Sesión'
            }
            variant="primary"
            size="lg"
            onPress={handleSubmit}
            loading={isLoading}
            style={styles.submitBtn}
          />

          <View style={styles.dividerRow}>
            <View
              style={[
                styles.dividerLine,
                { backgroundColor: themeColors.border },
              ]}
            />
            <Text
              style={[styles.dividerText, { color: themeColors.textLight }]}
            >
              O BIEN
            </Text>
            <View
              style={[
                styles.dividerLine,
                { backgroundColor: themeColors.border },
              ]}
            />
          </View>

          {/* Botón para entrar directamente sin registrarse */}
          <Button
            title="Continuar como Invitado (Modo Demo)"
            variant="outline"
            onPress={loginAsGuest}
            style={styles.guestBtn}
          />
        </View>

        {/* Estado de Supabase */}
        <View style={styles.statusFooter}>
          <Text
            style={[styles.statusText, { color: themeColors.textMuted }]}
          >
            ⚡ Supabase Auth:{' '}
            {isSupabaseConfigured() ? (
              <Text style={{ color: themeColors.success, fontWeight: '700' }}>
                Conectado a la nube
              </Text>
            ) : (
              <Text style={{ color: themeColors.primary, fontWeight: '700' }}>
                Listo para vincular
              </Text>
            )}
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topThemeRow: {
    position: 'absolute',
    top: 48,
    right: 20,
    zIndex: 10,
  },
  themeToggleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  themeToggleText: {
    fontSize: 18,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  logoEmoji: {
    fontSize: 34,
  },
  brandName: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  formCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  tabSelector: {
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    padding: 3,
    marginBottom: 20,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 13,
  },
  errorBox: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 14,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  submitBtn: {
    marginTop: 6,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 11,
    fontWeight: '700',
  },
  guestBtn: {
    width: '100%',
  },
  statusFooter: {
    marginTop: 24,
  },
  statusText: {
    fontSize: 12,
  },
});

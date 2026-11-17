import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../modules/auth/context/AuthContext';

interface HeaderProps {
  title: string;
  subtitle?: string;
  rightActionText?: string;
  onRightActionPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  rightActionText,
  onRightActionPress,
}) => {
  const { themeColors, isDarkMode, toggleDarkMode } = useApp();
  const { user, isGuest, signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert(
      'Cerrar Sesión',
      `¿Deseas salir de la cuenta (${user?.email || 'Modo Invitado'})?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: () => signOut(),
        },
      ]
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: themeColors.surface,
          borderBottomColor: themeColors.border,
        },
      ]}
    >
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: themeColors.text }]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: themeColors.textMuted }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View style={styles.actionsRow}>
        {/* Botón de alternar Modo Oscuro / Claro */}
        <TouchableOpacity
          style={[
            styles.iconBtn,
            {
              backgroundColor: themeColors.surfaceVariant,
              borderColor: themeColors.border,
            },
          ]}
          onPress={toggleDarkMode}
          activeOpacity={0.7}
        >
          <Text style={styles.iconText}>
            {isDarkMode ? '☀️' : '🌙'}
          </Text>
        </TouchableOpacity>

        {/* Botón de Cerrar Sesión / Perfil */}
        <TouchableOpacity
          style={[
            styles.iconBtn,
            {
              backgroundColor: themeColors.surfaceVariant,
              borderColor: themeColors.border,
            },
          ]}
          onPress={handleSignOut}
          activeOpacity={0.7}
        >
          <Text style={styles.iconText}>🚪</Text>
        </TouchableOpacity>

        {rightActionText && onRightActionPress ? (
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: themeColors.primary },
            ]}
            onPress={onRightActionPress}
            activeOpacity={0.8}
          >
            <Text style={styles.actionText}>{rightActionText}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 15,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  actionText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
});

import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useApp } from '../../context/AppContext';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'neutral';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'primary', style }) => {
  const { themeColors } = useApp();

  const getColors = () => {
    switch (variant) {
      case 'primary':
        return { bg: themeColors.primaryLight, text: themeColors.primaryDark };
      case 'secondary':
        return { bg: themeColors.surfaceVariant, text: themeColors.primary };
      case 'success':
        return { bg: themeColors.successLight, text: themeColors.success };
      case 'danger':
        return { bg: themeColors.dangerLight, text: themeColors.danger };
      case 'neutral':
      default:
        return { bg: themeColors.surfaceVariant, text: themeColors.textMuted };
    }
  };

  const scheme = getColors();

  return (
    <View style={[styles.badge, { backgroundColor: scheme.bg }, style]}>
      <Text style={[styles.text, { color: scheme.text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

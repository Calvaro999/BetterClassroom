import React from 'react';
import { StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../../theme';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'primary', style }) => {
  const getColors = () => {
    switch (variant) {
      case 'primary':
        return { bg: colors.primaryLight, text: colors.primaryDark };
      case 'secondary':
        return { bg: colors.secondaryLight, text: colors.secondary };
      case 'success':
        return { bg: colors.successLight, text: colors.success };
      case 'warning':
        return { bg: colors.warningLight, text: colors.warning };
      case 'danger':
        return { bg: colors.dangerLight, text: colors.danger };
      case 'neutral':
      default:
        return { bg: colors.surfaceVariant, text: colors.textMuted };
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
    textTransform: 'uppercase',
  },
});

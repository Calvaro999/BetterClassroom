import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { colors } from '../../theme';

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
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {rightActionText && onRightActionPress ? (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onRightActionPress}
          activeOpacity={0.8}
        >
          <Text style={styles.actionText}>{rightActionText}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  actionButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginLeft: 12,
  },
  actionText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 13,
  },
});

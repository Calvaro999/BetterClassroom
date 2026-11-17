import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors } from '../../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}) => {
  const getContainerStyle = () => {
    const base: ViewStyle[] = [styles.button, styles[`size_${size}`]];
    if (variant === 'primary') base.push(styles.btnPrimary);
    if (variant === 'secondary') base.push(styles.btnSecondary);
    if (variant === 'danger') base.push(styles.btnDanger);
    if (variant === 'outline') base.push(styles.btnOutline);
    if (variant === 'success') base.push(styles.btnSuccess);
    if (disabled || loading) base.push(styles.btnDisabled);
    if (style) base.push(style);
    return base;
  };

  const getTextStyle = () => {
    const base: TextStyle[] = [styles.text, styles[`textSize_${size}`]];
    if (variant === 'outline') base.push(styles.textOutline);
    else base.push(styles.textWhite);
    if (disabled) base.push(styles.textDisabled);
    if (textStyle) base.push(textStyle);
    return base;
  };

  return (
    <TouchableOpacity
      style={getContainerStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' ? colors.primary : colors.white}
        />
      ) : (
        <>
          {icon ? icon : null}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  size_sm: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  size_md: {
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  size_lg: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  btnPrimary: {
    backgroundColor: colors.primary,
  },
  btnSecondary: {
    backgroundColor: colors.secondary,
  },
  btnDanger: {
    backgroundColor: colors.danger,
  },
  btnSuccess: {
    backgroundColor: colors.success,
  },
  btnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: '600',
  },
  textSize_sm: {
    fontSize: 13,
  },
  textSize_md: {
    fontSize: 15,
  },
  textSize_lg: {
    fontSize: 17,
  },
  textWhite: {
    color: colors.white,
  },
  textOutline: {
    color: colors.primary,
  },
  textDisabled: {
    color: colors.textMuted,
  },
});
